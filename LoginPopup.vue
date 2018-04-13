<!-- src/components/Standard/Menu.vue -->

<template lang='pug'>
  div
    div.input-group
      input.form-control.input-lg(type='text' placeholder='-- Search --')
      span.input-group-btn
        button.btn.btn-lg.btn-primary(@click.prevent='searchMethod')
          icon(name='search')
      span.input-group-addon(style='background-color: transparent; border: 0px;')
        span &nbsp; &nbsp;
        span &nbsp; &nbsp;
        Modal(type='login')
        span &nbsp; &nbsp;
        span &nbsp; &nbsp;
      span.input-group-addon(style='background-color: transparent; border: 0px;')
        a(href='/' onclick='return false' @click.prevent="toggleMenu") 
            icon(:name='icon' color='black' scale='2')
        span &nbsp; &nbsp;
        div(@mouseout="hideMenu")
          table.table.popup-table.input-lg(v-if="visibleMenu")
            tr
              td
                router-link(:to="{name: 'About Us'}")
                  b About Us
  </template>

<script>
  // require icon supplied by calling component...
  import Modal from './Modal'
  import 'vue-awesome/icons/bars'
  import 'vue-awesome/icons/search'
  // import config from '@/config.js'

  export default {
    data () {
      return {
        payload: {},
        visibleMenu: false,
        holdMenu: false,
        loginOptions: { openButton: 'LogIN' }
      }
    },
    components: {
      Modal
    },
    props: {
      icon: {
        type: String,
        default: 'bars'
      },
      list: {
        type: Array
      },
      links: {
        type: Array
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
      var initPayload = this.$store.getters.payload

      console.log('init: ' + JSON.stringify(initPayload))
      console.log(initPayload)

      var localPayload = localStorage.getItem('payload')

      this.payload = localPayload
      console.log('local: ' + JSON.stringify(localPayload))
    },
    methods: {
      toggleMenu () {
        this.visibleMenu = !this.visibleMenu
        console.log('toggled hold: ' + this.holdMenu + ': ' + this.visibleMenu)
      },
      showMenu () {
        // show menu (delay ignores rapid toggling by mouse out / in movements)
        var _this = this
        if (this.holdMenu) {
          this.onexpire = true
        } else {
          setTimeout(
            () => {
              _this.holdMenu = false
              this.visibleMenu = this.onexpire
            }, 1000)
          this.holdMenu = true
        }
      },
      hideMenu () {
        // Hide menu (delay ignores rapid toggling by mouse out / in movements)
        var _this = this
        if (this.holdMenu) {
          this.onexpire = false
        } else {
          setTimeout(
            () => {
              _this.holdMenu = false
              this.visibleMenu = this.onexpire
            }, 1000)
          this.holdMenu = true
        }
      },
      redirect (page) {
        this.$route.router.go(page)
      },
      logout () {
        console.log('logged out')
      }
    }
  }
</script>

<style scoped lang="sass?outputStyle=expanded">

  $menu-background-colour: transparent;
  $menu-colour: #333;

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