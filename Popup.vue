<!-- src/components/Standard/Menu.vue -->

<template lang='pug'>
  span
    span
      a(href='/' onclick='return false' @click.prevent="toggleMenu") 
        icon(:name='icon' color='black' scale='2')
    div
      table.table.popup-table(v-if="visibleMenu")
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
      }
    }
  }
</script>

<style scoped lang="sass?outputStyle=expanded">

  $menu-background-colour: transparent;
  $menu-colour: #333;

  .popup-table {
    position: absolute;
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