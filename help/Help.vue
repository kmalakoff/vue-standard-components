<template lang='pug'>
  div.container
    h2 Developer Help Page
    p The following pages are set up to developers using the standard Vue components
    hr

    div.flex-container
      div.flex-item
        button.flex-content.btn.btn-primary(v-on:click="show=''")
          icon(name='home')
      div.flex-item(v-for="test in tests")
        button.flex-content.btn.btn-primary(v-on:click='show=test') {{test}}
    hr
    h4 {{show}}
    hr
    TestOCR(v-if="show==='OCR'")
    TestForm(v-else-if="show==='Form'")
    TestModalForm(v-else-if="show==='ModalForm'")
    h4 Return:
    p {{returnval}}
</template>

<script>
import TestOCR from './TestOCR'
import TestForm from './TestForm'
import TestModalForm from './TestModalForm'

export default {
  props: {
  },
  data () {
    return {
      show: '',
      tests: ['Form', 'ModalForm', 'OCR'],
      returnval: ''
    }
  },
  components: {
    TestOCR,
    TestForm,
    TestModalForm
  },
  methods: {
  }
}
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: row;
}
.flex-item {
  width: 10%;
}
.flex-content {
  width: 80%;
}
</style>
