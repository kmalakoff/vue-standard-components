<!-- src/components/Authorization.vue -->

<template lang='pug'>
  div
    <!-- b V:  -->
    <!-- a (href='#' @click.prevent='profile') Profile -->
    div.user-icon(v-if='userid')
      DropdownMenu.user-dropdown(:options='userMenu' :title='payload.username')
      <!-- span {{payload.username}} -->
      <!-- span &nbsp; | &nbsp; -->
      <!-- a(href='#' @click.prevent='logout') -->
        <!-- b Log Out -->
      Modal.user-modal(id='profile' type='data')
    div(v-else)
      span(v-if='demo')
        span(v-for='i, user in demo')
          button.btn.btn-warning(v-on:click='loadDemo(user)') Demo as {{user}}
          span &nbsp; &nbsp;
      span.wideScreen
        Modal.login-modal(type='record' id='login-modal' title='Login' :options='loginOptions' :note='note')
        span &nbsp; &nbsp;
        Modal.signup-modal(type='record' id='register-modal' title='Register' :options='registerOptions' :note='note')
          p &nbsp;
      span.smallScreen
        div(v-if='!activeForm')
          button.login-button.btn.btn-primary.btn-lg(v-on:click="activeForm = 'Login'") Login
          br
          button.signup-button.btn.btn-primary.btn-lg(v-on:click="activeForm = 'Register'") Register
        div(v-else)
          DBForm.login-form(:options='loginOptions' :onSave='login' v-if="activeForm === 'Login'")
          hr
          DBForm.signup-form(:options='registerOptions' :onSave='register' v-if="activeForm === 'Register'")
</template>
<script>
import Modal from './Modal'
import DBForm from './DBForm'
import DropdownMenu from './DropdownMenu'
import auth from '../../auth'
import Standard from './config.js'
import Custom from '@/config.js'

export default {
  data () {
    return {
      // We need to initialize the component with any
      // properties that will be used in it
      activeForm: '',
      credentials: {
        username: '',
        password: ''
      },
      error: '',
      note: 'asldfj',

      userMenu: [
        { label: 'Profile', loadModal: {data: this.getUser, title: 'User Profile', id: 'profile'} },
        { label: 'Logout', onClick: this.logout }
      ],
      loginOptions: {
        openButton: 'Log in',
        access: 'append',
        fields: Standard.loginFields,
        onSave: this.login,
        onBlur: this.checkInput,
        onFocus: this.inputFocus,
        submitButton: 'Log Me In',
        wideOnMobile: true,
        onCancel: this.cancel,
        buttonClass: Custom.defaultButtonClass,
        submitButtonClass: 'btn-success'
      },

      registerOptions: {
        openButton: 'Sign up',
        access: 'append',
        fields: Standard.registrationFields,
        onSave: this.register,
        onBlur: this.checkInput,
        onFocus: this.inputFocus,
        submitButton: 'Register',
        wideOnMobile: true,
        onCancel: this.cancel,
        buttonClass: Custom.defaultButtonClass,
        submitButtonClass: 'btn-success'
      },
      apiUrl: Custom.apiUrl,
      status: 'initialized'
    }
  },
  components: {
    Modal,
    DBForm,
    DropdownMenu
  },
  props: {
    payload: {
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
    }
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
    async register (form) {
      var fields = this.registerOptions.fields
      console.log('fields: ' + fields.join(', '))
      var credentials = {}
      for (var i = 0; i < fields.length; i++) {
        var f = fields[i]
        credentials[f.name] = form[f.prompt] || form[f.name]
      }

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
      var response = await auth.login(this, credentials)
      console.log('Login response:' + JSON.stringify(response))

      return this.initializeSession(response)
    },
    initializeSession (response, onSuccess) {
      this.$store.dispatch('AUTH_LOGOUT')
      if (response.data && response.data.success) {
        if (onSuccess) {
          this.$store.dispatch('logMessage', onSuccess)
        }

        if (response.data.token) {
          console.log('token: ' + response.data.token)
          this.$store.dispatch('AUTH_TOKEN', response.data.token)
        }
        if (response.data.payload) {
          console.log('payload: ' + JSON.stringify(response.data.payload))
          this.$store.dispatch('AUTH_PAYLOAD', response.data.payload)
        }
        return { success: true }
      } else if (response.data && response.data.error) {
        this.$store.dispatch('logError', response.data.error)
        return { error: response.data.error }
      } else {
        this.$store.dispatch('logWarning', 'unrecognized response')
        return 'no recognized response...'
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
    logout () {
      this.$store.dispatch('AUTH_LOGOUT')
    },
    getUser () {
      console.log('get user...')

      var payload = this.payload || this.$store.getters.payload
      var show = Object.keys(this.payload)
      var D = []
      if (payload.constructor === Object) {
        for (var i = 0; i < show.length; i++) {
          if (payload[show[i]]) {
            console.log('show ' + show[i])
            D.push({attribute: show[i], value: payload[show[i]]})
          } else {
            console.log('no ' + show[i])
          }
        }
        console.log('user data: ' + JSON.stringify(D))
        return D
      } else {
        console.log('expected payload object... found ' + payload.constructor)
        return D
      }
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
      this.note = 'Failed Validation'
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
    },
    cancel () {
      this.activeForm = ''
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

.user-icon {
  position: absolute;
  top: 2rem;
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
    padding-top: 30%;
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

</style>
