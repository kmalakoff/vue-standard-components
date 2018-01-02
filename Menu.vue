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
  div.menu
    div.navbar-center
      ul
        li.dropdown(v-for="link in links")         
          span(v-if="link.constructor === Object")
            span(v-for="target,label in link")
              span(v-if="target.constructor === Array && type==='url'")
                <!-- Multi-level menus only ...  -->
                a.dropbtn(href="javascript:void(0)") {{label}} 
                div.dropdown-content
                  span(v-for="targetN,index in target")
                    span(v-if="targetN.constructor === Object")
                      span(v-for="subUrl,subLabel in targetN")
                          a(:href="subUrl") {{subLabel}}
                    span(v-else)
                      router-link(:to="{name: targetN}") {{targetN}} 
              span(v-else-if="type==='url'")
                <!-- Standard array of key:value pairs (name: target)  -->
                a(:href="target" target="_blank") {{label}}
              span(v-else-if="onClick")
                span(v-if="active===target")
                  a.active(href='#' v-on:click='activate(target)') {{label}}
                span(v-else)
                  a.inactive(href='#' v-on:click='activate(target)') {{label}}
              span(v-else)
                <!-- Internal links do not need keys -->
                router-link(:to="{name: link}") {{link}} 

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
      target: {
        type: String,
        default: 'internal'
      },
      type: {
        type: String,
        default: 'url'
      },
      default: {
        type: String
      },
      onClick: {
        type: Function
      },
      active: {
        type: String
      }
    },
    computed: {
    //   active: onClick () {
    //     if (this.active_block) {
    //       return this.active_block
    //     } else {
    //       return this.default
    //     }
    //   }
    },
    methods: {
      activate: function (layer) {
        console.log('activate ' + layer)
        this.onClick(layer)
      }
    }
  }
</script>

<style scoped lang="sass?outputStyle=expanded">

  $menu-background-colour: transparent;
  $menu-colour: #333;

  .menu {

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

  li a, .dropbtn {
      display: inline-block;
      color: $menu-colour;
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
  }

  li a:hover, .dropdown:hover .dropbtn {
      font-weight: bold;
  }

  li.dropdown {
      display: inline-block;
  }

  .dropdown-content {
      display: none;
      position: absolute;
      background-color: #f9f9f9;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
  }

  .dropdown-content a {
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
      text-align: left;
  }

  .dropdown-content a:hover {background-color: #f1f1f1}

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
    color: black;
  }
  a.inactive {
    font-weight: normal;
    color: grey;
  }

</style>