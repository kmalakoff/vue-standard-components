<!-- src/components/Form.vue -->

<template lang='pug'>
  div.table-form
    h1 Table: {{table}}
    hr
    ul
      li(v-for="field in DBfields")
        b {{field.name}} ( {{field.type}} )

    button(v-if="type='append'") {{prompt}} 
    hr
    button(@click.prevent="loadTable") Load Table
    b DB: {{DBfields}}
</template>

<script>
  import axios from 'axios'

  export default {

    data () {
      return {
        DBfields: []
      }
    },

    props: {
      table: {
        type: String
      },
      prompt: {
        type: String
      },
      type: {
        type: String
      }
    },

    methods: {
      loadTable () {
        var DBfieldUrl = 'http://localhost:1234/Record_API/fields'

        var _this = this
        axios.post(DBfieldUrl, { table: this.table })
        .then(function (result) {
          console.log('R: ' + JSON.stringify(result))
          _this.DBfields = result.data
        })
        .catch(function (err) {
          if (err) {
            console.log('Err: ' + err)
          }
          this.DBFields = []
        })
      },

      validate (evt) {
        console.log('validate ' + JSON.stringify(evt.target))
      }
    }

  }
</script>
