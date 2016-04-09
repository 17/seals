<template>
  <div class="roam-password shadow">
    <input type="password" class="password-input" autofocus v-model="password" @keyup.enter="handleSubmit">
    <b class="icon icon-enter" @click="handleSubmit"></b>
  </div>
</template>

<script>
  import loginAction from '../../actions/login'
  export default {
    data () {
      return {
        password: null
      }
    }
    , methods: {
      async handleSubmit () {
        await loginAction.roamLogin(this.password)
      }
    }
  }
</script>

<style scoped>
  .password-input {
    /*width: 27rem;*/
    width: 50vw;
    height: 20px;
    padding: 6px 8px;
    border: 1px solid #e4e4e4;
  }
  .icon-enter {
    display: block;
    font-size: 16px;
    width: 16px;
    height: 16px;
    line-height: 1;
    position: absolute;
    top: 9px;
    right: 6px;
    color: #ddd;
    cursor: pointer;
  }
  .icon-enter:after {
    content: '↵'
  }
  .icon-enter:active {
    position: absolute;
    top: 10px;
    right: 5px;
    font-size: 14px;
  }
</style>
