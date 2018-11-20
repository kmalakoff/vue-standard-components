/** Generic cashing functionality for store

Standard getters:
  active_id
  status(key)
  getHash(key)

Standard actions:

  activate(id)
  status('page', 'loaded')
  setHash('patient', {name: 'John', id: 123})

**/

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  warnings: [],
  errors: [],
  messages: []
}

const getters = {
  messages: state => {
    return state.messages
  },
  warnings: state => {
    return state.warnings
  },
  errors: state => {
    return state.errors
  },
  messageCount: state => {
    return state.messages.length
  },
  warningCount: state => {
    return state.warnings.length
  },
  errorCount: state => {
    return state.errors.length
  }
}

const mutations = {
  message (state, input) {
    var index = state.messages.length
    if (input) {
      Vue.set(state.messages, index, input)
    }
  },
  warning (state, input) {
    var index = state.messages.length
    if (input) {
      Vue.set(state.warnings, index, input)
    }
  },
  error (state, input) {
    var index = state.messages.length
    if (input) {
      Vue.set(state.errors, index, input)
    }
  },
  clearMessages (state) {
    Vue.set(state, 'messages', [])
  },
  clearWarnings (state) {
    Vue.set(state, 'warnings', [])
  },
  clearErrors (state) {
    Vue.set(state, 'errors', [])
  },
  clearAll (state) {
    Vue.set(state, 'warnings', [])
    Vue.set(state, 'messages', [])
    Vue.set(state, 'errors', [])
  }
}

const actions = {
  addMessage (state, input) {
    state.commit('message', this.forceString(input))
  },
  addWarning (state, input) {
    state.commit('warning', this.forceString(input))
  },
  addError (state, input) {
    state.commit('error', input)
  },
  logMessage (state, input) {
    state.commit('clearAll')
    state.commit('message', this.forceString(input))
  },
  logWarning (state, input) {
    state.commit('clearAll')
    state.commit('warning', this.forceString(input))
  },
  logError (state, input) {
    state.commit('clearAll')
    state.commit('error', input)
  },
  clearMessages (state) {
    state.commit('clearAll')
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
