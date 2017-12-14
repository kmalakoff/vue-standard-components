<!-- src/components/Form.vue -->

<template lang='pug'>
  div.table-form.container
    h1 {{table}} : {{model}}
    hr
    table.table
      tr(v-for="field in DBfields")
        td(style='width: 10%')
          b {{label(field)}}:
        td(style='width: 80%')
          DBFormElement(:form="form" :field="field" :vModel='vModel(field)' :addLinks="addLinks" :placeholder="label(field)")
        td(style='width:10%')
          b &nbsp;
    hr
    button(v-if="DBfields.length === 0" @click.prevent="loadTest()") Load Test Form
    div(v-else)
      b Form Data: {{form}}
</template>

<script>
  import axios from 'axios'
  import config from '@/config.js'

  import DBFormElement from './DBFormElement'

  export default {

    data () {
      return {
        url: config.dbUrl,
        DBfields: [],
        form: {}
      }
    },
    components: {
      DBFormElement
    },
    props: {
      table: {
        type: String
      },
      model: {
        type: String
      },
      addLinks: {
        type: Object
      }
    },
    computed: {
    },
    methods: {
      label (field) {
        if (!field) {
          return null
        } else if (field.prompt) {
          return field.prompt
        } else { return field.name }
      },
      loadTest () {
        this.DBfields = [
          {prompt: 'name', type: 'varchar', default: 'Joe'},
          {name: 'email', type: 'varchar', format: '.+@.+'},
          {prompt: 'B/date', name: 'birthdate', type: 'date', default: '2017-09-05'},
          {name: 'gender', type: "enum('M','F')", default: 'M'},
          {name: 'height', type: 'decimal'},
          {name: 'kids', type: 'int', default: 5},
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
      },
      vModel: function (field) {
        console.log('parse model from ' + JSON.stringify(this.field))
        if (!field) {
          return null
        } else if (field.name) {
          return field.name
        } else if (field.prompt) {
          return field.prompt
        } else { return null }
      }
    }

  }
</script>
