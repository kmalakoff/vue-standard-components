// src/auth/index.js

// import {router} from '../router/'
import router from '../router/index.js'
import axios from 'axios'

// URL and endpoint constants
const API_URL = 'http://localhost:3333/'
const LOGIN_URL = API_URL + 'login'
const SIGNUP_URL = API_URL + 'register/'

export default {

  // User object will let us check authentication status
  user: {
    authenticated: false
  },

  async login (context, creds, redirect) {
    console.log('auth.index.login ' + LOGIN_URL)
    // var url = 'http://localhost:3333/register?email=ran.guin@gmail.com&password=shiner'
    return axios.post(LOGIN_URL, creds, (data) => {
      localStorage.setItem('id_token', data.id_token)
      localStorage.setItem('access_token', data.access_token)

      this.user.authenticated = true
      console.log('signed up successfully')
      console.log(JSON.stringify(data))
      if (redirect) {
        router.go(redirect)
      }
      return data
    })
  },
  async signup (context, creds, redirect) {
    console.log('auth.index.signup 2 ' + SIGNUP_URL)
    // var url = 'http://localhost:3333/register?email=ran.guin@gmail.com&password=shiner'
    return axios.post(SIGNUP_URL, creds)
  },

  // To log out, we just need to remove the token
  logout () {
    localStorage.removeItem('id_token')
    localStorage.removeItem('access_token')
    this.user.authenticated = false
  },

  checkAuth () {
    var jwt = localStorage.getItem('id_token')
    if (jwt) {
      this.user.authenticated = true
    } else {
      this.user.authenticated = false
    }
  },

  // The object to be passed as a header for authenticated requests
  getAuthHeader () {
    return {
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    }
  }
}
