<!-- src/components/Messaging.vue -->

  <template lang='pug'>
    div
      div(v-if='errorCount && errors')
        h5 {{errorCount}} Error(s) detected:
        div(v-for='context,key in errors' align='center')
          b {{key}}:
          div.table.msg-errors.alert-danger(align='center')
            tr
              td
                div(v-for='error in errors[key]')
                  b.msg-errors {{error}}
              td
                button(@click.prevent="clear(key)") x
  </template>

  <script>
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        status: ''
      }
    },
    props: {
      verbosity: {
        type: String
      }
    },
    computed: mapState([
      'errors',
      'errorCount'
    ]),
    methods: {
      clear (scope) {
        console.log('clear ' + scope + ' messages')
        this.$store.commit('clearErrors', scope)
      }
    }

  }
  </script>

<style>
  .msg-errors {
    padding: 10px;
    margin: 10px;
    width: 50%;
    align: center;
  }
</style>
