import datauri from '../utils/datauri'
import helpers from '../utils/helpers'
import jsonp from '../utils/jsonp'
import constants from '../constants'

class QQ {

  constructor (session) {
    this.session = session
  }

  loginQR () {
    const url = constants.loginQRURL()
    // return datauri.fromURL(url, this.session)
    return new Promise((resolve, reject) => {
      this.session.get(url, { encoding: null })
      .then(response => {
        if (response.statusCode === 200) {
          // const img = datauri.blobToDataURI(response.body, response.headers['content-type'])
          resolve(datauri.blobToDataURI(response.body, response.headers['content-type']))
        } else reject()
      })
      .catch(reject)
    })
  }

  loginStatus () {
    return new Promise((resolve, reject) => {
      const url = constants.checkLoginURL()
      this.session.get(url, {
        params: {
          action: `${constants.PT.action.join('-')}-${new Date() - constants.WINDOW_VALUE.g_begTime}`
        }
      })
      .then(response => {
        if (response.statusCode === 200) {
          // 返回的是字符，需要转换
          // 65 过期, 66 继续, 67 验证中
          // ptuiCB('66','0','','0','二维码未失效。', '')
          const [code, , , , message] = jsonp.evalJsonp(response.body, 'ptuiCB').map(helpers.toNumber)
          resolve({ code, message })
        } else reject()
      })
      .catch(reject)
    })
  }
}

export default QQ
