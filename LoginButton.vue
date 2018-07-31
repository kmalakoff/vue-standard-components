<!-- src/components/Standard/Menu.vue -->
<!--   hr
  div
    div.form-group
      div.input-group
        input.form-control.input-lg.full-page(type='text' placeholder='-- Search --')
        div.input-group-addon
          span.input-group-btn
            button.btn.btn-lg.btn-primary.full-page(@click.prevent='searchMethod')
              icon(name='search')
          span.input-group-addon(style='background-color: transparent; border: 0px;')
            span &nbsp; &nbsp;
            span &nbsp; &nbsp;
            span(v-if='user')
              b {{user}}
            span(v-else)
              Modal(type='login')
            span &nbsp; &nbsp;
            span &nbsp; &nbsp;
        span.input-group-addon(style='background-color: transparent; border: 0px;')
          a(href='/' onclick='return false' @click.prevent="toggleBlock")
              icon(:name='icon' color='black' scale='2')
          span &nbsp; &nbsp;
          div(@mouseleave="hideMenu")
            table.table.popup-table.input-lg(v-if="visibleMenu")
              tr
                td
                  router-link(:to="{name: 'About Us'}")
                    b About Us
              tr(v-if='user')
                td
                  a(href='#' onclick='return false' @click.prevent='logout')
                    b Logout -->
<template lang='pug'>
  div
    span(v-if='payload && payload.user')
      b {{payload.user}}
    span(v-else)
      Modal(type='login' :options='options')
    span &nbsp; &nbsp;
</template>

<script>
  // require icon supplied by calling component...
  import Modal from './Modal'
  import 'vue-awesome/icons/bars'
  import 'vue-awesome/icons/search'
  import auth from '../../auth'
  // import config from '@/config.js'

  export default {
    data () {
      return {
        holdBlock: {menu: false, search: false},
        visibleBlock: {menu: false, search: false},

        options: { openText: 'Log In' }
      }
    },
    components: {
      Modal
    },
    props: {
      menuIcon: {
        type: String,
        default: 'bars'
      },
      searchIcon: {
        type: String,
        default: 'search'
      },
      list: {
        type: Array
      },
      links: {
        type: Array
      },
      payload: {
        type: Object
      }
    },
    mounted: function () {
      // console.log('header mounted')
      // var payload = this.$store.getters.payload
      // console.log('header payload: ' + JSON.stringify(payload))
      // this.payload = payload
    },
    // computed: {
    //   payload: function () {
    //     return this.payload
    //   }
    // },
    created: function () {
      console.log('load payload first...')

      // var payload = config.demo_payload
      // console.log('config payload: ' + JSON.stringify(payload))

      // this.$store.commit('LOAD_DEMO')
      // var initPayload = this.$store.getters.payload

      // console.log('init: ' + JSON.stringify(initPayload))
      // console.log(initPayload)

      // var localPayload = localStorage.getItem('payload')

      // this.payload = localPayload
      // console.log('local: ' + JSON.stringify(localPayload))
    },
    computed: {
      user: function () {
        var payload = this.$store.getters.payload
        console.log('loginpop user' + JSON.stringify(payload))
        if (payload && payload.user) {
          return payload.user
        } else {
          return null
        }
      },
      ac: function () {
        return auth.checkAuth()
      }
    },
    methods: {
      logout () {
        console.log('log out')
        // auth.logout()
        this.$store.dispatch('AUTH_LOGOUT')
      },
      toggleBlock (block) {
        this.visibleBlock[block] = !this.visibleBlock[block]
        console.log('toggled hold: ' + this.holdBlock[block] + ': ' + this.visibleBlock[block])
      },
      hideBlock (block) {
        // Hide menu (delay ignores rapid toggling by mouse out / in movements)
        var _this = this
        if (!block) {
          console.log('no block defined')
        } else if (this.holdBlock[block]) {
          this.onexpire = false
        } else {
          setTimeout(
            () => {
              _this.holdBlock[block] = false
              this.visibleBlock[block] = this.onexpire
            }, 1000)
          this.holdBlock[block] = true
        }
      },
      searchMethod () {
        var id = document.getElementById('searchString')
        var search = ''
        if (id && id.value) {
          console.log('search for: ' + id.value)
          search = id.value
        } else {
          console.log('no search string...')
        }
        console.log('perform search for ' + search)
      },
      redirect (page) {
        this.$route.router.go(page)
      }
    }
  }
</script>

<style scoped lang="sass?outputStyle=expanded">

  $menu-background-colour: transparent;
  $menu-colour: #333;

  @media (max-width: 900px) {
    .full-page {
      display: none;
    }
  }

  .popup-table {
    position: absolute;
    /*background-color: #999;*/
    color: black;
    /*padding: 0px;*/
    right: 0;
    top: 60px;
  }
  .popup-table tr {
    /*padding: 5px;*/
  }
  .popup-table tr td {
    /*padding: 0px;*/
    /*padding-left: 15px;*/
  }

  .popup-table a{
    color: black;
    display: block;
    background-color: #ccc;
    padding: 5px;
    padding-left: 15px;
    /*text-decoration: none;*/
  }
  .popup-table a:hover{
    color: white;
    display: block;
    background-color: #aaa;
    padding: 5px;
    padding-left: 15px;
    text-decoration: none;
  }

</style>
