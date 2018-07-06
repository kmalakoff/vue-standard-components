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
    b R0: {{record}}
    hr
    table.table.form-table
      tr
        td.heading(colspan=3)
          h2 {{heading}}:
      tr(v-for="field in fields")
        td.prompt-column
          b {{label(field)}}:
          DBFormElement(:form='form' :field='idfield' vModel="id" :record='thisRecord')
        td.data-column
          DBFormElement(:form="form" :field="field" :options='options' :vModel='vModel(field)' :addLinks="addLinks" :placeholder="label(field)" :access='access' :record='thisRecord')
        td.extra-column(v-if="access === 'edit'")
          span &nbsp;
          a(href='/' onclick='return false' data-toggle='tooltip' :title="JSON.stringify(form)") 
            icon(name='question-circle' color='black' scale='2')
          b &nbsp; 
      tr(v-for="r in include.visible")
        td.prompt-column
          b {{label(r)}}:
        td.data-column
          DBFormElement(:form="form" :field="r" :options='options' :vModel='vModel(r)' :addLinks="addLinks" :placeholder="label(r)" :access='access' :record='thisRecord')
    span(v-for='r in include.hidden')
      DBFormElement(:form="form" :field="r" :vModel='vModel(r)' :addLinks="addLinks" :placeholder="label(r)")

    hr
    button.btn.btn-primary(v-if="onSave && access === 'edit'" @click.prevent="onSave(form)") Save
    hr
    b Form Input: {{form}}"
</template>

<script>
  import axios from 'axios'
  import _ from 'lodash'

  import DBFormElement from './DBFormElement'
  import config from '@/config.js'

  export default {

    data () {
      return {
        url: config.dbUrl,
        DBfields: [],
        form: {},
        idfield: { name: 'id', type: 'fixed' }
      }
    },
    components: {
      DBFormElement
    },
    props: {
      options: {
        type: Object
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
      record: {
        type: Object
      }
    },
    created: function () {
      var DBfields = []

      if (this.table) {
        // load fields dynamically from table..
        // Construction
        if (config.forms && config.forms[this.table]) {
          DBfields = config.forms[this.table]
        } else {
          console.log('Error retrieving configuration for ' + this.table)
          console.log('(Include form hash for ' + this.table + ' in /src/config.js file)')
        }
      } else if (this.fields) {
        DBfields = this.fields
      } else {
        console.log('Error retrieving configuration (require fields or table spec)')
        console.log(JSON.stringify(this.options))
      }

      for (var i = 0; i < DBfields.length; i++) {
        this.$set(this.DBfields, i, DBfields[i])
      }
    },
    computed: {
      table: function () {
        return this.options.table
      },
      fields: function () {
        var f = []
        if (this.options.fields) {
          console.log('got fields from options')
          f = this.options.fields
        } else if (this.DBfields.length) {
          console.log('got fields from config')
          f = this.DBfields
        } else if (this.thisRecord) {
          console.log('got fields from keys')
          f = Object.keys(this.thisRecord)
        }
        console.log('get fields: ' + JSON.stringify(f))
        return f
      },
      access: function () {
        return this.options.access
      },
      thisRecord: function () {
        if (this.record) {
          // return null
          return this.record
        } else {
          return this.options.record || {}
        }
      },
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
            var name = this.append[i].name
            this.$set(this.form, name, this.append[i].default)
            if (this.append[i].type === 'hidden') {
              hidden.push(this.append[i])
            } else {
              visible.push(this.append[i])
            }
          }
        }
        return {visible: visible, hidden: hidden}
      },
      default: function (key) {
        return this.form[key] || ''
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
          _this.DBfields = []
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
