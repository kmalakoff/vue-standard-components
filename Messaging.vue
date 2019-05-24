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
    div.top-right
      button.btn.btn-close(@click.prevent="clear")
        icon(name='times' color='black')
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
      status: '',
      messages: [],
      warnings: [],
      errors: [],
      messageCount: 0,
      warningCount: 0,
      errorCount: 0,
      messagesFound: false,
      warningsFound: false,
      errorsFound: false
      // note: ''
    }
  },
  props: {
    msg: {
      type: String,
      default () { return '' }
    },
    warn: {
      type: String,
      default () { return '' }
    },
    err: {
      type: String,
      default () { return '' }
    },
    storeExists: {
      type: Boolean,
      default: true
    }
  },
  created: function () {
    this.parse()
  },
  // computed: {
  //   count () { return store.count },
  //   errorCount () { return store.errorCount },
  //   errors () { return store.errors }
  // },
  computed: {
    stored: function () {
      if (this.msg || this.err || this.warn) {
        return false
      } else {
        return this.storeExists
      }
    }
  },
  methods: {
    parse () {
      if (this.stored) {
        this.messageCount = this.$store.getters.messageCount || 0
        this.warningCount = this.$store.getters.warningCount || 0
        this.errorCount = this.$store.getters.errorCount || 0

        this.messages = this.$store.getters.messages
        this.warnings = this.$store.getters.warnings
        this.errors = this.$store.getters.errors
      } else {
        this.messageCount = this.msg.length
        this.warningCount = this.warn.length
        this.errorCount = this.err.length

        this.messages = [this.msg]
        this.warnings = [this.warn]
        this.errors = [this.err]
      }
      // var errs = this.$store.getters.errors
      // console.log('got ' + errs.length + ' stored errors')
      // var errors = []
      // for (var i = 0; i < errs.length; i++) {
      //   var err = errs[i]
      //   if (err && err.constructor === Array) {
      //     for (var j = 0; j < err.length; j++) {
      //       errors.push(err[j])
      //     }
      //   } else {
      //     errors.push(err)
      //   }
      // }
      // for (var k = 0; k < errors.length; k++) {
      //   var error = errors[k]
      //   if (error && error.constructor === Object) {
      //     if (error.message) {
      //       errors[k] = errors[k].message
      //     } else if (error.error) {
      //       errors[k] = errors[k].error
      //     } else {
      //       errors[k] = JSON.stringify(error)
      //     }
      //   }
      this.messagesFound = false
      if (this.messageCount) {
        var Mstring = JSON.stringify(this.messages)
        if (Mstring.match(/[a-zA-Z]/)) {
          this.messagesFound = true
        }
      }

      this.warningsFound = false
      if (this.warningCount) {
        var Wstring = JSON.stringify(this.warnings)
        if (Wstring.match(/[a-zA-Z]/)) {
          this.warningsFound = true
        }
      }

      this.errorsFound = false
      if (this.errorCount) {
        var Estring = JSON.stringify(this.errors)
        if (Estring.match(/[a-zA-Z]/)) {
          this.errorsFound = true
        }
      }
    },
    clear (scope) {
      console.log('clear messages')
      this.message = ''
      this.warning = ''
      this.error = ''
      this.$store.dispatch('clearMessages')
      this.parse()
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
    },
    msg: function () {
      console.log('message changed .. reloaded')
      this.$forceUpdate()
      this.parse()
    },
    warn: function () {
      console.log('warning changed .. reloaded')
      this.$forceUpdate()
      this.parse()
    },
    err: function () {
      console.log('error changed .. reloaded')
      this.$forceUpdate()
      this.parse()
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
    color: black;
    background-color: lightyellow;
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
