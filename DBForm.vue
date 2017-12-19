<!-- src/components/Form.vue -->

<template lang='pug'>
  div.table-form
    <!-- b {{DBfields}} -->
    hr
    table.table.form-table
      tr
        td.heading(colspan=3)
          h2 {{heading}}: 
      tr(v-for="field in DBfields")
        td.prompt-column
          b {{label(field)}}: &nbsp;
        td.data-column
          DBFormElement(:form="form" :field="field" :vModel='vModel(field)' :addLinks="addLinks" :placeholder="label(field)")
        td.extra-column
          span &nbsp;
          a(href='/' onclick='return false' data-toggle='tooltip' :title="JSON.stringify(form)") 
            icon(name='question-circle' color='black' scale='2')
          b &nbsp;  
    hr
    button(v-if="onSave" @click.prevent="onSave(form)") Save
    br
    button(v-if="DBfields.length === 0" @click.prevent="loadTest()") Load Test Form
    hr
    b {{form}}
</template>

<script>
  import axios from 'axios'
  import config from '@/config.js'
  import _ from 'lodash'

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
      },
      fieldData: {
        type: Array
      },
      onSave: {
        type: Function
      }
    },
    created: function () {
      var DBfields = []
      if (this.table === 'immunize') {
        var vaccine = 'tbd'
        DBfields = [
          {name: 'patient', type: 'reference', reference: 'patient'},
          {name: 'vaccine', type: 'reference', reference: 'vaccine', default: vaccine},
          {name: 'vaccinator', type: 'reference', reference: 'staff'},
          {name: 'route', type: "enum('IM - Intramuscular','SC - Subcutaneous','ID - Intradermal','IN - Intranasal','PO - Oral')"},
          {name: 'site', type: "enum('LA - Left Arm','RA - Right Arm','LT - Left Thigh','RT - Right Thigh')"},
          {name: 'applied', type: 'date', default: 'now()'},
          {name: 'expiry', type: 'date'},
          {name: 'lot', type: 'string'},
          {name: 'reactionLevel', type: "enum('None','Mild','Strong')"},
          {name: 'notes', type: 'string'}
        ]
      } else {
        DBfields = [
          {prompt: 'name', type: 'varchar', default: 'Joe'},
          {name: 'email', type: 'varchar', format: '.+@.+'},
          {prompt: 'Birthdate', name: 'birthdate', type: 'date', default: '2017-09-05'},
          {name: 'gender', type: "enum('M','F')", default: 'M'},
          {name: 'height', type: 'decimal'},
          {name: 'kids', type: 'int', default: 5},
          {name: 'mother', type: 'int', reference: 'person'}
        ]
      }

      for (var i = 0; i < DBfields.length; i++) {
        this.$set(this.DBfields, i, DBfields[i])
      }
    },
    computed: {
      heading: function () {
        if (this.table) {
          var camel = _.capitalize(this.table)
          console.log('camel case = ' + camel)
          return camel
        } else { return 'Form' }
      }
    },
    methods: {
      label (field) {
        console.log('load label for ' + JSON.stringify(field))
        if (!field) {
          return ''
        } else if (field.prompt) {
          return 'form.' + field.prompt
        } else if (field.name) {
          return 'form.' + field.name
        } else {
          console.log('no label supplied for ' + JSON.stringify(field))
          return ''
        }
      },
      loadTest () {
        console.log('load test data...')
        var DBfields = [
            {prompt: 'name', type: 'varchar', default: 'Joe'},
            {name: 'email', type: 'varchar', format: '.+@.+'},
            {prompt: 'B/date', name: 'birthdate', type: 'date', default: '2017-09-05'},
            {name: 'gender', type: "enum('M','F')", default: 'M'},
            {name: 'height', type: 'decimal'},
            {name: 'kids', type: 'int', default: 5},
            {name: 'mother', type: 'int', reference: 'person'}
        ]

        console.log('load ' + JSON.stringify(DBfields))
        for (var i = 0; i < DBfields.length; i++) {
          this.$set(this.DBfields, i, DBfields[i])
        }
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
        console.log('parse model from ' + JSON.stringify(field))
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

<style scoped>
  .table-form {
    width: 95%;
  }

  .form-table {
    bacground-color: red;
  }

  table tr td.prompt-column {
    text-align: right;
    width: 10%;
  }
  table tr td.heading {
    background-color: #ccc;
    text-align: center;
  }
  table tr td.data-column {
    width: 80%;
  }
  table tr td.extra-column {
    width: 10%;
  }
</style>
