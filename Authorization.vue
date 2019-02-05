<!-- src/components/Authorization.vue -->

<template lang='pug'>
  div
    <!-- b V:  -->
    <!-- a (href='#' @click.prevent='profile') Profile -->
    div.user-icon(v-if='userid')
      DropdownMenu.user-dropdown(:options='myUserMenu' :title='myPayload.username')
      <!-- span {{payload.username}} -->
      <!-- span &nbsp; | &nbsp; -->
      <!-- a(href='#' @click.prevent='logout') -->
        <!-- b Log Out -->
      Modal.user-modal(id='profile' type='data')
    div(v-else-if="nav.page==='Login' || nav.page==='Register'")
      span.smallScreen
        // Not using modal...
        div(v-if="nav.page==='Login'")
          DBForm.login-form(:options='loginOptions' :onSave='login' :remoteErrors='formErrors')
        div(v-else-if="nav.page==='Register'")
          DBForm.signup-form(:options='registerOptions' :onSave='register')
        p &nbsp;
        p.error(v-if='authError') {{authError}}
    div(v-else)
      span(v-if='demo')
        span(v-for='i, user in demo')
          button.btn.btn-warning(v-on:click='loadDemo(user)') Demo as {{user}}
          span &nbsp; &nbsp;
      span.wideScreen
        Modal.login-modal(type='record' id='login-modal' :error='authError' :title='loginTitle' :options='loginOptions' :note='note' :remoteErrors='formErrors')
        span &nbsp; &nbsp;
        Modal.signup-modal(type='record' id='register-modal' :error='authError' :title='regTitle' :options='registerOptions' :note='note' :remoteErrors='formErrors')
          p &nbsp;
      span.smallScreen
        div
          button.login-button.btn.btn-primary.btn-lg(v-on:click="nav.next('Login')") Login
          br
          button.signup-button.btn.btn-primary.btn-lg(v-on:click="nav.next('Register')") Register
          br
          p.error(v-if='authError') {{authError}}
    span.vwideScreen.nav-path(v-if="userid && nav.path.length > 1")
      div(style='display:inline-block' v-for='page, i in nav.path')
        br
        a(v-on:click='nav.direct(i)') {{page}}
        span(v-if='i < nav.path.length - 1') &nbsp; > &nbsp;
</template>
<script>
import Modal from './Modal'
import DBForm from './DBForm'
import DropdownMenu from './DropdownMenu'
import auth from '../../auth'
import axios from 'axios'
// import { validateResponse } from '../../services/form-validator.js'
// import Standard from './config.js'
import Config from '@/config.js'
import FormValidator from './mixins/FormValidator'

export default {
  data () {
    return {
      // We need to initialize the component with any
      // properties that will be used in it
      credentials: {
        username: '',
        password: ''
      },
      error: '',
      authError: '',
      note: 'asldfj',
      formErrors: {},
      // userMenu: [],
      initMenu: [
        // may supply custom versions in place of this ...
        { label: 'Profile', loadModal: {data: this.getUser, title: 'User Profile', id: 'profile'} },
        { label: 'Logout', onClick: this.logout }
      ],
      loginOptions: {
        modalID: 'login-modal',
        openButton: 'Log in',
        access: 'append',
        fields: Config.loginFields,
        onSave: this.login,
        onBlur: this.checkInput,
        onFocus: this.inputFocus,
        submitButton: 'Log In',
        wideOnMobile: true,
        onCancel: this.cancel,
        buttonClass: Config.defaultButtonClass,
        submitButtonClass: 'btn-primary btn-lg',
        noClose: true,
        buttonType: 'submit',
        header: 'Login - Demo mode',
        title: 'Note:  We will notify all registered users when we go live.'
      },

      registerOptions: {
        openButton: 'Sign up',
        access: 'append',
        fields: Config.registrationFields,
        onSave: this.register,
        onBlur: this.checkInput,
        onFocus: this.inputFocus,
        submitButton: 'Register',
        wideOnMobile: true,
        onCancel: this.cancel,
        buttonClass: Config.defaultButtonClass,
        submitButtonClass: 'btn-primary btn-lg',
        noClose: true,
        buttonType: 'submit',
        header: 'Registration - Demo mode',
        title: 'Note:  We will notify all registered users when we go live.'
      },
      apiUrl: Config.apiURL,
      status: 'initialized'
    }
  },
  mixins: [
    FormValidator
  ],
  components: {
    Modal,
    DBForm,
    DropdownMenu
  },
  props: {
    payload: {
      type: Object
    },
    nav: {
      type: Object
    },
    onPick: { type: Function },
    demo: {
      type: Object,
      default: null
    },
    noConfirm: {
      type: Boolean,
      default: false
    },
    add2Menu: {
      type: Array,
      default () { return [] }
    },
    testInput: {
      type: Boolean,
      default: false
    }
  },
  created: function () {
    // this.$set(this, 'userMenu', this.myUserMenu)
  },
  computed: {
    myPayload: function () {
      if (this.payload) {
        console.log('get payload from prop')
        return this.payload
      } else {
        console.log('get payload from store')
        return this.$store.getters.payload || {access: 'public'}
      }
    },
    myUserMenu: function () {
      if (this.add2Menu) {
        console.log('add2menu...')
        var menu = []
        menu.push(this.initMenu[0])
        for (var i = 0; i < this.add2Menu.length; i++) {
          menu.push(this.add2Menu[i])
        }
        menu.push(this.initMenu[1])
        return menu
      } else {
        return this.initMenu
      }
    },
    userid: function () {
      if (this.myPayload && this.myPayload.userid) {
        return this.myPayload.userid
      } else {
        return null
      }
    },
    loginTitle: function () {
      return 'Login'
    },
    regTitle: function () {
      return 'Register'
    }
  },
  methods: {
    profile () {
      console.log('verify current profile')
    },
    async register (form) {
      var fields = this.registerOptions.fields
      var credentials = {}
      for (var i = 0; i < fields.length; i++) {
        var f = fields[i]
        credentials[f.name] = form[f.prompt] || form[f.name]
      }
      delete axios.defaults.headers.common['Authorization']

      if (!credentials.username) { credentials.username = credentials.email }
      if (this.noConfirm) {
        credentials.confirmPassword = credentials.password
      }
      console.log('Registering with credentials: ')
      var response = await auth.signup(this, credentials)
      console.log('Register call:' + JSON.stringify(response))
      return this.initializeSession(response, 'Created Account')
    },
    async login (form) {
      var credentials = {
        email: form.email,
        password: form.password
      }
      console.log('login ' + form.email)
      try {
        delete axios.defaults.headers.common['Authorization']
        var response = await auth.login(this, credentials)
        if (response && response.expired) {
          this.$store.dispatch('logWarning', 'Session Expired.  Please log in again.')
        }
        console.log('Login response:' + JSON.stringify(response))
      } catch (err) {
        console.log('caught login error: ' + err)
        this.$store.dispatch('logError', 'Error encountered during log in ... Please try again')
      }
      return this.initializeSession(response)
    },
    initializeSession (response, onSuccess) {
      // console.log('initialize session for ' + response)
      if (response && response.data && response.data.validation_errors) {
        console.log('get service response')
        var val = this.validateResponse(response)
        if (val.formErrors) { this.$set(this, 'formErrors', val.formErrors) }
        return response.data
      } else if (response && response.error) {
        this.$store.dispatch('logError', response.error)
        return response
      } else if (response && response.data) {
        if (response.data.success) {
          if (response.data.token) {
            console.log('token cached: ' + response.data.token)
            this.$store.dispatch('AUTH_TOKEN', response.data.token)

            var pass = 'Bearer ' + response.data.token
            axios.defaults.headers.common['Authorization'] = pass
            // auth.updateToken()
            console.log('updated token...')
          }
          this.nav.goto('Home')
          if (onSuccess) {
            this.$store.dispatch('logMessage', onSuccess)
          }
          if (response.data.payload) {
            console.log('payload: ' + JSON.stringify(response.data.payload))
            this.$store.dispatch('CACHE_PAYLOAD', response.data.payload)
            // this.$set(this, 'myPayload', response.data.payload) this should be redundant (?)
          }
          return { success: true }
        } else if (response.data.error) {
          console.log('log error: ' + response.data.error)
          this.$set(this, 'authError', response.data.error)
          // this.$store.dispatch('logError', response.data.error)
          return { error: response.data.error }
        } else {
          this.$store.dispatch('logWarning', 'unrecognized data response')
          return 'no recognized response...'
        }
      } else {
        this.$store.dispatch('logWarning', 'unrecognized response')
        return {warning: 'unrecognized response'}
      }
    },
    loadDemo (template) {
      if (this.demo && this.demo[template]) {
        var cred = this.demo[template]
        this.login(cred)
      } else {
        console.log(template + ' demo template not defined')
        console.log(JSON.stringify(this.demo))
      }
    },
    async logout () {
      this.nav.goto('Home')
      this.$store.dispatch('AUTH_LOGOUT')
      var loginId = this.myPayload.login_id
      console.log(loginId + ' logout via auth')

      this.$store.dispatch('CACHE_PAYLOAD', { access: 'public' })
      var response = await auth.logout(this, loginId)
      console.log('Logout response:' + JSON.stringify(response))
    },
    getUser () {
      this.nav.goto('Home', 'Profile')
      // console.log('get user...')

      // var payload = this.myPayload || this.$store.getters.payload
      // var show = Object.keys(this.myPayload)
      // var D = []
      // if (payload.constructor === Object) {
      //   for (var i = 0; i < show.length; i++) {
      //     if (payload[show[i]]) {
      //       console.log('show ' + show[i])
      //       D.push({attribute: show[i], value: payload[show[i]]})
      //     } else {
      //       console.log('no ' + show[i])
      //     }
      //   }
      //   console.log('user data: ' + JSON.stringify(D))
      //   return D
      // } else {
      //   console.log('expected payload object... found ' + payload.constructor)
      //   return D
      // }
    },
    makeAuth (e) {
      // auth logic
      this.note = 'Register failed'
    },
    checkInput (e) {
      console.log('validate input')
      // const form = document.querySelector('.form')
      // const parent = e.target.parentElement
      // console.log('found ')
      // parent.classList.add('has-error')
      // this.note = 'Failed Validation'
    },
    inputFocus (e) {
      this.note = ''
      this.authError = ''
      const parent = e.target.parentElement
      parent.classList.remove('has-error')
      console.log('checkinput')
    },
    inputValidate (e) {
      this.note = ''
      const parent = e.target.parentElement
      parent.classList.add('has-success')
      console.log('validated')
    },
    cancel () {
      this.$set(this, 'formErrors', {})
      console.log('cancel this form')
      this.nav.goto('Home')
      this.authError = ''
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
.error {
  padding: 10%;
  text-align: center;
  color: red;
  font-weight: bold;
}

.user-icon {
  position: absolute;
  top: 3rem;
  right: 2rem;
}

.login-modal, .signup-modal {
  display: inline-block;
  padding-top: 0;
}

.login-button, .signup-button {
  margin-top: 10%;
  width: 100%;
}

.smallScreen {
  display: none;
}
.wideScreen {
  display: block
}

@media screen and (max-width: 767px) {
  .login-modal, .signup-modal {
    width: 100%;
    padding-top: 30%;
  }
  .login-form, .signup-form {
    width: 100%;
    padding-top: 10%;
  }
  .smallScreen {
    display: block
  }
  .wideScreen {
    display: none
  }
}

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
.nav-path {
  position: relative;
  top: 30px;
}
</style>
