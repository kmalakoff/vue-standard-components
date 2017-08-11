import Vue from 'vue'
import Vuex from 'vuex'
import underscore from 'underscore'

Vue.use(Vuex)

// import StdState from './../Standard/StdState'
// const ovid = {

export default new Vuex.Store({
  state: {
    user: {},

    message_contexts: [],
    errors: {},
    errorCount: 0,
    logs: []
  },
  mutations: {
    clearUser (state) {
      console.log('clear ' + state.user.name)
      state.user.id = null
      state.user.name = null
    },

    setError (state, data) {
      var context = data.context || 'default';

      console.log('Error ' + data.context)
      console.log('set Error: ' + data.err)

      if (messageContexts.indexOf(context) === -1) {
        messageContexts.push(context)
        state.errors[context] = []
      }
      if (data.err) {

        if (data.err.constructor === Error && data.err.message) {
          state.errors[context].push(data.err.message)
        } else if (data.err && data.err.constructor === String) {
          state.errors[context].push(data.err)
        }
      }
      state.errorCount++
    },
    clearErrors (state, context) {
      console.log('clear errors...')
      if (context) {
        state.errors[context] = []
      } else {
        state.errors = {}
      }

      state.errorCount = 0
    },

    log (state, data) {
      console.log('log ' + JSON.stringify(data))
      state.logs.push(data)
    }
  }

})

