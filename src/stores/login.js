import {
  state
} from '../utils/vue'

const data = state({
  QQloginQR: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=='
  , roamStatus: 42
  , QQStatus: 42
})

export default {
  data
  , QQLoginQR (img) {
    this.data.QQloginQR = img
  }
  , QQstatus (code) {
    this.data.QQStatus = code
  }
  , roamStatus (code) {
    this.data.roamStatus = code
  }
  , isRoamLogin () {
    return this.data.roamStatus === 0
  }
  , isQQLogin () {
    return this.data.QQStatus === 0
  }
}
