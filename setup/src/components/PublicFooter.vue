<template lang='pug'>
  div.publicFooter
    div.footerContent
      h4 Public Footer (Default)
        div.navbar-right
          b final tag..
</template>


<script>
export default {
  // template: require('./main.pug'),
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .publicFooter {
    padding: 0px;
    background-color: #ccc;
  }

  .footerContent {
    padding: 10px;
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
