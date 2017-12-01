<!-- src/components/Standard/Menu.vue -->

<template lang='pug'>
  div.menu
    div.navbar-center
      ul
        li.dropdown(v-for="link in links")         
          span(v-if="link.constructor === Object")
            span(v-for="url,label in link")
              span(v-if="url.constructor === Array")
                <!-- Multi-level menus only ...  -->
                a.dropbtn(href="javascript:void(0)") {{label}} 
                div.dropdown-content
                  span(v-for="urlN,index in url")
                    span(v-if="urlN.constructor === Object")
                      span(v-for="subUrl,subLabel in urlN")
                          a(:href="subUrl") {{subLabel}}
                    span(v-else)
                      router-link(:to="{name: urlN}") {{urlN}} 
              span(v-else)
                <!-- Standard array of key:value pairs (name: url)  -->
                a(:href="url" target="_blank") {{label}}
          span(v-else)
            <!-- Internal links do not need keys -->
            router-link(:to="{name: link}") {{link}} 

</template>

<script>
  export default {

    data () {
      return {
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


</style>