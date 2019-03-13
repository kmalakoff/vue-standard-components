<!-- src/components/Standard/Menu.vue

  Usage:

  used to generate dropdown options from menu - use to trigger a modal containing data or a method execution

  Modes of operation:

  eg DropdownMenu(:title='username' :options='options')

-->
<template lang='pug'>
  div.customMenu
    a(href='/' onclick='return false' v-on:click='toggleMenu' v-on:blur="outsideOf('top')" v-on:mouseover="insideOf('top')")
      <!--  v-on:mouseout="slowHideMenu(1)" -->
      span.menu-title
        icon(v-if="visibleMenu" name='caret-up')
        icon(v-if="!visibleMenu" name='caret-down')
        span &nbsp; {{title}} &nbsp;
    div.custom-menu(v-if="visibleMenu" style='position: absolute' v-on:blur="outsideOf('bottom')" v-on:mouseover="insideOf('bottom')")
      table.table.dropdown-table.input-lg
        tr.option-row(v-for="option, i in options" width='100%')
          td.dropdown-option-cell(v-bind:class="[{firstOption: i===0}, {lastOption: i===options.length-1}]"  @click.prevent="runMethod(option)")
            span(v-if="option.checked")
              icon(name='check-circle')
              span &nbsp;
            a.inline(href='/' onclick='return false')
              span.option-label {{option.label}}
    <!-- Modal(v-if='modal' :id='modal' type='data') -->
      span &nbsp; &nbsp;
      h5 Outside: {{JSON.stringify(outside)}}
</template>

<script>
// require icon supplied by calling component...
import Modal from './Modal'
import 'vue-awesome/icons/search'
import 'vue-awesome/icons/caret-up'
import 'vue-awesome/icons/caret-down'
import 'vue-awesome/icons/check-circle'

export default {
  name: 'DropdownMenu',
  components: {
    Modal
  },
  data () {
    return {
      outside: {
        top: true,
        bottom: true
      },
      activeOption: '',

      searchIcon: {
        type: String,
        default: 'search'
      },
      showAfterWait: false,
      waitingToClose: false,
      keepOn: false,
      hovering: false,
      hide: false
    }
  },
  props: {
    title: {
      type: String,
      default: '?'
    },
    options: {
      type: Array,
      default () { return [] }
    }, // list of dropdown items (hashes with keys for: title, onClick, tooltip)
    modal: {
      type: String,
      default: 'dropdown-modal'
    } // modal id (optional)
  },
  computed: {
    visibleMenu: function () {
      if (this.outside.top) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    outsideOf (section) {
      console.log('outside ' + section)
      this.outside[section] = true
      console.log(this.outside.top + ' AND ' + this.outside.bottom)
      if (this.outside.top && this.outside.bottom) {
        this.hideMenu()
      } else {
        console.log('still in other section')
      }
    },
    insideOf (section) {
      console.log('inside ' + section)
      this.outside[section] = false
      console.log('inside ' + section)
    },
    logout () {
      console.log('log me out... ')
    },
    // Menu toggling methods (including delayed hide on mouse out/in to allow cursor movement from title to dropdown)
    // hoverMenu (force) {
    //   this.visibleMenu = true
    //   this.hovering = true
    //   this.keepOn = true
    //   console.log('(show) ' + this.visibleMenu)
    //   if (this.waitingToClose) { this.showAfterWait = true }
    // },
    toggleMenu (force) {
      this.outside.top = !this.outside.top
      // if (this.hovering && this.visibleMenu) {
      //   // just close on exit
      //   console.log('close when mousing out')
      //   this.visibleMenu = !this.outside.top
      // } else {
      //   console.log('toggle menu visibility')
      //   this.outside.top = !this.outside.top
      // }
      // console.log('(tm) menu = ' + this.visibleMenu)
    },
    hideMenu () {
      this.$set(this, 'visibleMenu', false)
      this.$set(this, 'keepOn', false)
      console.log('(hm) menu = ' + this.visibleMenu)
      this.outside.top = true
    },
    // slowHideMenu (wait) {
    //   // Hide menu (delay ignores rapid toggling by mouse out / in movements)
    //   this.hovering = false
    //   var _this = this
    //   if (this.keepOn) {
    //     console.log('require direct toggle to turn off')
    //   } else if (!wait) {
    //     this.visibleMenu = false
    //     console.log('(sh) ' + this.visibleMenu)
    //   } else if (this.waitingToClose) {
    //     this.showAfterWait = false
    //   } else {
    //     this.showAfterWait = false
    //     setTimeout(
    //       () => {
    //         _this.waitingToClose = false
    //         this.visibleMenu = this.showAfterWait
    //         console.log('(delayed) ' + this.visibleMenu)
    //       }, 100)
    //     this.waitingToClose = true
    //   }
    // },
    runMethod (opt) {
      console.log('running method...')
      if (opt && opt.onClick) {
        console.log('run onclick for dropdown: ' + JSON.stringify(opt))
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
      this.hideMenu()
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
  text-align: left;
  padding:10px;
}
.firstOption {
  border-bottom: 1px solid black;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
.lastOption {
  border-top: 1px solid black;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.menu-title {
  font-size: 2rem;
}

.customMenu {
  text-align: right;
}

.customMenu a:hover {
  font-weight: normal;
  text-decoration: none;
}

.customMenu .custom-menu {
  postion: absolute; // being overridden for some reason (works if style specified directly above)
  z-index: 20;
}

.menu-option {

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
    display: inline-block;
    padding: 5px;
    padding-left: 15px;
    /*text-decoration: none;*/
  }
  .dropdown-table a:hover{
    display: inline-block;
    padding: 5px;
    padding-left: 15px;
    text-decoration: none;
  }
</style>
