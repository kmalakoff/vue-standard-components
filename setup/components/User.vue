<template lang='pug'>
  div.user
    <!-- Messaging -->
    div(v-if='picked && picked.length && picked[0].id')
      h3 {{ picked[0].name }} &nbsp; &nbsp;
        button.btn.btn-sm(v-tooltip="{html: 'userTooltip'}") ?
      div#userTooltip
        ul
          li Name: {{picked[0].name}}
          li Email: {{picked[0].email}}

      button(v-on:click="clearUser") new User
    div(v-if="!picked || !picked.length")
      Search(scope='user', model='user' url='http://localhost:1234/Record_API/search?table=user', :inputList="list", :picked="picked", :search="search", :target="user", prompt='Find Patient' :status="searchStatus")
      hr
</template>

<script>
import Search from './Standard/Search.vue'
import SearchResults from './Standard/SearchResults.vue'
// import Messaging from './Standard/Messaging.vue'

import Tooltip from 'vue-directive-tooltip'
import 'vue-directive-tooltip/css/index.css'
import Vue from 'vue'

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
      search: {'user': ['name', 'email']}
    }
  },
  props: {
    user: {},
    role: {
      type: String,
      default: 'user'
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
    }
  },
  methods: {
    clearUser () {
      if (this.picked && this.picked.length) {
        console.log(' deleting: ' + JSON.stringify(this.picked))
        this.picked.splice(0, 1)
        console.log(' deleted: ' + JSON.stringify(this.picked))
      }
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
