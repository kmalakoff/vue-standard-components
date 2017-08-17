// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import Hdr from './Hdr'

import router from './router'
import hRouter from './router/hRouter'

import auth from './auth'

// Check the users auth status when the app starts
auth.checkAuth()

Vue.config.productionTip = false

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import store from './components/myState.js'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router: router,
  template: '<App/>',
  components: { App },
  methods: {
    test_log () {
      console.log('test log')
      store.commit('log', { message: 'test log' })
    }
  }
})

new Vue({
  el: '#header',
  router: hRouter,
  template: '<Hdr/>',
  components: { Hdr }
})