import request from './utils/srequest'
import { CookieAccessInfo } from 'cookiejar'
import QQ from './sources/qq'
import Roam from './sources/roam'

function encryptSkey (str) {
  if (!str) {
    return ''
  }
  let hash = 5381
  for (let i = 0, len = str.length; i < len; ++i) {
    hash += (hash << 5) + str.charAt(i).charCodeAt()
  }
  return hash & 0x7fffffff
}

const session = request.defaults({
  session: true
  , gzip: true
  , headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Safari/535.19'
  }
})

const qq = new QQ(session)
const roam = new Roam(session)

session.skey = function () {
  return this.jar.getCookie('skey', CookieAccessInfo('qq.com', '/')).value || ''
}
session.uin = function () {
  var u = this.jar.getCookie('uin', CookieAccessInfo('qq.com', '/')).value
  return !u ? null : parseInt(u.substring(1, u.length), 10)
}
session.bkn = function () {
  return encryptSkey(this.skey())
}

// session.jar.setCookies()

export default {
  session
  , qq
  , roam
}
