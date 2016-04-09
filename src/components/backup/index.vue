<template>
  <ul class="group-list" v-if="state.friendList">
    <li class="group" v-for="group in state.friendList">
      <span class="group-name">{{{group.name}}}</span>
      <ul class="friend-list">
        <li :class="['friend', friend.select ? 'active': '' ]"
          v-for="friend in group.friend" @click="friend.select = !friend.select">
          <!-- <img src="" alt="" class="avatar"> -->
          <span class="name">{{{friend.name}}}</span>
          <span class="nicename">{{{friend.nicename}}}</span>
        </li>
      </ul>
    </li>
  </ul>
  <!-- <div class="loader-bar">
    <div class="progress"></div>
  </div> -->
  <div v-show="state.duringBackup" class="load-over"></div>
  <div :style="progressStyle" class="progress"></div>
  <button class="一只能按的按钮" @click="backup">
    <span v-if="state.duringBackup"><b class="icon-loader"></b>正在备份</span>
    <span v-else >开始备份</span>
  </button>
</template>

<script>
  import backupAction from '../../actions/backup'
  import backupState from '../../stores/backup'
  import notificationState from '../../stores/notification'
  const remote = global.require('remote')
  const dialog = remote.require('dialog')
  export default {
    computed: {
      state () {
        return backupState.data
      }
      , progressStyle () {
        return {
          width: (this.state.progress * 100) + '%'
        }
      }
    }
    , methods: {
      backup () {
        const backupList = backupState.selectList()
        if (backupList.length === 0) {
          notificationState.add({
            type: 'warning'
            , content: '你还没选择需要备份的好友'
            , delay: 5e3
          })
          return
        }
        dialog.showOpenDialog({
          title: '选择目录'
          , properties: ['openDirectory']
        }, path => {
          if (path == null) {
            return
          }
          const savePath = path[0]
          // console.log(savePath)
          backupAction.backup(backupList, { savePath })
        })
      }
    }
    , created () {
      backupAction.friendList()
    }
  }
</script>

<style scoped>
.group-list {
  position: absolute;
  bottom: calc(100px + 10vh);
  left: 50%;
  width: 60vw;
  height: 60vh;
  transform: translate(-50%, 0);
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #e4e4e4;
}
.group {
  margin: 2rem;
  /*margin-bottom: 2.5rem;*/
}
.group-name {
  display: block;
  border-bottom: 1px solid #f1f1f1;
  padding-bottom: .5em;
  /*margin-bottom: .5em;*/
}
/* eee ddd*/
.friend {
  position: relative;
  padding: .5em 0;
  /*padding-left: 35px;*/
  line-height: 1.5;
  cursor: pointer;
  transition: padding-left .1s;
}
.friend.active {
  padding-left: 1.5em;
}
.friend:after {
  content: '√';
  display: block;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
  /*line-height: calc(1rem * 1.5);*/
  line-height: 35px;
  /*color: #2c662d;*/
  color: #a3c293;
  transition: opacity .1s;
}
.friend.active:after {
  opacity: 1;
}
.avatar {
  display: block;
  position: absolute;
  top: 5px;
  left: 0;
  width: 28px;
  height: 28px;
}
.group-name, .nicename {
  font-size: 12px;
  color: #bbb;
}
.一只能按的按钮 {
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 100px;
  background-color: #f1f1f1;
  border-top: 1px solid #e4e4e4;
  color: #888;
  z-index: -1;
}
.progress {
  position: absolute;
  bottom: 101px;
  left: 0;
  /*width: 33%;*/
  height: 3px;
  background-color: #3f84eb;
  transition: width .1s ease;
}
.load-over {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  cursor: progress;
  /*cursor: not-allowed;*/
}
.icon-loader {
  display: inline-block;
  position: relative;
  width: 1em;
  height: 1em;
  margin-right: .5em;
  vertical-align: middle;
}
.icon-loader:before {
  border-color: rgba(0,0,0,.1);
}
.icon-loader:after {
  border-color: #767676 transparent transparent;
}
</style>
