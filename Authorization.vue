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
      Modal(id='profile' type='data')
    div(v-else)
      span(v-if='demo')
        span(v-for='i, user in demo')
          button.btn.btn-warning(v-on:click='loadDemo(user)') Login as {{user}}
          span &nbsp; &nbsp;
      Modal(type='record' id='login-modal' title='Login' :options='loginOptions' :note='note')
      span &nbsp; &nbsp;
      Modal(type='record' id='register-modal' title='Register' :options='registerOptions' :note='note')
        p &nbsp;
</template>
<script>
import Modal from './Modal'
import DropdownMenu from './DropdownMenu'
import auth from '../../auth'
import StandardConfig from './config.js'
import config from '@/config.js'

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
      note: 'asldfj',

      userMenu: [
        { label: 'Profile', loadModal: {data: this.getUser, title: 'User Profile', id: 'profile'} },
        { label: 'Logout', onClick: this.logout }
      ],
      loginOptions: {
        openButton: 'Log in',
        access: 'append',
        fields: StandardConfig.loginFields,
        onSave: this.login,
        onBlur: this.checkInput,
        onFocus: this.inputFocus,
        submitButton: 'Log Me In'
      },

      registerOptions: {
        openButton: 'Sign up',
        access: 'append',
        fields: StandardConfig.registrationFields,
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
    onPick: { type: Function },
    demo: {
      type: Object,
      default: null
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
      console.log('Registering with credentials: ' + JSON.stringify(credentials))
      var response = await auth.signup(this, credentials)
      console.log('Register call:' + JSON.stringify(response))
      if (response.data && response.data.success) {
        this.$store.dispatch('logMessage', response.data.success)
        return response.data.user
      } else if (response.data.errors) {
        return response.data.errors
      }
    },
    async login (form) {
      var credentials = {
        email: form.email,
        password: form.password
      }
      console.log('login ' + form.email)
      var response = await auth.login(this, credentials)
      console.log('Login call:' + JSON.stringify(response))

      if (response.data && response.data.success) {
        var payload = response.data
        if (payload.user && payload.user.id) {
          payload.user.userid = payload.user.id
          delete payload.user.id
          delete payload.user.password
        }
        console.log('generated payload: ' + JSON.stringify(payload))
        this.$store.dispatch('AUTH_REQUEST', payload)
        return { success: 'Logged in successfully', payload: payload }
      } else if (response.data.errors) {
        return { errors: response.data.errors }
      } else {
        return 'no response...'
      }
      // return response.data
      // console.log('Authorize: ' + JSON.stringify(response))
      // var LOGIN_URL = 'http://localhost:3333/login'
      // context.$http.post(LOGIN_URL, creds, (data) => {
      //   localStorage.setItem('id_token', data.id_token)
      //   localStorage.setItem('access_token', data.access_token)

      //   this.user.authenticated = true
      //   // Redirect to a specified route
      //   // if(redirect) {
      //   //   router.go(redirect)
      //   // }
      // }).error((err) => {
      //   context.error = err
      // })
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
