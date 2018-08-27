<!-- src/components/Login.vue -->

<template lang='pug'>
  div
    div.login-box
      h2 Log In
      div.form
        div.alert.alert-danger(v-if="error")
          p {{ error }}
        div.form-group
          input.form-control.input-lg(
            type="text"
            placeholder="username"
            v-model="credentials.username"
            @blur='checkInput'
            @focus='inputFocus'
          )
        div.form-group
          input.form-control.input-lg(
            type="password"
            placeholder="password"
            v-model="credentials.password"
            @blur='checkInput'
            @focus='inputFocus'
          )
        button.btn.btn-primary.btn-lg.loginButton( @click="submit()") Login
      p &nbsp;
      div.note.note--down
        p {{ note }}
      div.note-mask
        p &nbsp;
    // div.container
    //   div.note.note--down
    //     p {{note}}
    //     div.login
    //       header.login--header
    //         span Log In
    //       section.login--section
    //         form.login-form(Wsubmit.prevent="makeAuth")
    //           fieldset
    //             input(type=text placeholder='username' required @focus='inputFocus')
    //             svg.line(viewbox='0 0 100 1')
    //               path.line--default(d='M0 0 L100 0')
    //             svg.viewbox.line(viewbox='0 0 100 0')
    //               path.line--default(d='M0 0 L100 0')
    //             button.btn(type='submit') Login
</template>
<script>
import auth from '../../auth'
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
      note: ''
    }
  },
  props: {
    onPick: { type: Function }
  },
  methods: {
    checkInput (e) {
      console.log('validate input')
      // const form = document.querySelector('.form')
      const parent = e.target.parentElement
      console.log('found ')
      parent.classList.add('has-error')
      this.note = 'Failed validation'
    },
    submit () {
      var credentials = {
        username: this.credentials.username,
        password: this.credentials.password
      }
      // We need to pass the component's this context
      // to properly make use of http in the auth service

      console.log('Authorizing: ' + JSON.stringify(credentials))
      auth.login(this, credentials, 'secretquote')

      console.log('was ' + this.$store.getters.payload)
      var payload = localStorage.getItem('payload')

      if (this.demo && payload) {
        var payloadObject = JSON.parse(payload)
        payloadObject.user = credentials.username + '*'
        payload = JSON.stringify(payloadObject)
      }

      this.$store.dispatch('payload', payload)

      console.log('is ' + this.$store.getters.payload)

      var user = payload.user
      console.log(user + ' Payload: ' + JSON.stringify(payload))

      var access = auth.checkAuth()
      console.log('access: ' + access)

      var payload2 = auth.payload()
      console.log(JSON.stringify(payload2))

      if (this.onPick) {
        this.onPick()
      }
    },
    makeAuth (e) {
      // auth logic
      this.note = 'Login failed'
    },
    inputFocus (e) {
      this.note = ''
      const parent = e.target.parentElement
      parent.classList.remove('has-error')
    },
    inputValidate (e) {
      this.note = ''
      const parent = e.target.parentElement
      parent.classList.add('has-success')
    }
  },
  watch: {
    note () {
      console.log('note changed...')
      const note = document.querySelector('.note')
      if (this.note.length) {
        note.classList.add('note--up')
      } else {
        note.classList.remove('note--up')
        note.classList.add('note--down')
      }
    }
  }
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