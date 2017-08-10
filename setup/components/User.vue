<template lang='pug'>
  div.user
    h1 Name: {{ name }}
    b {{ msg }}
    h3 {{ alt_msg }}

    div(v-if='name')
      button(v-on:click="name = 'John'") new User
    div(v-if="!name")
      input(placeholder='-- Search for Users --')
      button.btn.btn-primary(v-on:click="name = 'Fred'") Search
</template>

<script>
export default {
  name: 'user',
  data () {
    return {
      msg: 'User App',
      alt_msg: 'Another'
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
