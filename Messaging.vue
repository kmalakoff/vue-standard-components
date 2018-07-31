<!-- src/components/Messaging.vue -->

<!--
  Usage:

    1. include Messaging component in script block and component list:

      import Messaging from './Messaging.vue'
      ...
      components: {
        Messaging
      }

      this.$store.commit('setError'

    2. Generate errors or clear errors as required:

      this.$store.commit('setError', {context: 'update', err: 'could not update data'})

      this.$store.commit('clearErrors')

!-->

<template lang='pug'>
  div.message-block
    div(v-if='errorCount || warningCount || messageCount')
      div(v-for='context,key in errors' align='center')
        div(v-if="errors[key].length")
          h4 {{errors[key].length}} {{key} Error(s) detected:
          div.table.msg-errors.alert-danger(align='center')
            tr
              td
                div(v-for='error in errors[key]')
                  b.msg-errors {{error}}
              td
                button(@click.prevent="clear(key)") x
        div(v-if="warnings[key].length")
          h4 {{warnings[key].length}} {{key} Warnings(s) found:
          div.table.msg-warnings.alert-warning(align='center')
            tr
              td
                div(v-for='warning in warnings[key]')
                  b.msg-warnings {{warnings}}
              td
                button(@click.prevent="clear(key)") x
        div(v-if="messages[key].length")
          h4 {{messages[key].length}} {{key}} Message(s):
          div.table.msg-messages.alert-success(align='center')
            tr
              td
                div(v-for='message in messages[key]')
                  b.msg-messages {{message}}
              td
                button(@click.prevent="clear(key)") x
</template>

<script>
// import store from './../myState.js'
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
  // computed: {
  //   count () { return store.count },
  //   errorCount () { return store.errorCount },
  //   errors () { return store.errors }
  // },
  computed: mapState([
    'count',
    'errorCount',
    'errors',
    'warningCount',
    'warnings',
    'messageCount',
    'messages'
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
  .message-block {
    /*border: 1px solid black*/
  }
  .msg-errors, .msg-warnings, .msg-messages {
    padding: 10px;
    margin: 10px;
    width: 50%;
    align: center;
  }
</style>
