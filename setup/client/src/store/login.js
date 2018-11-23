import Vue from 'vue'
import Vuex from 'vuex'

// import axios from 'axios'
// import config from '@/config.js'

Vue.use(Vuex)

const state = {
  token: '',
  status: '',
  expiration: 10, // expiration in minutes
  payloadData: null
}

const getters = {
  loggedIn: state => (state.status === 'success' || state.status === 'logged in'),
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
  payload: state => {
    var payload = state.payloadData || localStorage.getItem('payload')
    if (payload) {
      var expires = localStorage.getItem('payload-expires') || 0
      var now = Date.now()
      if (now > expires) {
        console.log('expired...')
        return {access: 'public'}
      } else {
        console.log('retrieved payload: ' + JSON.stringify(payload))
        return payload
      }
    } else {
      return {access: 'public'}
    }
  },
  token: state => state.token,
  localToken: state => localStorage.getItem('user-token')
}

const actions = {
  AUTH_PAYLOAD: ({commit, dispatch}, payload) => {
    commit('AUTH_PAYLOAD', payload)
  },
  AUTH_TOKEN: ({commit, dispatch}, response) => {
    commit('AUTH_PAYLOAD', payload)
  },
  AUTH_CLEAR: ({commit, dispatch}, response) => {
    commit('AUTH_CLEAR', payload)
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
  AUTH_PAYLOAD: (state, payload) => {
    state.payloadData = payload
    console.log('payload:' + JSON.stringify(payload))
    var now = new Date()
    var expires = now + state.expiration * 60
    console.log('... expires after ' + state.expiration + ' minutes')

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
    localStorage.setItem('payload', {access: 'public'})
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
