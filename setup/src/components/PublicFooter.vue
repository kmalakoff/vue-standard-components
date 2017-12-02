<template lang='pug'>
  div.publicFooter
    span.navbar-left(v-html="left")
    span.navbar-centre(v-html="centre")
    span.navbar-right(v-html="right")
</template>


<script>
export default {
  // template: require('./main.pug'),

  props: {
    left: {
      type: String
    },
    right: {
      type: String
    },
    centre: {
      type: String
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    /*margin: 0 10px;*/
  }

</style>
