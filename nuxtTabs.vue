<template lang='pug'>
  div.tab-wrapper
    div.visible-tab#tabBar
      // HTML specific to handling NUXT static pages //
      a.tabItem(v-for='key, item in list' href='#' target='_blank' onclick='return false;')
        div(v-if="key.constructor === Object")
          // pages passed as array of hashes {label: page} - eg [ { Home: 'homepage', 'About Us': 'about' } ]
          span.tab-label(v-for='page, label in key')
            nuxt-link(:to='page' color='black' v-on:click.native='onClick(page)')
              b.submenu(v-bind:class="[{activeTab: show === page}, {inactiveTab: show !== page}]") {{label}}
              span &nbsp; &nbsp;
        div(v-else)
          // pages passed as simple array where label name is same as page name
          nuxt-link(:to='key')
            b.submenu {{key}}
            span &nbsp; &nbsp;
      a.icon(href="#" v-on:click='openMenu(1)')
        fa(icon='bars' scale='2')

</template>
<script>
// import 'vue-awesome/icons/bars'
export default {
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    default: {
      type: String,
      default: ''
    },
    onPick: {
      type: Function,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      show: this.default
    }
  },
  methods: {
    openMenu: function(force) {
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
    onClick: function(el) {
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
.tab-wrapper {
}

.onPage {
  font-weight: bold;
}
.onPage:hover {
}
.offPage {
}
.offPage:hover {
}

.submenu {
  font-size: 1.5rem;
}

.visible-tab {
  overflow: hidden;
  padding: 1rem;
  margin: 0px;
  font-size: 2rem;
}

.visible-tab a.tabItem {
  float: left;
  display: block;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

.visible-tab a.icon {
  display: none;
}

@media screen and (max-width: 768px) {
  div.visible-tab a.tabItem {
    display: none;
  }
  div.visible-tab a.icon {
    float: right;
    display: block;
  }
}

@media screen and (max-width: 768px) {
  div.visible-tab.responsive {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 5;
  }
  div.visible-tab.responsive a.icon {
    position: absolute;
    right: 1rem;
    top: 1rem;
    z-index: 10;
  }
  div.visible-tab.responsive a.tabItem {
    float: none;
    display: block;
    text-align: left;
    width: 100%;
  }
}
</style>
