<template lang='pug'>
  div.container
    h3 Test
    hr
    DBForm(table="vaccine")
</template>

<script>

import DBForm from './Standard/DBForm'

export default {
  name: 'test',
  components: {
    DBForm
  },
  data () {
    return {
      msg: 'Welcome to My Vue.js App'
    }
  }
}
</script>
