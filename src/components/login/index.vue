<template>
  <div class="login center">
    <component :is="loginComponent"></component>
    <span class="tips-text">{{tipsText}}</span>
  </div>
  <div class="background"></div>
</template>

<script>
  import loginState from '../../stores/login'
  import QQLogin from './qq.vue'
  import roamLogin from './roam.vue'

  export default {
    computed: {
      loginComponent () {
        return loginState.isQQLogin() ? 'roam' : 'qq'
      }
      , tipsText () {
        const QQTipsMap = {
          '42': '获取验证码中'
          , '65': '二维码已失效'
          , '66': '扫描二维码登录'
          , '67': '请在手机上授权登录'
        }
        const roamTpisMap = {
          '42': '请输入漫游服务独立密码'
        }
        return loginState.isQQLogin() ? roamTpisMap[42]
          : QQTipsMap[loginState.data.QQStatus]
      }
    }
    , components: {
      qq: QQLogin
      , roam: roamLogin
    }
  }
</script>

<style scoped>
  .shadow {
    box-shadow: 0 0 1px #e8e8e8;
  }
  .tips-text {
    position: absolute;
    left: 50%;
    bottom: -2rem;
    font-size: 1rem;
    color: #aaa;
    /*color: #888;*/
    white-space:nowrap;
    transform: translate(-50%, 0);
  }
  .background {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 50vh;
    background-color: #f1f1f1;
    border-bottom: 1px solid #e4e4e4;
    z-index: -1;
  }
</style>
