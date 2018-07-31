import Vue from 'vue'
import Vuex from 'vuex'

import login from './login'
import caching from './caching'
// import messaging from './messaging'
import modal from './modal'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({

  state: {
    status: 'initialized'
  },

  modules: {
    login,
    caching,
    // messaging
    modal
  },

  strict: debug
})
