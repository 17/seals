import helpers from './helpers'

function normalizeMessage (chatHistory, me, friend) {
  // let messageList
  // let mediaList
  let result = {
    message: []
    , media: []
  }
  for (let i = 0; i < chatHistory.length; i++) {
    const _message = chatHistory[i]
    const _content = _message.c
    const message = {
      time: _message.time
      , from: _message.fromuin
      , to: _message.fromuin === friend ? me : friend
      , content: []
      , media: {}
    }
    const content = []
    for (let j = 0; j < _content.length; j++) {
      const _slice = _content[j]
      // 0 文字
      // 1 表情
      // 2 URL 图片
      // 3 UUID 图片
      // content.push({
      //   type: _slice.t
      //   , content: _slice.uuid || _slice.v
      // })
      switch (_slice.t) {
        case 0:
        case 1:
          content.push({
            type: _slice.t
            , value: _slice.v
          })
          break
        case 2:
        case 3:
          const uuid = helpers.uuid()
          result.media.push({
            uuid
            , type: _slice.t
            , value: _slice.uuid || _slice.v
          })
          message.media[uuid] = {
            type: _slice.t
            , value: _slice.uuid || _slice.v
          }
          content.push({
            type: _slice.t
            , value: uuid
          })
          break
        default:
          break
      }
    }
    message.content = content
    result.message.push(message)
  }
  return result
}

function normalizeFriendList (grp, remarks) {
  // const { grp, remarks } = data
  const groupList = []
  const nicenameList = {}

  for (let i = 0; i < remarks.length; i++) {
    nicenameList[remarks[i].u] = remarks[i].n
  }

  for (let i = 0; i < grp.length; i++) {
    const group = grp[i]
    const friendList = {
      index: group.gid // group.gsd
      , name: group.gn
      , friend: []
    }
    for (let j = 0; j < group.frd.length; j++) {
      let friend = group.frd[j]
      friendList.friend.push({
        number: friend.u
        , name: friend.n
        , nicename: nicenameList[friend.u] || ''
      })
    }
    groupList.push(friendList)
  }
  return groupList
}

export default {
  normalizeMessage
  , normalizeFriendList
}
