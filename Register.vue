<!-- src/components/Register.vue -->

<template lang='pug'>
  span
    Modal(type='record' id='register-modal' :options='registerOptions')
</template>
<script>
import Modal from './Modal'
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
      note: '',

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
      }
    }
  },
  components: {
    Modal
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
    register () {
      var credentials = {
        username: this.credentials.username,
        email: this.credentials.email,
        password: this.credentials.password,
        confirmPassword: this.credentials.confirmPassword
      }

      console.log('Registering: ' + JSON.stringify(credentials))
      auth.register(this, credentials, 'secretquote')
    },
    makeAuth (e) {
      // auth logic
      this.note = 'Register failed'
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
