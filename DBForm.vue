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
    form
      div(v-if='debug')
        p Fields: {{fields}}
        p Record {{record}}
        p Options: {{JSON.stringify(options.onCancel)}}
        p Error: {{JSON.stringify(remoteErrors)}}
        hr
      h2.DBForm-title(v-if='title') {{title}}
      table.table
        tr.row-heading(v-if='heading')
          td.heading(colspan=3)
            h2.DBForm-heading {{heading}}
        tr(v-for="field in fields" v-show="field.type!=='hidden'")
          td(v-if='options.confirmFields')
            b-form-checkbox(:form="myForm" type='checkbox' :name='field.name' @change.native='confirm')
          td.prompt-column(v-if="promptPosition==='left'")
            b(v-bind:class="[{mandatoryPrompt: field.mandatory}]") {{label(field)}}:
          td.data-column
            DBFormElement(:form="myForm" :field="field" :options='options' :vModel='vModel(field)' :addLinks="addLinks" :placeholder="label(field)" :access='myAccess' :record='thisRecord' :remoteError='remoteErrors[field.name]' :debug='debug')
          td.extra-column(v-if="0 && myAccess === 'edit'")
            span &nbsp;
            a(href='/' onclick='return false' data-toggle='tooltip' :title="JSON.stringify(myForm)")
              icon(name='question-circle' color='black' scale='2')
            b &nbsp;
        tr(v-for="r in include.visible")
          td.prompt-column(v-if="prompt || myAccess==='read'")
            b {{label(r)}}:
          td.data-column
            DBFormElement(:form="myForm" :field="r" :options='options' :vModel='vModel(r)' :addLinks="addLinks" :placeholder="label(r)" :access='myAccess' :record='thisRecord' :remoteError='remoteErrors[field.name]' :debug='debug')
        tr(v-if='acceptFormPrompt')
          td(colspan=4)
            hr
            <!-- icon(v-if='form.accepted' name='check' color='green') -->
            table.accept-block
              tr.accept-block
                td.accept-checkbox
                  b-form-checkbox.inline(:form="myForm" type='checkbox' name='accepted' v-model='myForm.accepted' v-on:click='acceptForm(myForm)')
                td.accept-prompt
                  span {{acceptFormPrompt}}
      span(v-for='r in include.hidden')
        DBFormElement(:form="myForm" :field="r" :vModel='vModel(r)' :addLinks="addLinks" :placeholder="label(r)" :remoteError='remoteErrors[field.name]')
      hr
      button.btn.btn-primary.btn-lg(v-if="onSave" :type='buttonType' @click.prevent="onSave(myForm)" :class='options.submitButtonClass' :disabled='disabled(myForm)') {{submitButton}}
      span &nbsp; &nbsp;
      button.btn.btn-close.btn-lg(v-if="hasCancel" @click.prevent="myCancel") {{cancelButton}}
      br
      p.mandatoryPrompt(v-if='error') {{error}}
      p.mandatoryPrompt(v-if='remoteErrors && remoteErrors.form') {{remoteErrors.form}}
      <!-- p(v-if='(error || (remoteErrors && remoteErrors.form)) && acceptFormPrompt') Note: you may need to toggle 'accept' checkbox to enable editing of previously entered form elements -->
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
      // form: { accepted: false },
      idfield: { name: 'id', type: 'fixed' },
      resetAccess: '',
      error: '',
      myForm: {}
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
    form: {
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
    onCancel: {
      type: Function
    },
    append: {
      type: Array,
      default () { return [] }
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
    },
    included: {
      type: Object,
      default () { return {} }
    }
  },
  created: function () {
    this.initializeRecord()
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
      } else if (this.thisRecord) {
        // Note this is a default but is unsorted ...
        var keys = Object.keys(this.thisRecord)
        f = keys
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
      } else if (this.options.header) {
        return this.options.header
      } else { return null }
    },
    title: function () {
      return this.options.title
    },
    include: function () {
      return this.included
    },
    default: function (key) {
      return this.myForm[key] || ''
    },
    submitButton: function () {
      if (this.options.submitButton) {
        return this.options.submitButton
      } else {
        return 'Save'
      }
    },
    buttonType: function () {
      return this.options.buttonType
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
    },
    hasCancel: function () {
      if (this.options.cancelForm) {
        return true
      } else if (this.onCancel) {
        return true
      } else if (this.options.onCancel) {
        return true
      } else if (this.cancel) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    initializeRecord () {
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
        console.log('load Record: ' + JSON.stringify(this.thisRecord, null, 2))
        // console.log('got fields from keys')
        var keys = Object.keys(this.thisRecord)
        console.log('preset: ' + keys)
        for (var i = 0; i < keys.length; i++) {
          f1.push({name: keys[i], type: 'text'})
        }
        DBfields = f1
        console.log('initiate fields: ' + JSON.stringify(keys))
      } else {
        console.log('Error retrieving configuration (require fields or table spec)')
        console.log(JSON.stringify(this.options))
      }
      this.initializeForm(DBfields)
    },
    initializeForm (DBfields) {
      this.myForm = this.form || {}
      console.log('use Record: ' + JSON.stringify(this.thisRecord))

      if (DBfields && DBfields.length && this.thisRecord) {
        var f = DBfields
        for (var j = 0; j < f.length; j++) {
          if (this.thisRecord[f[j].name]) {
            if (f[j].type === 'checkbox' || f[j].type === 'boolean') {
              if (typeof f[j].default === 'undefined') {
                this.$set(this.myForm, f[j].name, false)
                // this.$set(this, f[j].name, false)
              } else {
                this.$set(this.myForm, f[j].name, this.thisRecord[f[j].default])
                // this.$set(this, f[j].name, this.thisRecord[f[j].default])
              }
            } else if (f[j].type === 'date') {
              var defaultDate = this.thisRecord[f[j].name] || f[j].default || ''
              this.$set(this.myForm, f[j].name, defaultDate.substring(0, 10))
              // this.$set(this, f[j].name, defaultDate.substring(0, 10))
            } else {
              var defaultTo = this.thisRecord[f[j].name] || f[j].default || null
              this.$set(this.myForm, f[j].name, defaultTo)
              this.$set(this, f[j].name, defaultTo)
            }
          }
        }
        console.log('initialized form: ' + JSON.stringify(this.myForm))
        if (this.remoteErrors) { }
      }

      for (var k = 0; k < DBfields.length; k++) {
        this.$set(this.DBfields, k, DBfields[k])
      }

      if (this.options.confirmFields) {
        this.$set(this.myForm, 'confirmed', {})
        console.log('confirm fields...')
      }

      if (this.remoteErrors && this.remoteErrors.form) {
        this.error = this.error || this.remoteErrors.form
      }

      var visible = []
      var hidden = []
      if (this.append) {
        for (var i = 0; i < this.append.length; i++) {
          var name = this.append[i].name
          this.$set(this.myForm, name, this.append[i].default)
          console.log('preset ' + name)
          if (this.append[i].type === 'hidden') {
            hidden.push(this.append[i])
          } else {
            visible.push(this.append[i])
          }
        }
      }
      this.$set(this, 'included', {visible: visible, hidden: hidden})
    },
    label (field) {
      // console.log('load label for ' + JSON.stringify(field))
      if (!field) {
        console.log('no field defined to retrieve label from')
        return ''
      } else if (this.promptPosition === 'top') {
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
      var _this = this
      console.log('use axios to load table for DBform')
      axios.post(this.url, { table: this.table })
        .then(function (result) {
          console.log('R: ' + JSON.stringify(result))
          _this.DBfields = result.data
        })
        .catch(function (err) {
          if (err) {
            console.log('Load Err: ' + err)
          }
          _this.DBfields = []
        })
    },

    validate (evt) {
      console.log('form validate ' + JSON.stringify(evt.target))
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
        if (!this.myForm.confirmed) {
          this.$set(this.myForm, 'confirmed', {})
        }

        if (evt.target.checked) {
          this.$set(this.myForm.confirmed, evt.target.name, true)
        } else {
          this.$set(this.myForm.confirmed, evt.target.name, false)
        }
      }
    },
    acceptedForm: function (myForm) {
      if (this.options.acceptFormPrompt) {
        if (myForm.accepted) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    acceptForm: function (myForm) {
      myForm.accepted = true
    },
    validated: function (form) {
      var failed = false
      var checked = 0
      var verified = 0
      var hidden = 0

      if (!form) { form = {} }

      if (!form.confirmed) {
        form.confirmed = {}
      }

      for (var i = 0; i < this.fields.length; i++) {
        var passed = false
        var check = false
        if (this.fields[i].type === 'hidden') {
          hidden++
        } else if (this.options.confirmFields && this.fields[i].mandatory) {
          passed = form.confirmed[this.fields[i].name]
          console.log('check mandatory field: ' + this.fields[i].name + ': ' + passed)
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
        if (this.fields[i].type === 'email') {
          console.log('email test for ' + this.fields[i].value + ' or ' + form[this.fields[i].name])
          if (form[this.fields[i].name] && form[this.fields[i].name].match(/[a-zA-Z0-9.+-]+@[a-zA-Z.+-]+\.[a-z]+/)) {
            console.log(form[this.fields[i].name] + ' IS an email')
          } else {
            console.log(form[this.fields[i].name] + ' is NOT an email')
            failed = true
          }
        }

        if (this.fields[i].regexp) {
          console.log(this.fields[i].regexp + ' regexp match ' + this.fields[i].value + ' or ' + form[this.vModel])
        }

        if (passed) {
          verified++
          checked++
        } else if (check) {
          checked++
          failed = true
        }
      }
      var validated = !failed
      console.log('verified ' + verified + ' of ' + checked + ' (hidden: ' + hidden + '): ' + validated)
      return validated
    },
    disabled: function (myForm) {
      var validated = this.validated(myForm)
      var accepted = this.acceptedForm(myForm)
      if (!validated) {
        this.error = this.defaultDisabledMessage
      } else {
        if (validated && accepted && this.acceptFormPrompt) {
          console.log('reset access to read...')
          // this.resetAccess = 'read'
        } else {
          this.resetAccess = ''
        }
        this.error = ''
      }
      var disabled = !validated || !accepted
      return disabled
    },
    myCancel: function () {
      console.log('cancel form')
      if (this.onCancel) {
        this.onCancel()
      } else if (this.options.cancelForm) {
        this.options.cancelForm()
      } else if (this.options.onCancel) {
        this.options.onCancel()
      }

      if (this.cancel) {
        // cancel from Modal if applicable...
        this.cancel()
      }
    },
    resetForm: function () {
      console.log('RESET FORM')
      const reset = {}
      this.$set(this, 'myForm', reset)
      var elems = Object.keys(this.myForm)
      for (var i = 0; i < elems.length; i++) {
        this.$set(this.myForm, elems[i], null)
        console.log('clear ' + elems[i])
      }
    }
  },
  watch: {
    remoteError: function () {
      var keys = Object.key(this.remoteErrors)
      if (keys && keys.length) {
        this.myForm.accepted = false
        console.log('turn off accept flag')
      }
    },
    record: function () {
      console.log('record changed - reinitialize')
      this.initializeRecord()
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

  .accept-block {
    width: 100%
  }
  .accept-checkbox {
    min-width: 20px;
  }
  .accept-prompt {
    width: 100%;
    padding-left: 10px;
  }
</style>
