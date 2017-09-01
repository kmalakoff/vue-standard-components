<template lang='pug'>
  span.user
    <!-- Messaging -->
    Search(:scope='role' model='user' :url="url", :inputList="list", :picked="picked", :search="search", :target="user", :prompt="prompt" :status="searchStatus" :onPick="onPick" :tables="tables" :conditions="conditions" :fields="fields" :globalSearch="globalSearch" :tooltip="tip" :title="role")
</template>

<script>
import Search from './Standard/Search.vue'
import SearchResults from './Standard/SearchResults.vue'
// import Messaging from './Standard/Messaging.vue'

import Tooltip from 'vue-directive-tooltip'
import 'vue-directive-tooltip/css/index.css'
import Vue from 'vue'
import config from '@/config.js'

Vue.use(Tooltip)

export default {
  components: {
    Search,
    SearchResults
    // Messaging
  },
  data () {
    return {
      msg: 'User App',
      alt_msg: 'Another',
      name: 'name of user..',
      search: { 'user': ['name', 'email'] },
      userURL: config.userURL
    }
  },
  props: {
    user: {},
    role: {
      type: String,
      default: 'emp'
    },
    picked: {
      type: Array,
      default () { return [] }
    },
    list: {
      type: Array,
      default () { return [] }
    },
    searchStatus: {
      type: String
    },
    onPick: {
      type: Function
    },
    onClear: {
      type: Function
    },
    include: {
      type: String
    },
    globalSearch: {
      type: Boolean,
      default: false
    },
    fields: {
      type: Array
    }
  },

  computed: {
    tables: function () {
      if (this.include) {
        return ['user', this.include]
      }
    },
    url: function () {
      var returnUrl = this.userURL
      if (this.include) { returnUrl += '&link=' + this.include + '&condition=user.id=' + this.include + '.user_id' }
      console.log('built url: ' + returnUrl)
      return returnUrl
    },
    conditions: function () {
      if (this.include) {
        var cond = this.include + '.user_id=user.id'
        return [cond]
      }
    },
    prompt: function () {
      return 'Load ' + this.role
    },
    tip: function () {
      if (this.user) {
        return '<ul> ' +
          '<li> Name: ' + this.user.name + '</li>' +
          '<li> Email: ' + this.user.email + '</li>' +
          '<li> Role: ' + this.role + '</li>' +
          '</ul>'
      } else {
        return 'TBD'
      }
    }
  },

  methods: {
    clearUser () {
      if (this.onClear) {
        this.onClear()
      } else { console.log('no clear function') }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

</style>
