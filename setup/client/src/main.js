// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
// import Hdr from './components/Hdr'

import router from './router'
// import hRouter from './router/hRouter'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Custom css
import './assets/Standard/css/text_sizing.css'
import './assets/Standard/css/colour_theme.scss'
import './assets/Standard/css/Tab_settings.scss'
import './assets/Standard/css/transition.css'

import Icon from 'vue-awesome/components/Icon'
import store from './store'

// import auth from './auth'
import axios from 'axios'
import AsyncComputed from 'vue-async-computed'

import cookies from 'browser-cookies'
// Check the users auth status when the app starts
// auth.checkAuth()

Vue.config.productionTip = false

Vue.use(BootstrapVue)

Vue.component('icon', Icon)
Vue.use(BootstrapVue)
Vue.use(AsyncComputed)

const authStorage = 'local'
if (authStorage === 'local') {
  const token = localStorage.getItem('user-token')
  if (token) {
    var pass = 'Bearer ' + token
    axios.defaults.headers.common['Authorization'] = pass
    console.log('using auth token: ' + pass)
  }
} else if (authStorage === 'cookie') {
  const csrf = cookies.get('XSRF-TOKEN')
  axios.defaults.headers.common['x-xsrf-token'] = csrf
  console.log('cookie token: ' + csrf)
}
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'

// const env = require('./../.env')
require('dotenv').config({path: './../.env'})
console.log('my root: ' + JSON.stringify(process.env))

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
