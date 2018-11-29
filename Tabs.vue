<template lang='pug'>
  div.tabBar
    div.visible-tab#tabBar
      a.tabItem(v-for='item in list' href='#' target='_blank' @click.prevent="onClick(item)" v-bind:class="[{activetab: show === item}]")
        div(v-if="item.constructor === String")
          b.submenu {{item}}
          span &nbsp; &nbsp;
        div(v-else if="item.constructor === 'Object")
          icon(:name='item.icon')
        div(v-else)
          b.submenu ?: {{item.constructor}}
      a.icon(href="javascript:void(0);" v-on:click='openMenu(1)')
        icon(name='bars')
</template>
 <!-- v-bind:class="[{onPage: show===item}, {offPage: show!==item}]" -->
<script>
import 'vue-awesome/icons/bars'
export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },
    default: {
      type: String,
      default: ''
    },
    onPick: {
      type: Function,
      default () {
        return null
      }
    }
  },
  data () {
    return {
      show: this.default
    }
  },
  created: function () {
    console.log('create tabs')
    this.show = this.default
  },
  watch: {
    default: function () {
      console.log('changed default to ' + this.default)
      this.show = this.default
    }
  },
  methods: {
    openMenu: function (force) {
      console.log('toggle menu...')
      console.log(JSON.stringify(force))
      var x = document.getElementById('tabBar')
      if (force && x.className === 'visible-tab') {
        x.className += ' responsive'
        console.log('make responsive')
      } else {
        console.log('make UNresponsive')
        x.className = 'visible-tab'
      }
    },
    onClick: function (el) {
      console.log(' onPick ' + JSON.stringify(el))
      if (el.constructor === Object) {
        el = el.name
        console.log('convert object to ' + el)
      }
      if (this.onPick) {
        this.show = el
        this.onPick(el)
      }
      this.openMenu()
    }
  }
}
</script>

<style lang="sass?outputStyle=expanded" scoped>

</style>
