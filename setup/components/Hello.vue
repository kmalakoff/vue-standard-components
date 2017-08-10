<template lang='pug'>
  div.hello
    h3 Links:
    ul
      li(v-for="link in links")
        router-link(:to="{name: link}") {{link}} 

    a(href='./' target="_blank") New Window

</template>

<script>
import config from './../config.js'
var links = config.links || ['Main']

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to My Vue.js App',
      // ################## Add Link List Below for Testing ######################
      links: links
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
