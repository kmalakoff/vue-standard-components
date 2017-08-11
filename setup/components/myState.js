import Vue from 'vue'
import Vuex from 'vuex'
import underscore from 'underscore'

Vue.use(Vuex)

// import StdState from './../Standard/StdState'
// const ovid = {

export default new Vuex.Store({
  state: {
    count: 1,
    user: {id: null, name: null},
    scheduled: [],

    selected: [1, 2, 3],
    foundRecords: {},
    searchResults: { user: [] },
    picked: { user: [] },
    searchStatus: { user: '' },
    errors: {},
    errorCount: 0,
    formTable: '',
    formFields: [],
    formStatus: 'pending',
    logs: []
  },
  mutations: {
    increment (state) {
      state.count++
      state.count++
    },
    clearUser (state) {
      console.log('clear ' + state.user.name)
      state.user.id = null
      state.user.name = null
    },
    stashResults (state, results) {
      if (results.constructor === Object && results.scope) {
        console.log('Stashing ' + results.scope + ' results with scope: ' + JSON.stringify(results.data))
        state.searchResults[results.scope] = results.data
        state.foundRecords[results.scope] = results.data.length
      } else {
        console.log('general results: ' + JSON.stringify(results))
        state.searchResults.data = results
        state.foundRecords.data = results.length
      }
    },

    selectOne (state, data) {
      if (data.scope && data.id) {
        state.picked[data.scope] = data.id
      }
    },
    unselectOne (state, data) {
      if (data.scope && data.id && state.picked[data.scope] && state.picked[data.scope].length) {
        const found = underscore.pluck(state.picked[data.scope], 'id').indexOf(data.id)
        state.picked[data.scope].splice(found, 1)
        console.log('found ' + found)
        console.log(JSON.stringify(state.picked[data.scope]))
      } else {
        console.log('not selected')
      }
    },
    selectOneMore (state, data) {
      if (data.scope && data.id) {
        if (state.picked[data.scope].length && underscore.pluck(state.picked[data.scope], 'id').indexOf(data.id) > -1) {
          console.log('already picked ' + data.id)
        } else {
          state.picked[data.scope].push({id: data.id, label: data.label})
        }
      }
    },

    clearSearchResults (state, data) {
      console.log('clear search results for ' + data.scope)
      state.searchResults[data.scope] = []
    },
    setSearchStatus (state, data) {
      state.searchStatus[data.scope] = data.status
      console.log('set search status: ' + JSON.stringify(data))
    },
    setError (state, data) {
      console.log('Error ' + data.context)
      console.log('set Error: ' + data.err)

      if (data.err && data.context) {
        if (!state.errors[data.context]) {
          state.errors[data.context] = []
          console.log('initialized...' + data.context)
        }

        if (data.err.constructor === Error && data.err.message) {
          state.errors[data.context].push(data.err.message)
          console.log('added ' + data.err.message)
          console.log(JSON.stringify(state.errors))
        } else if (data.err && data.err.constructor === String) {
          state.errors[data.context].push(data.err)
          console.log('Added ' + data.err.message)
        }
      }
      state.errorCount++
    },
    clearErrors (state, scope) {
      console.log('clear errors...')
      if (scope) {
        state.errors[scope] = []
      } else {
        state.errors = {}
      }

      state.errorCount = 0
    },
    loadFields (state, data) {
      state.formTable = data.table
      state.formFields = data.fields
      state.formStatus = 'loaded'
    },
    clearFields (state, data) {
      state.formTable = ''
      state.formFields = []
      state.formStatus = 'pending'
    },
    log (state, data) {
      console.log('log message')
      state.logs.push(data)
    }
  }

})
// }

// export default new Vuex.Store({
//   modules: {
//     ovid: ovid,
//     std: StdState
//   }
// })

