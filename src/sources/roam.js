import {
  RSAKey
} from '../vendors/rsa'

import helpers from '../utils/helpers'
import QQHelpers from '../utils/qq'
import jsonp from '../utils/jsonp'
import constants from '../constants'

function encryptPwd (str) {
  const rsa = new RSAKey()
  rsa.setPublic(constants.ROAM_LOGIN_PUBLICKEY, '10001')
  // 转换成字符
  return rsa.encrypt(str + '')
}

function checkValidation (str) {
  return str.length >= 6 && str.length <= 16 && !~str.indexOf(' ')
}

class Roam {

  constructor (session) {
    this.session = session
    this.sig = null
  }

  lgion (password) {
    return new Promise((resolve, reject) => {
      if (checkValidation(password) === false) {
        resolve({
          cdoe: 4
          , error: '密码格式错误'
        })
        return
      }
      const url = constants.roamLoginURL()
      const params = {
        type: 2
        , pwd: encryptPwd(password)
        // , mode: mode
        , bkn: this.session.bkn()
      }
      this.session.post(url, {
        data: params
      })
      .then(response => {
        if (response.statusCode === 200) {
          const data = JSON.parse(response.body)
          const code = data.ec
          if (code !== 0) {
            const errorsMap = {
              0: '登陆成功'
              , 1: '登陆已过期'
              , 4: '参数错误'
              , 19: '独立密码被冻结'
              , 23: '输入太频繁，请稍后再试'
              , 24: '输入的密码错误'
            }
            const error = errorsMap[code] || data.em || '登陆失败'
            resolve({ code, error })
            return
          }
          this.sig = data.sig
          resolve({ code })
        } else reject()
      })
      .catch(reject)
    })
  }

  friendList () {
    return new Promise((resolve, reject) => {
      const url = constants.friendListURL()
      this.session.post(url, {
        data: {
          bkn: this.session.bkn()
        }
      })
      .then(response => {
        if (response.statusCode === 200) {
          const data = JSON.parse(response.body)
          const code = data.ec

          if (code !== 0) {
            const errorsMap = {
              0: '获取成功'
              , 1: '登陆已过期'
              , 4: '参数错误'
            }
            const error = errorsMap[code] || data.em || '好友表列获取失败'
            resolve({ code, error })
            return
          }

          const result = {
            code
            , friends: null
          }

          const { grp, remarks } = data
          result.friends = QQHelpers.normalizeFriendList(grp, remarks)
          resolve(result)
        } else reject()
      })
      .catch(reject)
    })
  }

  roaminfo (friend) {
    return new Promise((resolve, reject) => {
      const url = constants.roaminfoURL()
      this.session.get(url, {
        params: {
          fu: friend
          , bkn: this.session.bkn()
        }
      })
      .then(response => {
        if (response.statusCode === 200) {
          resolve(JSON.parse(response.body))
        } else reject()
      })
      .catch(reject)
    })
  }

  uuidIMG (uuid) {
    return new Promise((resolve, reject) => {
      const data = helpers.isArray(uuid) ? uuid.join('|') : uuid
      const url = constants.uuidIMGURL()
      this.session.post(url, {
        data: {
          uuid: data
        }
      })
      .then(response => {
        if (response.statusCode === 200) {
          resolve(JSON.parse(response.body))
        } else reject()
      })
      .catch(reject)
    })
  }

  chatHistory (friend, date, offset, direct = 1) {
    return new Promise((resolve, reject) => {
      const params = {
        fuin: friend
        , direct: direct
        , count: 50
        , sig: this.sig
        , callback: 'onGetMsg'
        , bkn: this.session.bkn()
      }
      const options = date == null && offset == null ? {
        lastmsgtime: 0
        , lastrandom: 0
      }
      : {
        date: date
        , offset: offset
      }
      const url = constants.chatHistoryURL()
      Object.assign(params, options)
      this.session.get(url, {
        params
      })
      .then(response => {
        if (response.statusCode === 200) {
          const data = jsonp.evalJsonp(response.body, params.callback)[0]
          const code = data.ec

          if (code !== 0) {
            const errorsMap = {
              0: '获取成功'
              , 1: '登陆已过期'
              , 4: '参数错误'
              , 16: '消息记录是空的'
              , 17: '需要验证二级密码'
            }
            const error = errorsMap[code] || data.em || '消息记录获取失败'
            resolve({ code, error })
            return
          }

          const have = data => {
            return data.t === 1 && data.offset !== 65535 || data.t === 2 && data.lastmsgtime !== 4294967295
          }
          let result = {
            code
            , message: null
            , media: null
            , next: have(data.nx) ? data.nx : null
            , prev: have(data.pre) ? data.pre : null
          }

          const chatHistory = data.msg
          const me = this.session.uin()
          const { message, media } = QQHelpers.normalizeMessage(chatHistory, me, friend)
          result.message = message
          result.media = media
          resolve(result)
        } else reject()
      })
      .catch(reject)
    })
  }
}

export default Roam
