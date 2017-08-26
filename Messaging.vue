<!-- src/components/Messaging.vue -->

<template lang='pug'>
  div.message-block
    div(v-if='errorCount')
      div(v-for='context,key in errors' align='center')
        h4 {{errors[key].length}} Error(s) detected {{key}}:
        div.table.msg-errors.alert-danger(v-if="errors[key].length" align='center')
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
    /*border: 1px solid black*/
  }

  .msg-errors {
    padding: 10px;
    margin: 10px;
    width: 50%;
    align: center;
  }
</style>
