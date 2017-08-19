<!-- src/components/Messaging.vue -->

<template lang='pug'>
  div.message-block
    h3 {{count}} Messages: {{errorCount}} errors 
    div(v-if='errorCount')
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
      'errors'
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
    border: 1px solid black
  }

  .msg-errors {
    padding: 10px;
    margin: 10px;
    width: 50%;
    align: center;
  }
</style>
