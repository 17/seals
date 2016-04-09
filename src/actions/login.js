import helpers from '../utils/helpers'
import session from '../session'
import loginState from '../stores/login'
import notificationState from '../stores/notification'

const qq = session.qq
const roam = session.roam

async function qqLogin () {
  loginState.QQLoginQR(await qq.loginQR())
  do {
    var { code } = await qq.loginStatus()
    loginState.QQstatus(code)
    await helpers.timeout(2000)
  } while (code === 66 || code === 67)
}

async function roamLogin (password) {
  const { code, error } = await roam.lgion(password)
  if (code !== 0) {
    notificationState.add({
      type: 'warning'
      , content: error
      , delay: 5e3
    })
    return
  }
  notificationState.add({
    type: 'success'
    , content: '登陆成功'
    , delay: 3e3
  })
  loginState.roamStatus(code)
}

export default {
  qqLogin
  , roamLogin
}
