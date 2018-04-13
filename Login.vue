<!-- src/components/Login.vue -->

  <template lang='pug'>
    div.col-sm-4.col-sm-offset-4
      h2 Log In
      div.alert.alert-danger(v-if="error")
        p {{ error }}
      div.form-group
        input(
          type="text"
          class="form-control"
          placeholder="Enter your username"
          v-model="credentials.username"
        )
      div.form-group
        input(
          type="password"
          class="form-control"
          placeholder="Enter your password"
          v-model="credentials.password"
        )
      button.btn.btn-primary.loginButton( @click="submit()") Log In
  </template>
  <script>
  import auth from '../../auth'
  export default {
    data () {
      return {
        // We need to initialize the component with any
        // properties that will be used in it
        credentials: {
          username: '',
          password: ''
        },
        error: ''
      }
    },
    props: {
      onPick: { type: Function }
    },
    methods: {
      submit () {
        var credentials = {
          username: this.credentials.username,
          password: this.credentials.password
        }
        // We need to pass the component's this context
        // to properly make use of http in the auth service

        console.log('Authorizing: ' + JSON.stringify(credentials))
        auth.login(this, credentials, 'secretquote')

        var payload = localStorage.getItem('payload')
        var user = payload.user
        console.log(user + ' Payload: ' + JSON.stringify(payload))

        if (this.onPick) {
          this.onPick()
        }
      }
    }

  }
  </script>
  <style scoped>

  loginButton: {
  }
