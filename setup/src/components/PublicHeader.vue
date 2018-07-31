<template lang='pug'>
  div.publicHeader
    span.navbar-left(v-if='left') {{left}}
    span.navbar-centre(v-if='centre') {{centre}}
    span.navbar-right
      span(v-if='right' v-html="right")
      span &nbsp; &nbsp;
      button.btn.btn-default(v-if='login')
        router-link(:to="{name: 'Login'}") Log In
</template>

<script>
export default {
  props: {
    left: {
      type: String
    },
    right: {
      type: String
    },
    centre: {
      type: String,
      default: 'c'
    },
    login: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
