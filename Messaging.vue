<!-- src/components/Messaging.vue -->

  <template lang='pug'>
    div(v-if='errors && errors.length' align='center')
      div.table.msg-errors.alert-danger(align='center')
        tr
          td
            div(v-for='error in errors')
              b.msg-errors {{error}}
          td
            button(@click.prevent="clear") x
    div(v-else)
      b no errors...
      b {{errors}}
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
      'errors'
    ]),
    methods: {
      clear () {
        console.log('clear messages')
        this.$store.commit('clearErrors')
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
