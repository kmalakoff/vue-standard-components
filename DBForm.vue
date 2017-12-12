<!-- src/components/Form.vue -->

<template lang='pug'>
  div.table-form
    h1 Table: {{table}}
    hr
    ul
      li(v-for="field in DBfields")
        b {{label(field)}}: 
        DBFormElement(:field="field")
    hr
    button(@click.prevent="loadTest()") Load Test Form
    hr
    b DB: {{DBfields}}
</template>

<script>
  import axios from 'axios'
  import config from '@/config.js'

  import DBFormElement from './DBFormElement'

  export default {

    data () {
      return {
        url: config.dbUrl,
        DBfields: []
      }
    },
    components: {
      DBFormElement
    },
    props: {
      table: {
        type: String
      }
    },
    computed: {
    },
    methods: {
      loadTest () {
        this.DBfields = [
          {prompt: 'name', type: 'varchar'},
          {name: 'email', type: 'varchar', format: '.+@.+'},
          {prompt: 'B/date', name: 'birthdate', type: 'date'},
          {name: 'gender', type: "enum('M','F')"},
          {name: 'height', type: 'decimal'},
          {name: 'kids', type: 'int'},
          {name: 'mother', type: 'int', reference: 'person'}
        ]
      },
      loadTable () {
        var DBfieldUrl = this.url

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
          _this.DBFields = []
        })
      },

      validate (evt) {
        console.log('validate ' + JSON.stringify(evt.target))
      },
      label: function (field) {
        if (!field) {
          return null
        } else if (field.prompt) {
          return field.prompt
        } else { return field.name }
      },
      type: function (field) {
        if (!field) {
          return null
        } else { return field.type }
      },
      form_element: function (field) {
        if (!field) {
          return null
        } else if (field.type.match(/^int/i)) {
          return
        }
      }

    }

  }
</script>
