import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Main from '@/components/Main'

import User from '@/components/User'

import Login from '@/components/Standard/Login'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      // Public Intro Page
      path: '/',
      name: 'Public',
      component: Hello
    },
    {
      // Main Default Page (with user logged in)
      path: '/main',
      name: 'Main',
      component: Main
    },
    {
      // User Page (Profile or Login)
      path: '/user',
      name: 'User',
      component: User
    },
    {
      // Login Page
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

export default router
