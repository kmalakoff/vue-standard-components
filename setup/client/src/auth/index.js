// src/auth/index.js

import router from '../router/index.js'
import config from '@/config.js'

// URL and endpoint constants
const API_URL = config.apiUrl
const LOGIN_URL = API_URL + '/sessions/create/'
const SIGNUP_URL = API_URL + '/users/'
const TEST_MODE = true // bypasses login check ...

export default {
  // User object will let us check authentication status
  user: {
    authenticated: false
  },

  // Send a request to the login URL and save the returned JWT
  login (context, creds, redirect) {
    if (TEST_MODE) {
      // Testing login only - until api set up to return tokens
      localStorage.setItem('id_token', '123')
      localStorage.setItem('access_token', 'ABC')

      var payload = {user: 'demoUser', userid: '12345', access: 'public'}
      localStorage.setItem('payload', JSON.stringify(payload))

      this.user.authenticated = true
      console.log('test mode - Login bypass: ' + JSON.stringify(this.payload()))
    } else {
      context.$http.post(LOGIN_URL, creds)
        .then(data => {
          localStorage.setItem('id_token', data.id_token)
          localStorage.setItem('access_token', data.access_token)

          this.user.authenticated = true

          // Redirect to a specified route
          if (redirect) {
            router.go(redirect)
          }
        }, error => {
          console.log('Error logging in...')
          console.log(error)
        })
    }
  },
  signup (context, creds, redirect) {
    context.$http.post(SIGNUP_URL, creds)
      .then(data => {
        localStorage.setItem('id_token', data.id_token)
        localStorage.setItem('access_token', data.access_token)

        this.user.authenticated = true

        if (redirect) {
          router.go(redirect)
        }
      }, error => {
        console.log('Error signing up ...')
        context.error(error)
      })
  },

  // To log out, we just need to remove the token
  logout () {
    localStorage.removeItem('id_token')
    localStorage.removeItem('access_token')
    this.user.authenticated = false
  },

  checkAuth () {
    var jwt = localStorage.getItem('id_token')

    this.user.authenticated = false
    if (jwt) {
      this.user.authenticated = true
    }
    return this.user.authenticated
  },

  payload () {
    var payload = localStorage.getItem('payload')
    return payload
  },

  // The object to be passed as a header for authenticated requests
  getAuthHeader () {
    return {
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    }
  }
}
