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
      p Fields: {{fields}}
      hr
    table.table.form-table
      tr(v-if='heading')
        td.heading(colspan=3)
          h2 {{heading}}
      tr(v-for="field in fields" v-show="field.type!=='hidden'")
        td(v-if='options.confirmFields')
          b-form-checkbox(:form="form" type='checkbox' :name='field.name' @change.native='confirm')
        td.prompt-column(v-if="prompt || myAccess==='read'")
          b(v-bind:class="[{mandatoryPrompt: field.mandatory}]") {{label(field)}}:
        td.data-column
          DBFormElement(:form="form" :field="field" :options='options' :vModel='vModel(field)' :addLinks="addLinks" :placeholder="label(field)" :access='myAccess' :record='thisRecord' :debug='debug')
        td.extra-column(v-if="0 && myAccess === 'edit'")
          span &nbsp;
          a(href='/' onclick='return false' data-toggle='tooltip' :title="JSON.stringify(form)")
            icon(name='question-circle' color='black' scale='2')
          b &nbsp;
      tr(v-for="r in include.visible")
        td.prompt-column(v-if="prompt || myAccess==='read'")
          b {{label(r)}}:
        td.data-column
          DBFormElement(:form="form" :field="r" :options='options' :vModel='vModel(r)' :addLinks="addLinks" :placeholder="label(r)" :access='myAccess' :record='thisRecord' :debug='debug')
    span(v-for='r in include.hidden')
      DBFormElement(:form="form" :field="r" :vModel='vModel(r)' :addLinks="addLinks" :placeholder="label(r)")
    hr
    button.btn.btn-primary.btn-lg(v-if="onSave" @click.prevent="onSave(form)" :class='options.submitButtonClass' :disabled='disabled(form)') {{submitButton}}
    span &nbsp; &nbsp;
    button.btn.btn-danger.btn-lg(v-if="onCancel" @click.prevent="onCancel()") {{cancelButton}}
    br
    p.mandatoryPrompt(v-if='error') {{error}}
    div(v-if='debug')
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
      url: config.apiURL,
      DBfields: [],
      form: {},
      idfield: { name: 'id', type: 'fixed' },
      error: ''
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

    console.log('confirm field list...')
    if (this.table) {
      // load fields dynamically from table..
      // Construction
      console.log('.. from table')
      if (config.forms && config.forms[this.table]) {
        DBfields = config.forms[this.table]
      } else {
        console.log('Error retrieving configuration for ' + this.table)
        console.log('(Include form hash for ' + this.table + ' in /src/config.js file)')
      }
    } else if (this.fields && this.fields.length) {
      console.log('.. from specified list')
      DBfields = this.fields
    } else if (this.thisRecord) {
      var f1 = []
      console.log('load record: ' + JSON.stringify(this.thisRecord))
      // console.log('got fields from keys')
      var keys = Object.keys(this.thisRecord)
      for (var i = 0; i < keys.length; i++) {
        f1.push({name: keys[i], type: 'text'})
      }
      DBfields = f1
      console.log('initiate fields: ' + JSON.stringify(keys))
    } else {
      console.log('Error retrieving configuration (require fields or table spec)')
      console.log(JSON.stringify(this.options))
    }

    if (DBfields && DBfields.length && this.thisRecord) {
      var f = DBfields
      for (var j = 0; j < f.length; j++) {
        if (this.thisRecord[f[j].name]) {
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
      console.log('initiate form: ' + JSON.stringify(this.form))
    }

    for (var k = 0; k < DBfields.length; k++) {
      this.$set(this.DBfields, k, DBfields[k])
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
        console.log(JSON.stringify(this.options.fields))
        f = this.options.fields
      } else if (this.DBfields.length) {
        console.log('got fields from config')
        f = this.DBfields
      }
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
      } else if (this.options.formPrompt) {
        return this.options.formPrompt
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
    defaultDisabledMessage: function () {
      if (this.options.disabledSubmitMessage) {
        return this.disabledSubmitMessage
      } else if (this.options.confirmFields) {
        return 'all mandatory confirmation fields must be selected'
      } else if (this.options.disableSubmit) {
        return 'input requirements not met'
      }
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
    },
    disabled: function (form) {
      if (this.options.disableSubmit) {
        console.log('disable submit if applicable: ' + JSON.stringify(form))
        var failed = false
        var checked = 0
        for (var i = 0; i < this.fields.length; i++) {
          var verify = ''

          if (this.options.confirmFields) {
            verify = form.confirmed[this.fields[i].name]
          } else if (this.options.disableSubmit) {
            verify = form[this.fields[i].name]
          }

          if (this.fields[i].mandatory && !verify) {
            console.log('failed on ' + this.fields[i].name)
            failed = true
          } else if (this.fields[i].mandatory) {
            console.log(this.fields[i].mandatory + ' passed ' + this.fields[i].name + ' = ' + verify)
            checked++
          }
        }

        console.log(failed + ' failed; checked ' + checked)
        var validated = !failed && checked

        if (!validated) {
          this.error = this.defaultDisabledMessage
        } else {
          this.error = ''
        }
        return !validated
      }
    },
    onCancel: function () {
      console.log('cancel form')
      if (this.options.cancelForm) {
        this.options.cancelForm()
      } else if (this.options.onCancel) {
        this.options.onCancel()
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
    width: 30%;
    padding: 10px;
  }
  table tr td.heading {
    // background-color: #ccc;
    text-align: center;
  }
  table tr td.data-column {
    width: 80%;
  }
  table tr td.extra-column {
    width: 10%;
  }

  .mandatoryPrompt {
    color: red;
  }

</style>
