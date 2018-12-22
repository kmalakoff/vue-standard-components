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
  div.message-block(v-if='errorsFound|| warningsFound || messagesFound')
    div.right
      button.btn.btn-danger(@click.prevent="clear")
        icon(name='times')
    div.msg-errors(v-if='errorsFound')
      div(v-for='err in errors' align='center')
        b(v-if='err') {{err}}
    div.msg-warnings(v-if='warningsFound')
      div(v-for='warn in warnings' align='center')
        b(v-if='warn') {{warn}}
    div.msg-messages(v-if='messagesFound')
      div(v-for='msg in messages' align='center')
        b(v-if='msg') {{msg}}
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
        var errs = this.$store.getters.errors
        console.log('got ' + errs.length + ' stored errors')
        var errors = []
        for (var i = 0; i < errs.length; i++) {
          var err = errs[i]
          if (err && err.constructor === Array) {
            for (var j = 0; j < err.length; j++) {
              errors.push(err[j])
            }
          } else {
            errors.push(err)
          }
        }
        for (var k = 0; k < errors.length; k++) {
          var error = errors[k]
          if (error && error.constructor === Object) {
            if (error.message) {
              errors[k] = errors[k].message
            } else if (error.error) {
              errors[k] = errors[k].error
            } else {
              errors[k] = JSON.stringify(error)
            }
          }
        }
        return errors
      } else {
        console.log('got immediate errors')
        return { default: this.err }
      }
    },
    messagesFound () {
      if (this.messageCount) {
        var string = JSON.stringify(this.messages)
        if (string.match(/[a-zA-Z]/)) {
          return true
        }
      }
      return false
    },
    warningsFound () {
      if (this.warningCount) {
        var string = JSON.stringify(this.warnings)
        if (string.match(/[a-zA-Z]/)) {
          return true
        }
      }
      return false
    },
    errorsFound () {
      if (this.errorCount) {
        var string = JSON.stringify(this.errors)
        if (string.match(/[a-zA-Z]/)) {
          return true
        }
      }
      return false
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
    },
    warningCount: function () {
      console.log('warning count changed...')
    },
    messageCount: function () {
      console.log('message count changed...')
    }
  }

}
</script>

<style>
  .message-block {
    padding: 3px;
    padding-right: 20px;
    text-align: center;
    // border: 1px solid black;
    color: black;
    background-color: lightgrey;
    margin: 10px;
  }

  .msg-errors, .msg-warnings, .msg-messages {
    padding: 2rem;
    margin: 10px;
    font-size: 2rem;
    align: center;
  }

  .msg-errors {
    // box-shadow: 0 0 3pt 2pt;
    color: red;
  }
  .msg-warnings {
    color: orange;
    // background-color: orange;
  }
  .msg-messages {
    color: green;
    // background-color: lightgreen;
  }

  @media screen and (min-width: 768px) {
    div.msg-errors {
      line-height: 2rem;
      // border: 1px solid red;
    }
  }

  .note {
    padding: 0.75rem 1.5rem;
    box-sizing: border-box;
    position: relative;
    bottom: 100%;
    z-index: 0;
    width: 100%;
    transition: all .5s ease-out;
  }
  .note-mask {
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
