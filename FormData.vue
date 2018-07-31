<template>
<div>
    <!--
        custom html element
        custom atribute formdata is required
     -->
    <dynamic-form :formdata="formdata"></dynamic-form>
</div>
</template>

<script>

import dynamicForm from 'vue-dynamic-forms'

import { createDemo } from './FormData.Immunize.js'

export default {
  name: 'demo',
  components: {
    dynamicForm
  },
  data () {
    return {
      formdata: createDemo()
    }
  }
}
</script>

<style lang="css" scoped>
</style>
