// src/auth/index.js

// import {router} from '../router/'
// import router from '../router/index.js'
import axios from 'axios'
import config from './../config.js'

// URL and endpoint constants
const API_URL = config.apiURL

export default {

  // User object will let us check authentication status
  user: {
    authenticated: false
  },
  // call api to login and return token
  login (context, creds, redirect) {
    var url = API_URL + '/login'
    url += '?email=' + creds.email + '&password=' + creds.password
    console.log('get auth.index.login ' + API_URL)
    return axios.get(url, creds)
  },
  // call api to register new user
  signup (context, creds, redirect) {
    console.log('post auth.index.signup ' + API_URL)
    var url = API_URL + '/register'
    url += '?email=' + creds.email
    url += '&username=' + creds.username
    url += '&password=' + creds.password
    url += '&confirmPassword=' + creds.confirmPassword

    // return axios.post(url, creds)
    return axios.get(url)
      .catch(function (error) {
        var msg = '' + error
        console.log(msg)
        return {error: msg}
      })
  },

  // To log out, we just need to remove the token
  logout (context, loginId) {
    localStorage.removeItem('id_token')
    localStorage.removeItem('access_token')
    this.user.authenticated = false

    var url = API_URL + '/logout'
    console.log(loginId + ' logout request: ' + url)

    var data = {
      login_id: loginId
    }
    console.log(JSON.stringify(data))
    return axios.post(url, data)
  },

  // just update local authenticated flag
  checkAuth () {
    // var jwt = localStorage.getItem('id_token')
    // if (jwt) {
    //   this.user.authenticated = true
    // } else {
    //   this.user.authenticated = false
    // }
    console.log('check authentication... (under construction)')
  },

  // The object to be passed as a header for authenticated requests
  getAuthHeader () {
    return {
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    }
  }
}
