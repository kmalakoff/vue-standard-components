<!-- src/components/Authorization.vue -->

<template lang='pug'>
  div
    <!-- b V:  -->
    <!-- a (href='#' @click.prevent='profile') Profile -->
    div(v-if='userid')
      DropdownMenu(:options='userMenu' :title='payload.username')
      <!-- span {{payload.username}} -->
      <!-- span &nbsp; | &nbsp; -->
      <!-- a(href='#' @click.prevent='logout') -->
        <!-- b Log Out -->
    div(v-else)
      Modal(type='record' id='login-modal' :options='loginOptions' :note='note')
      span &nbsp; | &nbsp;
      Modal(type='record' id='register-modal' :options='registerOptions' :note='note')
        p &nbsp;
</template>
<script>
import Modal from './Modal'
import DropdownMenu from './DropdownMenu'
import auth from '../../auth'
import config from '@/config.js'

export default {
  data () {
    return {
      // We need to initialize the component with any
      // properties that will be used in it
      demo: true,
      credentials: {
        username: '',
        password: ''
      },
      error: '',
      note: 'asldfj',

      userMenu: [
        { label: 'Profile', loadModal: this.getUser },
        { label: 'Logout', loadModal: this.logout }
      ],
      loginOptions: {
        openText: 'Log in',
        access: 'append',
        fields: [
          {name: 'email', type: 'text'},
          {name: 'password', placeholder: 'password', type: 'password'}
        ],
        onSave: this.login,
        onBlur: this.checkInput,
        onFocus: this.inputFocus,
        submitButton: 'Log Me In'
      },

      registerOptions: {
        openText: 'Sign up',
        access: 'append',
        fields: [
          {name: 'username'},
          {name: 'email', type: 'text'},
          {name: 'password', placeholder: 'password', type: 'password'},
          {name: 'confirmPassword', placeholder: 're-enter password', type: 'password'}
        ],
        onSave: this.register,
        onBlur: this.checkInput,
        onFocus: this.inputFocus,
        submitButton: 'Register'
      },
      apiURL: config.apiURL,
      status: 'initialized'
    }
  },
  components: {
    Modal,
    DropdownMenu
  },
  props: {
    payload: {
      type: Object
    },
    onPick: { type: Function }
  },
  computed: {
    // payload: function () {
    //   var P = localStorage.getItem('payload')
    //   return P
    // },
    userid: function () {
      if (this.payload && this.payload.userid) {
        return this.payload.userid
      } else {
        return null
      }
    }
  },
  methods: {
    profile () {
      console.log('verify current profile')
    },
    register (form) {
      var credentials = {
        username: form.username,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword
      }

      console.log('Registering with credentials: ' + JSON.stringify(credentials))
      var ok = auth.signup(this.URL + '/register', credentials)
      console.log('Registered ?: ' + JSON.stringify(ok))
      // var _this = this
      // console.log('Registering with credentials: ' + JSON.stringify(credentials))
      // axios(this.URL + '/register', {method: 'GET', data: credentials})
      //   .then(function (result, err) {
      //     if (err) {
      //       _this.status = 'registration error'
      //       console.log('set axios error during registration: ' + err)
      //       _this.$store.commit('setError', {context: 'Registration', err: err})
      //     } else {
      //       _this.status = 'registered'
      //       console.log('registered: ' + JSON.stringify(result))
      //     }
      //   })
    },
    login (form) {
      var credentials = {
        email: form.email,
        password: form.password
      }
      console.log('Authorizing for login: ' + JSON.stringify(credentials))

      auth.login(this, credentials)
      var payload = localStorage.getItem('payload')
      // var payload = this.$store.getters.payload

      console.log('Payload: ' + JSON.stringify(payload))
      // console.log('auth.login: ' + JSON.stringify(P))

      this.$store.dispatch('payload', payload)

      // var p1 = this.$store.getters.payload
      // console.log('p1: ' + JSON.stringify(p1))
      // var p2 = localStorage.getItem('payload')
      // console.log('p2: ' + JSON.stringify(p2))

      // console.log('is ' + this.$store.getters.payload)

      // var user = payload.user
      // console.log(user + ' Payload: ' + JSON.stringify(payload))

      // var access = auth.checkAuth()
      // console.log('access: ' + access)

      // var payload2 = auth.payload()
      // console.log(JSON.stringify(payload2))

      // var token = localStorage.getItem('id_token')
      // console.log('token: ' + token)
    },
    logout () {
      this.$store.dispatch('AUTH_LOGOUT')
    },
    getUser () {
      var data = JSON.parse(this.$store.getters.payload)
      var keys = Object.keys(data)

      var D = []
      for (var i = 0; i < keys.length; i++) {
        D.push({attribute: keys[i], value: data[keys[i]]})
      }
      console.log('user data: ' + JSON.stringify(D))
      return D
    },
    makeAuth (e) {
      // auth logic
      this.note = 'Register failed'
    },
    checkInput (e) {
      console.log('validate input')
      // const form = document.querySelector('.form')
      const parent = e.target.parentElement
      console.log('found ')
      parent.classList.add('has-error')
      this.note = 'Failed validation'
    },
    inputFocus (e) {
      this.note = ''
      const parent = e.target.parentElement
      parent.classList.remove('has-error')
      console.log('checkinput')
    },
    inputValidate (e) {
      this.note = ''
      const parent = e.target.parentElement
      parent.classList.add('has-success')
      console.log('validated')
    }
  }
  // watch: {
  //   note () {
  //     console.log('note changed...')
  //     const note = document.querySelector('.note')
  //     if (this.note.length) {
  //       note.classList.add('note--up')
  //     } else {
  //       note.classList.remove('note--up')
  //       note.classList.add('note--down')
  //     }
  //   }
  // }
}
</script>

<style scoped>

.login-box {
  padding: 1rem;
  border: solid black 1px;
  text-align: center;
}
.note {
  // color: red;
  background: #FF9E80;
  padding: 0.75rem 1.5rem;
  box-sizing: border-box;
  position: relative;
  bottom: 100%;
  z-index: 0;
  width: 100%;
  transition: all .5s ease-out;
}
.note-mask {
  // background: #FF9E80;
  background: #FFFFFF;
  padding: 0.75rem 1.5rem;
  box-sizing: border-box;
  position: relative;
  bottom: 100%;
  z-index: 0;
  transition: all .5s ease-out;
}
.note--down {
  transform: translateY(100%);
}

.note--up {
  transform: translateY(0);
}

</style>
