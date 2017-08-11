<template lang='pug'>
  div.info-header
    div.col-md-6
      img(src="./../assets/logo.png")
    div.col-md-6
      User.navbar-right(role='user' :user="user")
</template>

<script>
  import User from '@/components/User'
  
  export default {
    components: {
      User
    },
    props: {
      user: {
        type: Object,
        default () { return {} }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.info-header {
  height: 100px;
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
