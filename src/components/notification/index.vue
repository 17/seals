<template>
  <ul class="notification-list">
    <li :class="['notification', notification.type]" v-for="(uuid, notification) in notificationList">
      <h3 class="title" v-if="notification.title">{{notification.title}}</h3>
      <div class="content">{{notification.content}}</div>
      <div class="icon close" @click="handleClose(uuid)"></div>
    </li>
  </ul>
</template>

<script>
  import notificationState from '../../stores/notification'
  export default {
    computed: {
      notificationList() {
        return notificationState.data.notificationList
      }
    }
    , methods: {
      handleClose (uuid) {
        notificationState.del(uuid)
      }
    }
  }
</script>

<style scoped>
.notification-list {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 300px;
  max-height: 60vh;
  overflow-y: auto;
}
.notification {
  display: block;
  position: relative;
  margin-top: 1rem;
  padding: 1rem 1.5rem;
  line-height: 1.3;
  border-radius: 4px;
}
.title {
  margin-bottom: .5rem;
}
.notification.info {
  background-color: #f8ffff;
  color: #276f86;
  border: 1px solid #a9d5de;
}
.notification.warning {
  background-color: #fffaf3;
  color: #573a08;
  border: 1px solid #c9ba9b;
}
.notification.success {
  background-color: #fcfff5;
  color: #2c662d;
  border: 1px solid #a3c293;
}
.notification.error {
  background-color: #fff6f6;
  color: #9f3a38;
  border: 1px solid #e0b4b4;
}
.notification h3 {
  font-size: 1rem;
}
.close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 1rem;
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  cursor: pointer;
}
.close:after {
  content: '×';
}
</style>
