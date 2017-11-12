<template lang='pug'>
  div.page
    div.header
      PublicHeader
    div.body
      div.subheader
        CustomMenu(:links='links' type='url')
      div.mainBody
        Block(content="main block content...")
    div.footer
      PublicFooter

</template>

<script>
import config from './../config.js'
import PublicHeader from './PublicHeader'
import PublicFooter from './PublicFooter'
import CustomMenu from './Standard/Menu'
import Block from './Standard/Block'

var links = config.complexLinks || ['Main']

export default {
  name: 'hello',
  components: {
    PublicHeader,
    CustomMenu,
    Block,
    PublicFooter
  },
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

.page {
  /*margin-top: -20px;*/
  height: 100%;
  width: 100%;
}
.body {
  min-height: calc(100vh - 150px);
}
.header {
  height: 80px;
  background-color: #ccc;
}
.footer {
  height: 70px;
  /*padding: 10px;*/
  background-color: #ccc;
}
.mainBody {
  min-height: 100px;
  height: 100%;
}

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
