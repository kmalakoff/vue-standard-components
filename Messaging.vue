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
  div.message-block(v-if='errorCount || warningCount || messageCount')
    div.navbar-right
      button(@click.prevent="clear") x
    div.msg-errors(v-if='errorCount')
      div(v-for='err in errors' align='center')
        b {{err}}
    div.msg-warnings(v-if='warningCount')
      div(v-for='warn in warnings' align='center')
        b {{warn}}
    div.msg-messages(v-if='messageCount')
      div(v-for='msg in messages' align='center')
        b {{msg}}
  // div(v-else)
  //   b No messages ({{errorCount}} : {{errors}})
</template>

<script>
// import store from './../myState.js'
// import { mapState } from 'vuex'

export default {
  data () {
    return {
      status: ''
      // note: ''
    }
  },
  props: {
    msg: {
      type: Array,
      default () { return [] }
    },
    warn: {
      type: Array,
      default () { return [] }
    },
    err: {
      type: Array,
      default () { return [] }
    },
    stored: {
      type: Boolean,
      default: true // use stored messages
    }
  },
  // computed: {
  //   count () { return store.count },
  //   errorCount () { return store.errorCount },
  //   errors () { return store.errors }
  // },
  computed: {
    messageCount: function () {
      if (this.stored) {
        return this.$store.getters.messageCount || 0
      } else {
        return this.msg.length
      }
    },
    warningCount: function () {
      if (this.stored) {
        return this.$store.getters.warningCount || 0
      } else {
        return this.warn.length
      }
    },
    errorCount: function () {
      if (this.stored) {
        return this.$store.getters.errorCount || 0
      } else {
        return this.err.length
      }
    },
    messages: function () {
      if (this.stored) {
        return this.$store.getters.messages
      } else {
        return { default: this.msg }
      }
    },
    warnings: function () {
      if (this.stored) {
        return this.$store.getters.warnings
      } else {
        return { default: this.warn }
      }
    },
    errors: function () {
      if (this.stored) {
        console.log('got stored errors')
        return this.$store.getters.errors
      } else {
        console.log('got immediate errors')
        return { default: this.err }
      }
    }
  },
  methods: {
    clear (scope) {
      console.log('clear messages')
      this.$store.dispatch('clearMessages')
    }
  },
  watch: {
    errorCount: function () {
      console.log('error count changed...')
    }
  }

}
</script>

<style>
  .message-block {
    padding: 3px;
    padding-right: 20px;
    text-align: center;
    border: 1px solid black;
    background-color: grey;
    color: black;
  }
  .msg-errors, .msg-warnings, .msg-messages {
    padding: 10px;
    margin: 10px;
    // width: 50%;
    align: center;
  }
  .msg-errors {
    background-color: lightred;
  }
  .msg-warnings {
    background-color: organge;
  }
  .msg-messages {
    background-color: lightgreen;
  }

  .note {
    // color: red;
    // background: #FF9E80;
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
    // background: #FFFFFF;
    padding: 0.75rem 1.5rem;
    box-sizing: border-box;
    position: relative;
    bottom: 100%;
    z-index: 0;
    transition: all .5s ease-out;
  }
  .note--down {
    transform: translateY(100%);
    z-index: -1;
  }

  .note--up {
    transform: translateY(0);
    z-index: 1;
  }

</style>
