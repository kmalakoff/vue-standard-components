<template lang='pug'>
  div
    div.visible-tab#tabBar
      a.tabItem(v-for='item in list' href='#' target='_blank' @click.prevent="onClick(item)")
        b.submenu {{item}}
        span &nbsp; &nbsp;
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
      if (this.onPick) {
        this.show = el
        this.onPick(el)
      }
      this.openMenu()
    }
  }
}
</script>

<style scoped>
.onPage {
  color: black;
  font-weight: bold;
  // background-color: grey !important;
}
.onPage:hover {
  color: black;
  // background-color: grey !important;
}
.offPage {
  // background-color: grey !important;
  color: grey;
}
.offPage:hover {
  // background-color: darkgrey !important;
  color: black;
}

.visible-tab {
  overflow: hidden;
  background-color: #333;
}

.visible-tab a {
  float: left;
  display: block;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

.visible-tab a:hover {
  background-color: #ddd;
  color: black;
}

.active {
  background-color: #4CAF50;
  color: white;
}

.visible-tab .icon {
  display: none;
}

@media screen and (max-width: 768px) {
  .visible-tab a.tabItem {display: none;}
  .visible-tab a.icon {
    float: right;
    display: block;
    color: red;
  }
}

@media screen and (max-width: 768px) {
  .visible-tab.responsive {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 5;
  }
  .visible-tab.responsive .icon {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 10;
  }
  .visible-tab.responsive a {
    float: none;
    display: block;
    text-align: left;
  }
}
</style>
