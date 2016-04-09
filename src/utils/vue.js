import Vue from 'vue'

function state (data) {
  const vm = new Vue({
    data
  })

  return vm._data
  // 需要内置的方法比如删除 _(:3 /_)_
  // return vm
}

export {
  state
}
