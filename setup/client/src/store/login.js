import Vue from 'vue'
import Vuex from 'vuex'

// import axios from 'axios'
// import config from '@/config.js'

Vue.use(Vuex)

const state = {
  token: '',
  status: '',
  expiration: 30, // expiration in minutes
  payloadData: null
}

const getters = {
  loggedIn: state => (state.status === 'success' || state.status === 'logged in'),
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
  payload: state => {
    var payload = state.payloadData || localStorage.getItem('payload')
    if (payload) {
      var expires = localStorage.getItem('payload-expires') || '0'
      expires = parseInt(expires)

      var now = Date.now()
      var expiry = new Date(expires)
      console.log('Now: ' + Date(now))
      console.log('Expires: ' + expiry)
      if (now > expires) {
        console.log('Expired')
        return {access: 'public', expired: true}
      } else {
        console.log('retrieved payload: ' + JSON.stringify(payload))
        if (payload.constructor === String) {
          if (payload === '[object Object]') { payload = "{access: 'public'}" }
          return JSON.parse(payload)
        } else {
          return payload
        }
      }
    } else {
      return {access: 'public'}
    }
  },
  token: state => state.token,
  localToken: state => localStorage.getItem('user-token')
}

const actions = {
  RESET_EXPIRY: ({commit, dispatch}) => {
    commit('RESET_EXPIRY')
  },
  AUTH_PAYLOAD: ({commit, dispatch}, payload) => {
    commit('AUTH_PAYLOAD', payload)
  },
  AUTH_TOKEN: ({commit, dispatch}, token) => {
    commit('AUTH_PAYLOAD', token)
  },
  AUTH_CLEAR: ({commit, dispatch}) => {
    commit('AUTH_CLEAR')
  },
  AUTH_LOGOUT: ({commit, dispatch}) => {
    console.log('auth logout...')
    commit('AUTH_CLEAR')
    commit('AUTH_LOGOUT')
  },
  LOAD_DEMO: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      var payload = {user: 'Demo', id: 3}
      commit('AUTH_PAYLOAD', payload)
      resolve()
    })
  }
}

// basic mutations, showing loading, success, error to reflect the api call status and the token when loaded
const mutations = {
  RESET_EXPIRY: (state) => {
    var now = Date.now()
    var expires = now + state.expiration * 60 * 1000
    var expiry = new Date(expires)
    console.log('reset expiry: ' + expiry)

    localStorage.setItem('payload-expires', expires) // clear your user's token from localstorage
  },
  AUTH_PAYLOAD: (state, payload) => {
    state.payloadData = payload
    console.log('payload:' + JSON.stringify(payload))
    var now = Date.now()
    var expires = now + state.expiration * 60 * 1000
    var expiry = new Date(expires)
    console.log('set expiry: ' + expiry)

    localStorage.setItem('payload', JSON.stringify(payload)) // clear your user's token from localstorage
    localStorage.setItem('payload-expires', expires) // clear your user's token from localstorage
    localStorage.removeItem('user-token')
  },
  AUTH_TOKEN: (state, token) => {
    state.status = 'success'
    state.token = token
    localStorage.setItem('user-token', token) // clear your user's token from localstorage
  },
  AUTH_ERROR: (state) => {
    state.status = 'error'
  },
  AUTH_LOGOUT: (state) => {
    state.status = 'logged out'
    state.token = null
  },
  AUTH_CLEAR: (state) => {
    localStorage.setItem('user-token', '')
    localStorage.setItem('payload', "{access: 'public'}")
    localStorage.removeItem('payload-expires')
    state.payloadData = {access: 'public'}
    console.log('cleared local payload & token states')
    console.log(state.payloadData)
  }
}
// })

export default {
  state,
  getters,
  actions,
  mutations
}
