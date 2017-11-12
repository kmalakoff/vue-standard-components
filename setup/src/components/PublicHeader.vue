<template lang='pug'>
  div.publicHeader

    h2 Public Header (Default)
      div.navbar-right
        button.btn.btn-default
          router-link(:to="{name: 'Login'}") Log In 
</template>


<script>
export default {
  // template: require('./main.pug'),
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .publicHeader {
    padding: 10px 30px;
    background-color: #ccc;

    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
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
