import {
  state
} from '../utils/vue'
import Vue from 'vue'
import helpers from '../utils/helpers'

const data = state({
  notificationList: {}
})

export default {
  data: data
  , add ({type = 'info', title, content, delay} = {}) {
    // error, warning, success, info
    const uuid = helpers.uuid()
    Vue.set(this.data.notificationList, uuid, {
      type
      , title
      , content
    })
    delay && setTimeout(() => {
      this.del(uuid)
    }, delay)

    return uuid
  }
  , del (uuid) {
    Vue.delete(this.data.notificationList, uuid)
  }
}
