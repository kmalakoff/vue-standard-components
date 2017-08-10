import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 1,
    errors: [],
    logs: []
  },
  mutations: {
    increment (state) {
      state.count++
      state.count++
    },
    setError (state, err) {
      console.log('set Error: ' + err)
      if (err.constructor === Error && err.message) {
        state.errors.push(err.message)
      } else if (err.constructor === String) {
        state.errors.push(err)
      }
    },
    clearErrors (state, err) {
      console.log('clear errors...')
      state.errors = []
    },
    log (state, data) {
      console.log('log message')
      state.logs.push(data)
    }
  }

})

