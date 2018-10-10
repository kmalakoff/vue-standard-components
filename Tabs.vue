<template lang='pug'>
  div
    div.visibleTab#tabBar
      a.tabItem(v-for='item in list' href='#' target='_blank' @click.prevent="onClick(item)")
        b.submenu {{item}}
        span &nbsp; &nbsp;
      a.icon(href="javascript:void(0);" v-on:click='openMenu()')
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
    openMenu: function () {
      var x = document.getElementById('tabBar')
      if (x.className === 'visibleTab') {
        x.className += ' responsive'
      } else {
        x.className = 'visibleTab'
      }
    },
    onClick: function (el) {
      console.log(' onPick ' + JSON.stringify(el))
      if (this.onPick) {
        this.show = el
        this.onPick(el)
      }
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

.visibleTab {
  overflow: hidden;
  background-color: #333;
}

.visibleTab a {
  float: left;
  display: block;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

.visibleTab a:hover {
  background-color: #ddd;
  color: black;
}

.active {
  background-color: #4CAF50;
  color: white;
}

.visibleTab .icon {
  display: none;
}

@media screen and (max-width: 600px) {
  .visibleTab a.tabItem {display: none;}
  .visibleTab a.icon {
    float: right;
    display: block;
    color: red;
  }
}

@media screen and (max-width: 700px) {
  .visibleTab.responsive {position: relative;}
  .visibleTab.responsive .icon {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 10;
  }
  .visibleTab.responsive a {
    float: none;
    display: block;
    text-align: left;
  }
}
</style>
