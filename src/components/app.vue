<template>
  <component :is="page"></component>
  <notification></notification>
</template>

<script>
  import login from './login/index.vue'
  import backup from './backup/index.vue'
  import notification from './notification/index.vue'
  import loginState from '../stores/login'

  export default {
    computed: {
      page() {
        return loginState.isRoamLogin() && loginState.isQQLogin()
          ? 'backup'
          : 'login'
      }
    }
    , components: {
      login
      , backup
      , notification
    }
  }
</script>
