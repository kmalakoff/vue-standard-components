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
    div(v-if='debug')
      p DBFields: {{DBfields}}
      hr
    table.table.form-table
      tr(v-if='heading')
        td.heading(colspan=3)
          h2 {{heading}}:
      tr(v-for="field in fields" v-show="field.type!=='hidden'")
        td(v-if='options.confirmFields')
          b-form-checkbox(:form="form" type='checkbox' :name='field.name' @change.native='confirm')
        td.prompt-column(v-if='prompt')
          b {{label(field)}}:
        td.data-column
          DBFormElement(:form="form" :field="field" :options='options' :vModel='vModel(field)' :addLinks="addLinks" :placeholder="label(field)" :access='myAccess' :record='thisRecord' :debug='debug')
        td.extra-column(v-if="myAccess === 'edit'")
          span &nbsp;
          a(href='/' onclick='return false' data-toggle='tooltip' :title="JSON.stringify(form)")
            icon(name='question-circle' color='black' scale='2')
          b &nbsp;
      tr(v-for="r in include.visible")
        td.prompt-column(v-if='prompt')
          b {{label(r)}}:
        td.data-column
          DBFormElement(:form="form" :field="r" :options='options' :vModel='vModel(r)' :addLinks="addLinks" :placeholder="label(r)" :access='myAccess' :record='thisRecord' :debug='debug')
    span(v-for='r in include.hidden')
      DBFormElement(:form="form" :field="r" :vModel='vModel(r)' :addLinks="addLinks" :placeholder="label(r)")

    hr
    button.btn(v-if="onSave" @click.prevent="onSave(form)" :class='options.submitButtonClass') {{submitButton}}
    span &nbsp; &nbsp;
    button.btn.btn-danger(v-if="onCancel" @click.prevent="onCancel") {{cancelButton}}
    div(v-if='debug || 1')
      hr
      b Form Input: {{myAccess}} : {{form}}
</template>

<script>
import axios from 'axios'
import _ from 'lodash'

import DBFormElement from './DBFormElement'
import config from '@/config.js'

export default {
  data () {
    return {
      url: config.apiUrl,
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
      type: Object,
      default () { return {} }
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
    },
    access: {
      type: String
    },
    debug: {
      type: Boolean,
      default: false
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

    if (this.options.confirmFields) {
      this.$set(this.form, 'confirmed', {})
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
        var keys = Object.keys(this.thisRecord)
        for (var i = keys.length; i < keys.length; i++) {
          f.push({name: keys[i]})
        }
      }

      if (this.thisRecord) {
        for (var j = 0; j < f.length; j++) {
          if (this.thisRecord[f[j].name]) {
            console.log('set ' + f[j].name)
            if (f[j].type === 'checkbox' || f[j].type === 'boolean') {
              if (typeof f[j].default === 'undefined') {
                this.$set(this.form, f[j].name, false)
              } else {
                this.$set(this.form, f[j].name, this.thisRecord[f[j].default])
              }
            } else if (f[j].type === 'date') {
              var defaultDate = this.thisRecord[f[j].name] || f[j].default || ''
              this.$set(this.form, f[j].name, defaultDate.substring(0, 10))
            } else {
              var defaultTo = this.thisRecord[f[j].name] || f[j].default || null
              this.$set(this.form, f[j].name, defaultTo)
            }
          }
        }
      }
      console.log('initiate form: ' + JSON.stringify(this.form))
      return f
    },
    myAccess: function () {
      if (this.access) {
        return this.access
      } else if (this.options.access) {
        return this.options.access
      } else {
        return 'read'
      }
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
      } else { return null }
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
    },
    submitButton: function () {
      if (this.options.submitButton) {
        return this.options.submitButton
      } else {
        return 'Save'
      }
    },
    prompt: function () {
      if (this.options.prompt) {
        return true
      } else {
        return false
      }
    },
    cancelButton: function () {
      return this.options.cancelButton || 'Cancel'
    },
    onCancel: function () {
      return this.options.onCancel || null
    }
  },
  methods: {
    label (field) {
      // console.log('load label for ' + JSON.stringify(field))
      if (!field) {
        return ''
      } else if (field.prompt) {
        return field.prompt
      } else if (field.name) {
        return field.name
      } else {
        // console.log('no label supplied for ' + JSON.stringify(field))
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
      var _this = this
      console.log('use axios to load table for DBform')
      axios.post(this.url, { table: this.table })
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
        return null
      } else { return true }
    },
    vModel: function (field) {
      var label = this.label(field)
      var vModel = field.name || label
      return vModel
    },
    confirm (evt) {
      console.log('confirm...')
      if (evt.target.type === 'checkbox') {
        if (evt.target.checked) {
          this.$set(this.form.confirmed, evt.target.name, true)
        } else {
          this.$set(this.form.confirmed, evt.target.name, false)
        }
      }
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
