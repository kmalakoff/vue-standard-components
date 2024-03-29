<!-- src/components/Standard/Menu.vue

  Usage:

  Modes of operation:

  type = 'url'. (links point to url .. more flexible, but slower)
  *************
  links: [ goHere: '/goHere', maps: 'https/maps.google.ca']
  eg Menu(:links="links")

  type = 'onClick' ... execute onClick (eg switch layers on tab clicks)
  *****************

  predefine:

  links: [ A: 'Acomponent', B: 'Bcomponent'],
  active_block: 'A',

  methods: {
    activate (layer) {
      console.log('activate ' + layer)
      this.active_block = layer
    }
  },

  template:

  Menu(:links="links" :onClick='activate' :active="active_block")

  div(v-for='link in links')
    div(v-if="active_block==='A'")
      AComponent()

-->

<template lang='pug'>
  span.menu
    span
    <!-- div.navbar-left -->
      span
      ul
        span(v-html='prefix') &nbsp; &nbsp;
        li.dropdown(:class="direction" v-for="link in links")
          span(v-if="link.constructor === Object")
            span(v-for="target,label in link")
              span(v-if="target.constructor === Array && type==='url'")
                <!-- Multi-level menus only ...  -->
                a.dropbtn(href="javascript:void(0)") {{label}}
                div.dropdown-content
                  span(v-for="targetN, index in target")
                    span(v-if="targetN.constructor === Object")
                      span(v-for="subUrl,subLabel in targetN")
                          a(:href="subUrl") S: {{subLabel}}
                    span(v-else)
                      router-link(:to="{name: targetN}") {{targetN}}
              span(v-else-if="type==='url'")
                <!-- Standard array of key:value pairs (name: target)  -->
                a(:href="target" target="_blank") {{label}}
              span(v-else-if="onClick")
                span(v-if="active===target")
                  a.active.input-lg(href='#lower' v-on:click='activate(target)') {{label}}
                span(v-else)
                  a.inactive.input-lg(href='#' v-on:click='activate(target)') {{label}}
              span(v-else)
                <!-- Internal links do not need keys -->
                router-link(:to="{name: link}") {{link}}
          span(v-else-if="link.constructor === String")
            a(href='#' v-on:click='pick(link)' v-bind:class="[{onMenuItem: link===active}, {offMenuItem: link!==active}]") {{link}}
          span(v-else)
            b ?
</template>

<script>
export default {

  data () {
    return {
      active_block: ''
    }
  },

  props: {
    links: {
      type: Array
    },
    type: {
      type: String,
      default: 'url'
    },
    prefix: {
      type: String
    },
    default: {
      type: String
    },
    onClick: {
      type: Function
    },
    options: {
      type: Object,
      default () { return {} }
    },
    direction: {
      type: String,
      default: 'vertical'
    },
    defaultTab: {
      type: String,
      default: ''
    }
  },
  computed: {
    active: function () {
      return this.active_block || this.options.default || this.defaultTab
    }
  },
  methods: {
    activate: function (layer) {
      this.active_block = layer
      console.log('activated ' + this.active_block)
      this.onClick(layer)
    },
    pick: function (el) {
      this.active_block = el
      if (this.onClick) {
        console.log('picking ' + el + ': ' + this.active)
        this.onClick(el)
      } else {
        console.log('no pick function supplied...')
      }
    }
  }
}
</script>

<style scoped lang="sass?outputStyle=expanded">

  $menu-background-colour: transparent;
  $menu-colour: #999;
  $hover-colour: black;
  $active-colour: #333;
  $dropdown-colour: #f9f9f9;
  $dropdown-link-colour: #f9f9f9;
  $dropdown-hover-colour: #f1f1f1;

  .menu {
    width: 100%;
    font-size: 2rem;
  }
  .onMenuItem {
    color: $active-colour
  }
  .offMenuItem {
    color: $menu-colour
  }
  ul {
      background-color: $menu-background-colour;
      list-style-type: none;
      margin: 0;
      padding: 0;
      overflow: hidden;
  }

  li {
      /*float: left;*/
  }

  /*Format dropdown menu for multi-level menu.  ... (not yet set up) */

  li.vertical a, .dropbtn {
      display: block;
  }
  li.horizontal a, .dropbtn {
      display: inline-block;
  }

  li a, .dropbtn {
      color: $menu-colour;
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
  }

  li a:hover, .dropdown:hover .dropbtn {
      font-weight: bold;
      color: $hover-colour;
  }

  li.dropdown {
      display: inline-block;
  }

  .dropdown-content {
      display: none;
      position: absolute;
      background-color: $dropdown-colour;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
  }

  .dropdown-content a {
      color: $dropdown-link-colour;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
      text-align: left;
  }

  .dropdown-content a:hover {
    background-color: $dropdown-hover-colour;
  }

  .dropdown:hover .dropdown-content {
      display: block;
  }

  .navbar-center
  {
      position: absolute;
      width: 100%;
      left: 0;
      text-align: center;
      margin:0 auto;
  }

  a.active {
    font-weight: bold;
    color: $active-colour;
  }
  a.inactive {
    font-weight: normal;
    color: $menu-colour;
  }
</style>
