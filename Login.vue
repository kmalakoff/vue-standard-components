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
        demo: true,
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
      }
    }

  }
  </script>
  <style scoped>

  loginButton: {
  }
