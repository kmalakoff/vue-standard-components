// src/auth/index.js

// import {router} from '../router/'
// import router from '../router/index.js'
import axios from 'axios'
import config from './../config.js'

// URL and endpoint constants
const API_URL = config.apiURL
const LOGIN_URL = API_URL + '/login'
const SIGNUP_URL = API_URL + '/register'

export default {

  // User object will let us check authentication status
  user: {
    authenticated: false
  },

  // call api to login and return token
  login (context, creds, redirect) {
    console.log('get auth.index.login ' + LOGIN_URL)
    console.log(JSON.stringify(creds))
    var url = LOGIN_URL + '?email=' + creds.email + '&password=' + creds.password
    return axios.get(url, creds)
  },

  // call api to register new user
  signup (context, creds, redirect) {
    console.log('post auth.index.signup ' + SIGNUP_URL)
    console.log(JSON.stringify(creds))
    // var url = 'http://localhost:3333/register?email=ran.guin@gmail.com&password=shiner'
    return axios.post(SIGNUP_URL, creds)
    // , (data) => {
    //   console.log('posted / returned: ' + JSON.stringify(data))
    // })
  },

  // To log out, we just need to remove the token
  logout () {
    localStorage.removeItem('id_token')
    localStorage.removeItem('access_token')
    this.user.authenticated = false
  },

  // just update local authenticated flag
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
