<!-- src/components/Form.vue -->
<!--
Usage:
  DBForm(table='widget' :onSave='save' :append='append'))

  Options:
    append: array of addiitional field hashes... (each element MUST include keys; 'name' and 'type')
        eg (append = [ { name: 'user', type: 'string', default: 'Joe'}, { name: 'SIN', type: 'hidden', default: '123456789'}])

*** Form Confirmation / Acceptance Options ***
Add optional accept form prompt:
(includes checkbox for user to 'Accept form')
(with disableSubmit set, the submit button will only be active when that accept form has been checked)

Input options:
  disableSubmit (disable submit button until fields are confirmed and/or form accepted
  disabledSubmitMessage (optional error message displayed while submit button is disabled)
  acceptFormPrompt (prompt for acceptance prior to enabling submit button)
  confirmFields (flag to require user to select fields for confirmation before field can be submitted)

Relevant methods: disabled, defaultDisabledMessage

options: {
  disableSubmit: true,
  acceptFormPrompt: 'I agree that the fields above are filled in correctly'
}
-->

<template lang='pug'>
  div.table-form
    div(v-if='debug')
      p Fields: {{fields}}
      p Record {{record}}
      p Options: {{JSON.stringify(options.onCancel)}}
      p Error: {{JSON.stringify(remoteErrors)}}
      hr
    table.table
      tr.row-heading(v-if='heading')
        td.heading(colspan=3)
          h2 {{heading}}
      tr(v-for="field in fields" v-show="field.type!=='hidden'")
        td(v-if='options.confirmFields')
          b-form-checkbox(:form="form" type='checkbox' :name='field.name' @change.native='confirm')
        td.prompt-column(v-if="promptPosition==='left'")
          b(v-bind:class="[{mandatoryPrompt: field.mandatory}]") {{label(field)}}:
        td.data-column
          DBFormElement(:form="form" :field="field" :options='options' :vModel='vModel(field)' :addLinks="addLinks" :placeholder="label(field)" :access='myAccess' :record='thisRecord' :remoteError='remoteErrors[field.name]' :debug='debug')
        td.extra-column(v-if="0 && myAccess === 'edit'")
          span &nbsp;
          a(href='/' onclick='return false' data-toggle='tooltip' :title="JSON.stringify(form)")
            icon(name='question-circle' color='black' scale='2')
          b &nbsp;
      tr(v-for="r in include.visible")
        td.prompt-column(v-if="prompt || myAccess==='read'")
          b {{label(r)}}:
        td.data-column
          DBFormElement(:form="form" :field="r" :options='options' :vModel='vModel(r)' :addLinks="addLinks" :placeholder="label(r)" :access='myAccess' :record='thisRecord' :remoteError='remoteErrors[field.name]' :debug='debug')
      tr(v-if='acceptFormPrompt && validated(form)')
        td(colspan=4)
          hr
          <!-- icon(v-if='form.accepted' name='check' color='green') -->
          b-form-checkbox.inline(:form="form" type='checkbox' name='accepted' v-model='form.accepted' v-on:click='acceptForm(form)')
          b(v-bind:class="[{errorMessage: !form.accepted}]") &nbsp; &nbsp; {{acceptFormPrompt}}
    span(v-for='r in include.hidden')
      DBFormElement(:form="form" :field="r" :vModel='vModel(r)' :addLinks="addLinks" :placeholder="label(r)" :remoteError='remoteErrors[field.name]')
    hr
    button.btn.btn-primary.btn-lg(v-if="onSave" @click.prevent="onSave(form)" :class='options.submitButtonClass' :disabled='disabled(form)') {{submitButton}}
    span &nbsp; &nbsp;
    button.btn.btn-danger.btn-lg(v-if="onCancel" @click.prevent="onCancel") {{cancelButton}}
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
      form: { accepted: false },
      idfield: { name: 'id', type: 'fixed' },
      resetAccess: '',
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
    // remote Errors is a hash returned remotely indicating erros with fields (eg {'name': 'not unique'})
    remoteErrors: {
      type: Object,
      default () { return {} }
    },
    cancel: {
      type: Function
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
      if (this.remoteErrors) { }
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
      if (this.resetAccess) {
        return this.resetAccess
      } else if (this.access) {
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
    acceptFormPrompt: function () {
      return this.options.acceptFormPrompt
    },
    promptPosition: function () {
      return this.options.promptPosition || 'top'
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
      } else if (this.promptPosition === 'top') {
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
    acceptedForm: function (form) {
      if (this.options.acceptFormPrompt) {
        if (this.form.accepted) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    acceptForm: function (form) {
      this.form.accepted = true
    },
    validated: function (form) {
      var failed = false
      var checked = 0
      var verified = 0
      var hidden = 0
      console.log('fail check #: ' + JSON.stringify(this.fields.length))
      for (var i = 0; i < this.fields.length; i++) {
        var passed = false
        var check = false
        if (this.fields[i].type === 'hidden') {
          hidden++
        } else if (this.options.confirmFields && this.fields[i].mandatory) {
          console.log('check mandatory field: ' + this.fields[i].name)
          passed = form.confirmed[this.fields[i].name]
          check = true
          if (!passed) {
            console.log('failed to confirm ' + this.fields[i].name)
          }
        } else if (this.fields[i].mandatory) {
          passed = form[this.fields[i].name]
          check = true
          if (!passed) {
            console.log(this.fields[i].name + ' is mandatory')
          }
        }
        if (passed) {
          verified++
          checked++
        } else if (check) {
          checked++
          failed = true
        }
      }
      console.log(' failed: ' + failed + ' : verified ' + verified + ' of ' + checked + ' - hidden: ' + hidden)
      var validated = !failed
      return validated
    },
    disabled: function (form) {
      console.log('check disabled status')
      var validated = this.validated(form)
      var accepted = this.acceptedForm(form)
      console.log('disabled = ' + validated + ' + ' + accepted)
      if (!validated) {
        this.error = this.defaultDisabledMessage
      } else {
        if (validated && accepted && this.acceptFormPrompt) {
          console.log('reset access to read...')
          this.resetAccess = 'read'
        } else {
          this.resetAccess = ''
        }
        this.error = ''
      }
      var disabled = !validated || !accepted
      console.log('.. ' + disabled)
      return disabled
    },
    onCancel: function () {
      console.log('cancel form')
      if (this.options.cancelForm) {
        this.options.cancelForm()
      } else if (this.options.onCancel) {
        this.options.onCancel()
      }

      if (this.cancel) {
        // cancel from Modal if applicable...
        this.cancel()
      }
    }
  },
  watch: {
    remoteError: function () {
      var keys = Object.key(this.remoteErrors)
      if (keys && keys.length) {
        this.form.accepted = false
        console.log('turn off accept flag')
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
  }

  table tr td {
    padding: 5px;
  }

  .row-heading {
    float: left;
  }

  table tr td.prompt-column {
    text-align: right;
    width: 30%;
    padding: 10px;
  }
  table tr td.heading {
    text-align: center;
  }
  table tr td.data-column {
    width: 80%;
  }
  table tr td.extra-column {
    width: 10%;
  }

  .inline {
    display: inline-block
  }
</style>
