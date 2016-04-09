import Vue from 'vue'
import app from './components/app.vue'

let vm = new Vue({
  components: {
    app
  }
  , template: '<app></app>'
})

vm.$mount().$appendTo('body')
