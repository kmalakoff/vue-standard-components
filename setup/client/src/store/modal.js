import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  activeModal: '',
  waitingModal: '',
  modalContent: '',
  modal: {data: {}, title: ''},
  modalHash: {},
  modalUpdates: 0
}

const getters = {
  modalData: state => {
    console.log('retrieve modal Data: ' + JSON.stringify(state.modal.data)) // modalData)
    console.log('type: ' + state.modal.data.constructor)
    return state.modal.data // modalHash['info-modal3']
    // return state.modalData
  },
  modalContent: state => {
    return state.modalContent
  },
  modalUpdates: state => {
    return state.modalUpdates
  },
  modalHash: state => key => {
    console.log(' Get ' + key + ' modal: ')
    console.log(JSON.stringify(state.modalHash[key]))
    if (key) {
      return state.hash[key]
    } else { return state.modal.data }
  }
}

const actions = {
  incUpdates (state) {
    state.commit('incUpdates')
  },
  setModalData (state, data, options) {
    console.log('load info modal with data: ' + JSON.stringify(data))
    console.log('options: ' + JSON.stringify(options))
    state.commit('loadInfoModal', data, options)
  },
  clearModal (state) {
    console.log('clearing')
    state.commit('clearModal')
    state.modalUpdates = state.modalUpdates + 1
  },
  hideActiveBlock (context) {
    return new Promise((resolve, reject) => {
      context.commit('hideActive')
      resolve()
    })
  },
  toggleModal (state, key) {
    state.commit('toggleModal', key)
  }
}

const mutations = {
  incUpdates (state) {
    state.modalUpdates++
  },
  toggleModal (state, id) {
    console.log('state toggle modal: ' + id)
    var el = document.getElementById(id)
    if (el) {
      console.log('found')
      console.log('class0: ' + el.className)
      el.classList.toggle('m-fadeIn')
      el.classList.toggle('m-fadeOut')
      console.log('class0: ' + el.className)

      console.log('active: ' + state.activeModal)
      console.log(JSON.stringify(state.modal.data))

      if (state.activeModal && state.activeModal !== id) {
        console.log('retrieve active modal: ' + state.activeModal)
        var el2 = document.getElementById(state.activeModal)
        if (el2) {
          console.log('toggle alt ' + state.activeModal)
          el2.classList.toggle('m-fadeIn')
          el2.classList.toggle('m-fadeOut')
          state.waitingModal = state.activeModal
        }
        state.activeModal = id
      } else if (state.activeModal === id) {
        console.log('toggle id: ' + state.activeModal)
        if (state.waitingModal) {
          console.log('reopen ' + state.waitingModal)
          var el3 = document.getElementById(state.waitingModal)

          console.log('class1: ' + el3.className)
          state.activeModal = state.waitingModal
          state.waitingModal = ''
          el3.classList.toggle('m-fadeIn')
          el3.classList.toggle('m-fadeOut')

          console.log('class2: ' + el3.className)
        } else {
          console.log('toggle: ' + state.activeModal)
          state.activeModal = ''
        }
      } else {
        console.log('reset modal to ' + id)
        state.activeModal = id
        // Vue.set(state, 'activeModal', id)
      }
    } else { console.log('no element ' + id) }
    state.modalUpdates = state.modalUpdates + 1
    console.log('State modal Data: ' + JSON.stringify(state.modal.data))
  },
  appendModal (state, records) {
    console.log('appendModal ' + JSON.stringify(records))
    for (var i = 0; i < records.length; i++) {
      var l = state.modal.data.length
      Vue.set(state.modal.data, l, records[i])
    }
  },
  loadInfoModal (state, data, options) {
    if (!options) { options = {} }
    var append = options.append
    var key = options.key || 'info-modal'

    console.log('load info modal with Data: ' + JSON.stringify(data))
    if (data.constructor === Array) {
      if (!append) {
        console.log('clear previous Array data...')
        Vue.set(state.modalHash, key, [])
      }
      for (var i = 0; i < data.length; i++) {
        var l = state.modalHash[key].length
        Vue.set(state.modalHash[key], l, data[i])
      }
    } else if (data.constructor === Object) {
      if (!append) {
        console.log('clear previous Object Data...')
        console.log(key + ' cleared from: ' + JSON.stringify(state.modalHash))
        Vue.set(state.modalHash, key, {})
        console.log('cleared...')
      }
      // var m = state.modalHash[key].length || 0
      console.log('set ' + key)
      Vue.set(state.modalHash, key, data)
    }

    Vue.set(state.modal, 'data', data)

    console.log(JSON.stringify(data))
    console.log(key + ': ' + JSON.stringify(state.modalHash[key]))
    state.modalUpdates = state.modalUpdates + 1
  },

  appendModal2 (state, fields) {
    console.log('appendModal ' + JSON.stringify(fields))
    for (var i = 0; i < fields.length; i++) {
      var l = state.modal.data.length
      Vue.set(state.modal.data, l, fields[i])
    }
  },
  loadInfoModal2 (state, data, options) {
    if (!options) { options = {} }
    var append = options.append

    console.log('load info modal with Data: ' + JSON.stringify(data))

    if (!append) {
      console.log('clear previous 2 data...')
      state.modal.data = []
    }

    if (data.constructor === Array) {
      for (var i = 0; i < data.length; i++) {
        var l = state.modal.data.length
        Vue.set(state.modal.options.data, l, data[i])
      }
    } else {
      var m = state.modal.data.length
      Vue.set(state.modal.data, m, data)
    }
    console.log(JSON.stringify(data))
    console.log(JSON.stringify(state.modal.data))
    state.modalUpdates = state.modalUpdates + 1
  },
  clearModal (state) {
    // Vue.remove(state, 'modal')
    // Vue.remove(state, 'modalContent')
    // Vue.remove(state.modalHash, 'modalTitle')
    Vue.set(state.modal, 'data', [])
    console.log('cleared modal ... :')
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
