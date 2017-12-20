<!-- src/components/Form.vue -->
<!--
Usage: 
  DBForm(table='widget' :onSave='save' :append='append'))

  Options:
    append: array of addiitional field hashes... (each element MUST include keys; 'name' and 'type')
        eg (append = [ { name: 'user', type: 'string', default: 'Joe'}, { name: 'SIN', type: 'hidden', default: '123456789'}])
-->

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
      tr(v-for="r in include.visible")
        td.prompt-column
          b {{label(r)}}: &nbsp;
        td.data-column
          DBFormElement(:form="form" :field="r" :vModel='vModel(r)' :addLinks="addLinks" :placeholder="label(r)")
    span(v-for='r in include.hidden')
      DBFormElement(:form="form" :field="r" :vModel='vModel(r)' :addLinks="addLinks" :placeholder="label(r)")

      hr
      button.btn.btn-primary(v-if="onSave" @click.prevent="onSave(form)") Save
      hr
      b Form: {{form}}"
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
      },
      append: {
        type: Array
      },
      fields: {
        type: Array
      }
    },
    created: function () {
      var DBfields = []

      if (this.table === 'immunize') {
        // load fields dynamically from table..
        // Construction
        DBfields = [
          // {name: 'patient', type: 'reference', reference: 'patient'},
          // {name: 'vaccine', type: 'reference', reference: 'vaccine', default: vaccine},
          // {name: 'vaccinator', type: 'reference', reference: 'staff'},
          {name: 'route', type: "enum('IM - Intramuscular','SC - Subcutaneous','ID - Intradermal','IN - Intranasal','PO - Oral')"},
          {name: 'site', type: "enum('LA - Left Arm','RA - Right Arm','LT - Left Thigh','RT - Right Thigh')"},
          {name: 'applied', type: 'date', default: 'now()'},
          {name: 'expiry', type: 'date'},
          {name: 'lot', type: 'string'},
          {name: 'reactionLevel', type: "enum('None','Mild','Strong')"},
          {name: 'notes', type: 'string'}
        ]
      } else if (this.fields) {
        DBfields = this.fields
      } else {
        // Test Data ...
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
      },
      include: function () {
        var visible = []
        var hidden = []
        if (this.append) {
          for (var i = 0; i < this.append.length; i++) {
            if (this.append[i].type === 'hidden') {
              hidden.push(this.append[i])
            } else {
              visible.push(this.append[i])
            }
          }
        }
        return {visible: visible, hidden: hidden}
      }
    },
    methods: {
      label (field) {
        console.log('load label for ' + JSON.stringify(field))
        if (!field) {
          return ''
        } else if (field.prompt) {
          return field.prompt
        } else if (field.name) {
          return field.name
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
        var label = this.label(field)
        var vModel = label
        return vModel
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

  table tr td {
    padding: 5px;
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
