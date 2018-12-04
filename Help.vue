<template lang='pug'>
  div.container
    h2
      u Help {{show}}
      h4(v-if='show') test: {{show}}
    span(v-if="show==='TestForm'")
      // TestForm()
    span(v-else-if="show==='Modal'")
      // Modal()
    div(v-else)
      div(v-for='test in tests')
        a(v-on:click='showMe(test)')
          button.btn.btn-primary {{test}}
</template>
<script>
import Modal from './Modal'

export default {
  components: {
    Modal
  },
  data () {
    return {
      show: '',
      tests: [
        'Modal'
      ]
    }
  },
  computed: {
    Modal
  },
  methods: {
    showMe (test) {
      console.log('show ' + test)
      this.$set(this, 'test', test)
    }
  },
  props: {
  }
}
</script>

<style>

</style>
