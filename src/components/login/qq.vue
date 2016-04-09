<template>
  <div class="qq-qrcode qrcode shadow">
    <img :src="state.QQloginQR" class="qrcode-img">
    <b class="qrcode-icon icon icon-qq"></b>
    <div v-show="state.QQStatus === 42 || state.QQStatus === 67" class="qrcode-prompt over">
      <b class="icon icon-loader center"></b>
    </div>
  </div>
</template>

<script>
  import loginAction from '../../actions/login'
  import loginState from '../../stores/login'
  import notificationState from '../../stores/notification'
  export default {
    computed: {
      state () {
        return loginState.data
      }
    }
    , created () {
      loginAction.qqLogin()
    }
  }
</script>

<style scoped>
  .qrcode {
    position: relative;
    width: 186px;
    height: 186px;
    background-color: #fff;
    border: 1px solid #e4e4e4;
  }
  .qrcode-img {
    width: 165px;
    height: 165px;
    margin: 10px 11px 0
  }
  .icon-qq {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 42px;
    height: 48px;
    transform: translate(-50%, -50%);
    background-image: url('../../../static/img/icon_qq_QR.png');
  }
  .over {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.9);
  }
</style>
