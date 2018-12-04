<!-- src/components/Standard/Menu.vue

  Usage:

  used to generate dropdown options from menu - use to trigger a modal containing data or a method execution

  Modes of operation:

  eg DropdownMenu(:title='username' :options='options')

  this.options = [
    {label: 'Profile', loadModal: 'getUserData'},
    {label: 'Logout', onClick: 'logout'}
  ]
-->
<template lang='pug'>
  div.customMenu
    a(href='/' onclick='return false' v-on:mouseover="showMenu" v-on:mouseout="hideMenu(1)" v-on:click='toggleMenu')
      span.menu-title
        icon(v-if="visibleMenu" name='caret-up')
        icon(v-if="!visibleMenu" name='caret-down')
        span &nbsp; {{title}} &nbsp;
    div.custom-menu(style='position: absolute')
      table.table.dropdown-table.input-lg(v-if="visibleMenu" v-on:mouseover="showMenu" v-on:mouseout="hideMenu(1)")
        tr.dropdown-option-row(v-for="option, i in options" width='100%')
          td.dropdown-option-cell(v-bind:class="[{firstOption: i===0}, {lastOption: i===options.length-1}]")
            <!-- button(v-bind:class="[{option0: i===0}, {optionN: i===options.length}]") -->
            a(href='/' onclick='return false' @click.prevent="runMethod(option)")
              span.dropdown-option-label {{option.label}}
    Modal(v-if='modal' :id='modal' type='data')
      span &nbsp; &nbsp;
</template>

<script>
// require icon supplied by calling component...
import Modal from './Modal'
import 'vue-awesome/icons/search'
import 'vue-awesome/icons/caret-up'
import 'vue-awesome/icons/caret-down'

export default {
  name: 'DropdownMenu',
  components: {
    Modal
  },
  data () {
    return {
      visibleMenu: false,
      activeOption: '',

      searchIcon: {
        type: String,
        default: 'search'
      },
      showAfterWait: false,
      waitingToClose: false,
      keepOn: false
      // options: [
      //   {label: 'Profile', loadModal: this.getUser},
      //   {label: 'Logout', onClick: this.logout}
      // ]
    }
  },
  props: {
    title: {
      type: String,
      default: '?'
    },
    options: { type: Array }, // list of dropdown items (hashes with keys for: title, onClick, tooltip)
    modal: { type: String } // modal id (optional)
  },
  computed: {
  },
  methods: {
    getUser (e) {
      console.log('getUser: ' + JSON.stringify(e))
      var id = document.getElementById('searchString')
      var search = ''
      if (id && id.value) {
        console.log('search for: ' + id.value)
        search = id.value
      } else {
        console.log('no search string...')
      }
      console.log('perform search for ' + search)

      var results = [
        { name: 'searched for', value: search },
        { name: 'found_eg', value: 'value_eg' }
      ]
      return results
    },
    logout () {
      console.log('log me out... ')
    },
    // Menu toggling methods (including delayed hide on mouse out/in to allow cursor movement from title to dropdown)
    showMenu (force) {
      this.visibleMenu = true
      if (this.waitingToClose) { this.showAfterWait = true }
    },
    toggleMenu (force) {
      console.log('turn off menu : keep on ? ' + this.keepOn)
      this.waitingToClose = false
      if (force) {
        this.visibleMenu = false
        this.keepOn = false
      } else if (this.keepOn) {
        this.visibleMenu = false
        this.keepOn = false
      } else {
        this.visibleMenu = true
        this.keepOn = true
      }
    },
    hideMenu (wait) {
      // Hide menu (delay ignores rapid toggling by mouse out / in movements)
      var _this = this
      console.log('hide menu...')
      if (this.keepOn) {
        console.log('require direct toggle to turn off')
      } else if (!wait) {
        this.visibleMenu = false
      } else if (this.waitingToClose) {
        this.showAfterWait = false
      } else {
        this.showAfterWait = false
        setTimeout(
          () => {
            _this.waitingToClose = false
            this.visibleMenu = this.showAfterWait
          }, 1000)
        this.waitingToClose = true
      }
    },
    runMethod (opt) {
      console.log('run method...')
      if (opt && opt.onClick) {
        opt.onClick(opt)
      }

      if (opt && opt.loadModal) {
        var data = opt.loadModal.data
        var title = opt.loadModal.title
        var id = opt.loadModal.id || 'default-modal'

        this.$store.dispatch('clearModal')
        // populate modal...
        console.log('loadModal: ' + JSON.stringify(opt.loadModal))
        if (data.constructor === Function) {
          data = opt.loadModal.data(opt)
          console.log('reloaded data to ' + JSON.stringify(data))
        }

        console.log('load data: ' + JSON.stringify(data))
        console.log('load title: ' + JSON.stringify(title))
        if (title) {
          this.$store.dispatch('setModalTitle', title)
        }
        if (data) {
          this.$store.dispatch('setModalData', data, {title: title})
          console.log('update data for ' + id)
          this.$store.dispatch('toggleModal', id)
        }
      }
      console.log('force toggle menu off...')
      this.toggleMenu(1)
    }
  }
}
</script>

<style scoped lang="sass?outputStyle=expanded">

/* Colour settings */

 /* match btn-primary + hover below */

/* Other seeings */

.custom-menu {
  right: 10px;
}
.dropdown-option-cell {
  width: 100%;
  text-align: left;
  padding:10px;
}

.customMenu {
  text-align: right;
}

.customMenu .custom-menu {
  postion: absolute; // being overridden for some reason (works if style specified directly above)
  z-index: 2;
}

 .dropdown-table {
    position: right;
    right: 0;
    top: 60px;
    margin: 0px;
  }
  .dropdown-table tr {
    /*padding: 5px;*/
  }
  .dropdown-table tr td {
    /*padding: 0px;*/
    /*padding-left: 15px;*/
  }

  .dropdown-table a{
    display: block;
    padding: 5px;
    padding-left: 15px;
  }
  .dropdown-table a:hover{
    display: block;
    padding: 5px;
    padding-left: 15px;
  }
</style>
