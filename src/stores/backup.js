import {
  state
} from '../utils/vue'

const data = state({
  duringBackup: false
  , progress: 0
  , friendList: null
})

export default {
  data
  , progress (data) {
    this.data.progress = data
  }
  , friendList (list) {
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list[i].friend.length; j++) {
        list[i].friend[j].select = false
      }
    }
    this.data.friendList = list
  }
  , clearSelect () {
    const friendsList = this.data.friendList
    for (let i = 0; i < friendsList.length; i++) {
      const group = friendsList[i]
      for (let j = 0; j < group.friend.length; j++) {
        const friend = group.friend[j]
        if (friend.select === true) {
          friend.select = false
        }
      }
    }
  }
  , selectList () {
    const friendsList = this.data.friendList
    const backupList = []
    for (let i = 0; i < friendsList.length; i++) {
      const group = friendsList[i]
      for (let j = 0; j < group.friend.length; j++) {
        const friend = group.friend[j]
        if (friend.select === true) {
          backupList.push(friend.number)
        }
      }
    }
    return backupList
  }
  , duringBackup (data) {
    this.data.duringBackup = data
    if (data === false) {
      this.data.progress = 0
    }
  }
}
