import Vue from 'vue'
import Vuex from 'vuex'

// import axios from 'axios'
// import config from '@/config.js'

Vue.use(Vuex)

export const AUTH_REQUEST = 'AUTH_REQUEST'
export const AUTH_SUCCESS = 'AUTH_SUCCESS'
export const AUTH_ERROR = 'AUTH_ERROR'
export const AUTH_LOGOUT = 'AUTH_LOGOUT'

export const USER_REQUEST = 'USER_REQUEST'
export const LOAD_DEMO = 'LOAD_DEMO'

const state = {
  token: localStorage.getItem('user-token') || '',
  status: '',
  payloadData: {access: 'public'}
}

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
  payload: state => state.payloadData
}

const actions = {
  payload: ({commit, dispatch}, payload) => {
    commit('payload', payload)
  },
  [AUTH_REQUEST]: ({commit, dispatch}, response) => {
    return new Promise((resolve, reject) => { // The Promise used for router redirect in login
      console.log('dispatched request')
      commit(AUTH_REQUEST)
      if (response.success) {
        if (response.user) {
          console.log('payload detected.  Storing payload: ' + JSON.stringify(response.user))
          commit('payload', response.user)
        } else if (response.token) {
          const token = response.token
          localStorage.setItem('user-token', token) // store the token in localstorage
          commit(AUTH_SUCCESS, token)

          // you have your token, now log in your user :)
          dispatch(USER_REQUEST)
          resolve(response.user)
        }
      } else if (response.errors) {
        console.log('Error detected: ' + response.errors)
        localStorage.removeItem('user-token') // if the request fails, remove any possible user token if possible
        reject(response.errors)
      } else {
        console.log('expecting response user/token or errors.  Got: ' + JSON.stringify(response))
        localStorage.removeItem('user-token') // if the request fails, remove any possible user token if possible
        var err = new Error('no response data returned')
        reject(err)
      }
    })
  },
  [AUTH_LOGOUT]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      console.log('auth logout...')
      commit(AUTH_LOGOUT)
      localStorage.removeItem('user-token') // clear your user's token from localstorage
      commit('payload', {})
      resolve()
    })
  },
  [LOAD_DEMO]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(LOAD_DEMO)
      resolve()
    })
  }
}

// basic mutations, showing loading, success, error to reflect the api call status and the token when loaded
const mutations = {
  payload: (state, payload) => {
    state.payloadData = payload
    console.log('defined payload')
  },
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [AUTH_SUCCESS]: (state, token) => {
    state.status = 'success'
    state.token = token
  },
  [AUTH_ERROR]: (state) => {
    state.status = 'error'
  },
  [AUTH_LOGOUT]: (state) => {
    state.status = 'logged out'
    state.token = null
  },
  [LOAD_DEMO]: (state) => {
    state.status = 'success'
    state.payloadData = {user: 'Demo', id: 123}
    console.log('loaded demo payload...')
    console.log('Demo Status: ' + state.status)
  }
}
// })

export default {
  state,
  getters,
  actions,
  mutations
}
