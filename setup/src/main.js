// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
// import Hdr from './components/Hdr'

import router from './router'
// import hRouter from './router/hRouter'

import auth from './auth'

// Check the users auth status when the app starts
auth.checkAuth()

Vue.config.productionTip = false

import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Icon from 'vue-awesome/components/Icon'
import store from './components/myState.js'

Vue.use(BootstrapVue)

Vue.component('icon', Icon)
Vue.use(BootstrapVue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router: router,
  template: '<App/>',
  components: {
    App,
    Icon
  },
  methods: {
    test_log () {
      console.log('test log')
      store.commit('log', { message: 'test log' })
    }
  }
})
