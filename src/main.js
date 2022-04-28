import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

Vue.use(new VueSocketIO({
  // debug: true,
  connection: SocketIO('ws://127.0.0.1:8090')
}))
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
