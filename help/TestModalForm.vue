<template lang='pug'>
  div
    div(v-for='test in tests')
      h2 Test: {{test}}
      h4 Options:
      table
        tr(v-for='opt,key in test.options')
          td b {{key}}
          td {{JSON.stringify(opt)}}
      hr
</template>
<script>

export default {
  components: {
  },
  data () {
    return {
      testFields: [
        {name: 'username', type: 'text'},
        {name: 'birthdate', type: 'date', prompt: 'Date of Birth'},
        {name: 'gender', type: "enum('M', 'F')"}
      ],
      testRecord: {username: 'Elvis', gender: 'M'},
      tests: {
        confirmation: {
          record: this.testRecord,
          options: {
            // modalID: 'app-modal',
            // show: false,
            // access: 'edit',
            header: 'my Custom Header',
            prompt: 'Test input confirmation:',
            onSave: this.doThis,
            fields: this.testFields,
            openButton: 'confirmation test'
          }
        }
      }
    }
  }
}
</script>
