<!-- src/components/Standard/Menu.vue -->

<template lang='pug'>
  span
    span
      a(href='/' onclick='return false' @click.prevent="holdMenu=!holdMenu" v-on:mouseover="showMenu" v-on:mouseout="hideMenu" @click="showMenu") 
        icon(:name='icon' color='black' scale='2')
    div
      table.table.popup-table(v-if="visibleMenu || holdMenu" v-on:mouseover="showMenu" v-on:mouseout="hideMenu")
        tr
          td 
            a(href='#') About Us
        tr
          td
            a(href='#') Logout
</template>

<script>
  // require icon supplied by calling component...
  import 'vue-awesome/icons/bars'
  export default {
    data () {
      return {
        visibleMenu: false,
        holdMenu: false
      }
    },

    props: {
      icon: {
        type: String,
        default: 'bars'
      },
      list: {
        type: Array
      }
    },
    methods: {
      showMenu () {
        console.log('show menu...')
        this.visibleMenu = true
      },
      hideMenu () {
        var _this = this
        if (!_this.holdMenu) {
          setTimeout(
            function () {
              console.log('hide...')
              _this.holdMenu = false
            }, 1000)
          this.holdMenu = true
          this.visibleMenu = false
        }
      }
    }
  }
</script>

<style scoped lang="sass?outputStyle=expanded">

  $menu-background-colour: transparent;
  $menu-colour: #333;

  .popup-table {
    position: auto;
    background-color: #999;
    color: black;
    padding: 5px;
    right: 0;
  }
  .popup-table tr {
    padding: 5px;
  }
  .popup-table tr td {
    padding: 5px;
    padding-left: 15px;
  }

  .popup-table tr td a{
    color: white;
  }
  .popup-table tr td a:hover{
    color: red;
  }

</style>