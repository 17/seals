import session from '../session'
import loginState from '../stores/login'
import backupState from '../stores/backup'
import notificationState from '../stores/notification'
import helpers from '../utils/helpers'
import request from '../utils/srequest'

const fs = global.require('fs')
// FIXME: 使用 path 合并路径
// const path = global.require('path')
import sqlite from 'sql.js'

const roam = session.roam

// TODO: 移到 stores
let options = null

async function friendList () {
  const { code, error, friends } = await roam.friendList()
  if (code !== 0) {
    notificationState.add({
      type: 'warning'
      , content: error
      , delay: 5e3
    })

    // 重置状态
    loginState.QQStatus(42)
    loginState.roamStatus(42)
    return
  }
  backupState.friendList(friends)
}

async function backup (friends, _options) {
  options = _options
  backupState.duringBackup(true)
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i]
    const roaminfo = await roam.roaminfo(friend)
    if (roaminfo.ec !== 0) {
      notificationState.add({
        type: 'warning'
        , content: `无法获取 ${friend} 的权限配置`
        // , delay: 5e3
      })
      continue
    }
    if (roaminfo.roamall !== 1 && roaminfo.roamfriend !== 1) {
      notificationState.add({
        type: 'warning'
        , content: `你没有漫游 ${friend} 的消息记录`
        // , delay: 5e3
      })
      continue
    }
    await backupChatHistory(friend)
    backupState.progress((i + 1) / friends.length)
  }
  backupState.duringBackup(false)
  backupState.clearSelect()
  notificationState.add({
    type: 'success'
    , content: '已备份所有消息记录'
    // , delay: 5e3
  })
}

async function backupChatHistory (friend) {
  let message = []
  let media = []
  let date
  let offset

  do {
    var { code, error
          , message: _message
          , media: _media
          , prev } = await roam.chatHistory(friend, date, offset)
    if (code !== 0) {
      const errorMap = {
        16: `${friend} 的消息记录是空的`
      }
      notificationState.add({
        type: 'warning'
        , content: errorMap[code] || error
        // , delay: 8e3
      })
      // 没有消息记录
      if (code === 16) {
        return
      }
      break
    }
    if (prev !== null) {
      date = prev.date
      offset = prev.offset
    }
    message = message.concat(_message)
    media = media.concat(_media)
  } while (prev !== null)

  // console.log({ message, media })
  await save(friend, message, media)
  notificationState.add({
    type: 'success'
    , content: `${friend} 的消息记录已备份完成`
    , delay: 5e3
  })
}

async function save (uid, messageList, mediaList) {
  if (options == null) {
    return
  }
  try {
    fs.mkdirSync(`${options.savePath}/${uid}`)
    fs.mkdirSync(`${options.savePath}/${uid}/media`)
  } catch (e) {

  }
  saveChatHistory(uid, messageList)
  await saveMediaFlie(uid, mediaList)
}

function saveChatHistory (uid, messageList) {
  const db = new sqlite.Database()
  db.run('CREATE TABLE message ("time" DATETIME, "from" INT, "to" INT, "content" TEXT, "media" TEXT)')
  db.run('BEGIN TRANSACTION')
  const stmt = db.prepare('INSERT INTO message VALUES(?, ?, ?, ?, ?)')
  for (let i = 0; i < messageList.length; i++) {
    const message = messageList[i]
    stmt.run([message.time
      , message.from
      , message.to
      , JSON.stringify(message.content)
      , JSON.stringify(message.media)
    ])
  }
  db.run('COMMIT TRANSACTION')
  const dbBuffer = new Buffer(db.export())
  fs.writeFileSync(`${options.savePath}/${uid}/${uid}.db`, dbBuffer)
}

async function saveMediaFlie (uid, mediaList) {
  const uuidIMGMap = {}
  const uuidIMGList = []
  // 需要 array index
  for (let index = 0; index < mediaList.length; index++) {
    const media = mediaList[index]
    if (media.type === 3) {
      uuidIMGMap[media.value] = {
        index
        , uuid: media.uuid
      }
      uuidIMGList.push(media.value)
    }
  }

  let uuidIMGURLList = {}
  const uuidIMGChunkList = helpers.chunk(uuidIMGList, 50)

  for (const IMGList of uuidIMGChunkList) {
    const data = await roam.uuidIMG(IMGList)
    if (data.ec !== 0) {
      continue
    }
    delete data.ec
    uuidIMGURLList = Object.assign(uuidIMGURLList, data)
  }

  for (let key in uuidIMGURLList) {
    const media = uuidIMGMap[key]
    mediaList[media.index] = {
      uuid: media.uuid
      // 临时标记
      , type: 4
      , value: uuidIMGURLList[key]
    }
  }

  for (const media of mediaList) {
    if (media.type === 4) {
      try {
        const url = helpers.unEscapeHTML(media.value)
        await downloadFlie(url, `${options.savePath}/${uid}/media`, media.uuid)
      } catch (e) {

      }
    }
  }
}

function downloadFlie (url, savePath, flieName, flieExt) {
  return new Promise((resolve, reject) => {
    request.get(url, { encoding: null })
      .then(response => {
        if (response.statusCode === 200) {
          // // https://github.com/jshttp/mime-db/
          // const mimeMAP = {
          //   'image/gif': 'gif'
          //   , 'image/jpeg': 'jpg'
          //   , 'image/png': 'png'
          // }
          // // FIXME: 意外的文件类型
          // const _flieExt = flieExt || mimeMAP[response.headers['content-type']] || 'oxox'
          // fs.writeFileSync(`${savePath}/${flieName}.${_flieExt}`, response.body)
          fs.writeFileSync(`${savePath}/${flieName}`, response.body)
          resolve()
        } else reject()
      })
      .catch(reject)
  })
}

export default {
  friendList
  , backup
}
