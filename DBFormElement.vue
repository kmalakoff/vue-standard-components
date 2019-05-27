<!-- src/components/Form.vue -->
<!--
  This compoent generates an input form element (using bootstrap b-form-elements as a baseline)
  It includes automatic labelling with field validation (mandatory, email, regexp)
  Fields failing validation will have labels and input fields highlighted in red

  [Note options may be provided in future to specify different form types (eg standard input))

Usage:
  Normally used via DBForm including field elements as input options (see DBForm)

  DBFormElement(:form="form" :field="field" :options='options' :vModel='model')

  where (for example):
  model = 'email'
  field = { name: 'email', 'prompt: 'Email Address', mandatory: true, type: 'email'}

  ( field may also contain: attributes: placeholder, default, value, regexp )

  options = {
    onBlur: function,
    onChange: function,
    onFocus: function,
    promptPosition: (default to top),
    class: (input field class),
    labelClass: (field label class),
    colour: (on/off - default to on)
  }
-->
<template lang= 'pug'>
  div.form-element(role='group')
    b(v-if='debug') F={{field}} M={{vModel}}; T={{inputType}} or {{otherType}}; D={{defaultTo}})
      br
    label.element-label(v-if="promptPosition=== 'top' && otherType !== 'checkbox'" :for= 'field.name' :class="labelClass") {{field.prompt || field.name}}: &nbsp; &nbsp;
      b(v-if='localError') &nbsp; &nbsp; {{localError}}
    label.element-label(v-else-if="Ftype=== 'date' && !options.prompt" :for= 'field.name' ) {{field.prompt || field.name}}: &nbsp; &nbsp;
      b(v-if='localError') &nbsp; &nbsp; {{localError}}

    b-form-input.input-lg(:id='randomId' v-if="inputType" @change.native="myChange" :type= 'inputType' :name='field.name' :v-model='formModel' :placeholder="label" :value= 'defaultTo' :default= 'defaultTo' @blur.native= 'myBlur' @keyup.native='myKeyup' @focus.native="myFocus" aria-describedby= 'helpfb errfb' :state='checkField(field)' :class="myClass" :disabled= 'disabled' :required='field.mandatory')

    b-form-checkbox.input-lg(:id='randomId' v-else-if="otherType=== 'checkbox'" @change.native="myChange" :v-model='formModel' :default= 'defaultTo' @blur.native= 'myBlur' @keyup.native='myKeyup' @focus.native= 'onFocus' :label= 'field.name' value=true unchecked-value=false :class="myClass" :state='checkField(field)' :disabled= 'disabled')
        span &nbsp; &nbsp; {{field.prompt || field.name}}

    b-form-radio-group(:id='randomId' v-else-if="otherType=== 'radio'" @change.native="myChange" :v-model='formModel' :default= 'defaultTo' @blur.native= 'myBlur' @keyup.native='myKeyup' @focus.native= 'onFocus' :label= 'field.prompt' :options= 'field.options' :class="myClass" :state='checkField(field)' :disabled= 'disabled')

    b-form-input.input-lg.date-type(:id='randomId' v-else-if="otherType=== 'date'" @change.native="myChange" type= 'date' :placeholder="datePlaceholder" :value= 'defaultTo' :default= 'defaultTo'  @blur.native= 'myBlur' @keyup.native='myKeyup' @focus.native="myFocus" :v-model='formModel' :class="myClass" :state='checkField(field)' :disabled= 'disabled')

    b-form-input.input-lg.date-type(:id='randomId' v-else-if="otherType=== 'time'" @change.native="myChange" type= 'datetime-local' :placeholder="datePlaceholder" :value= 'defaultTo' :default= 'defaultTo'  @blur.native= 'myBlur' @keyup.native='myKeyup' @focus.native="myFocus" :v-model='formModel' :class="myClass" :state='checkField(field)' :disabled= 'disabled')

    b-form-select.input-lg(:id='randomId' v-else-if="otherType=== 'enum'" @change.native="myChange" :options="list(field)" :value= 'defaultTo' :default= 'defaultTo'  @blur.native= 'myBlur' @keyup.native='myKeyup' @focus.native="myFocus" :class="myClass" :state='checkField(field)' :disabled= 'disabled')

    b-form-input.input-lg(:id='randomId' v-else-if="otherType=== 'decimal'" type= 'text' @change.native="myChange" :placeholder="placeholder" :value= 'defaultTo' :default= 'defaultTo' @blur.native= 'myBlur' @keyup.native='myKeyup' @focus.native= 'onFocus' :class="myClass" :state="isNumber(field)" :disabled= 'disabled')

    b-form-input.input-lg(:id='randomId' v-else-if="otherType=== 'fixed'" type= 'text' @change.native="myChange" :placeholder="placeholder" :value= 'defaultTo' :default= 'defaultTo' @blur.native= 'myBlur' @keyup.native='myKeyup' @focus.native= 'onFocus' :class="myClass" :state='checkField(field)' :disabled= 'disabled')

    b-form-input(:id='randomId' v-else-if="otherType=== 'reference'" type= 'text' @change.native="myChange" :placeholder="placeholder" :value= 'defaultTo' :default= 'defaultTo' @blur.native= 'myBlur' @keyup.native='myKeyup' @focus.native= 'onFocus' :class="myClass" :state='checkField(field)' :disabled= 'disabled')

    b-form-input(:id='randomId' v-else-if="otherType=== 'hidden'" v-show=0 type= 'text' v-model="vModel" :placeholder="placeholder" :value= 'defaultTo' :default= 'defaultTo' @blur.native= 'myBlur' @keyup.native='myKeyup' @focus.native= 'onFocus' :class="myClass" :state='checkField(field)' :disabled= 'disabled')

    //   b-form-input.input-lg(:id='randomId' v-else-if="otherType=== 'password'" @change.native="myChange" type= 'password' :placeholder="placeholder" :value= 'defaultTo' :default= 'defaultTo' :disabled="access !== 'edit' && access !== 'append'" @blur.prevent= 'onBlur' @click.prevent= 'onFocus' :class="myClass" :disabled= 'disabled')

    span(v-else)
      b {{Ftype}} ?: {{otherType}} : {{field}}
</template>

<script>
// import axios from 'axios'
// replace input with b-form-input ()
// import bFormInput from 'bootstrap-vue/es/components/b-form-input/b-form-input'
// import bFormInputDirective from 'bootstrap-vue/es/directives/b-form-input/b-form-input'
import 'vue-awesome/icons/question-circle'

export default {
  components: {
    // 'b-form-input': bFormInput
  },
  // directives: {
  //   'b-form-input' : 'bFormInputDirective'
  // },
  data () {
    return {
      // vm: this.field.default,
      // om: this.vModel,
      test: '',
      bd: '1999-02-04',
      formChanged: false,
      formLeft: false,
      randomId: '0',
      myClass: '',
      labelClass: '',
      errors: {},
      localError: '',
      validateOn: 'keyup',
      myForm: {}
    }
  },
  props: {
    field: { type: Object },
    placeholder: { type: String },
    vModel: { type: String },
    form: {
      type: Object,
      default () { return {} }
    },
    access: { type: String },
    record: { type: Object },
    options: {
      type: Object,
      default () { return {} }
    },
    defaultPrompt: {
      type: String,
      default: '-- select --'
    },
    remoteError: {
      type: String
    },
    debug: {
      type: Boolean,
      default: false
    }
  },
  created: function () {
    // var keys = _.pluck(this.field.default)
    this.myForm = this.form
    var defaultTo = this.field.default || this.myForm[this.vModel] || null

    this.$set(this.myForm, this.vModel, defaultTo)
    this.randomId = Math.random() + '-form-element'
    console.log('random: ' + this.randomId)

    this.presetClass(this.field)
    this.localError = this.remoteError
    // console.log(this.field.name + ' found default: ' + defaultTo)
  },
  computed: {
    formModel: function () { return 'myForm.' + this.vModel },
    datePlaceholder: function () { return this.placeholder || '' },
    refModel: function () { return this.myForm[this.vModel] },
    Ftype: function () { return this.field.type || 'varchar' },
    label: function () { return this.field.placeholder || this.placeholder },
    name: function () { return this.field.name },
    mval: function (model) { return this[model] },
    promptPosition: function () { return this.options.promptPosition || 'top' },
    defaultTo: function () {
      if (this.record && this.record[this.field.name]) {
        return this.record[this.field.name]
      } else {
        return this.field.default || this.field.value || this.myForm[this.vModel] || null
      }
    },
    addClass: function () {
      if (this.addClass) {
        return this.addClass
      } else {
        return 'input-lg'
      }
    },
    onBlur: function () {
      if (this.options && this.options.onBlur) {
        return this.options.onBlur
      } else if (this.options && this.options.onChange) {
        return this.options.onChange
      } else {
        return ''
      }
    },
    onFocus: function () {
      if (this.options && this.options.onFocus) {
        return this.options.onFocus
      } else {
        return this.nullFunction
      }
    },
    inputType: function () {
      switch (this.Ftype) {
        case 'number' : return 'number'
        case 'int' : return 'number'
        case 'integer' : return 'number'
        case 'varchar' : return 'text'
        case 'text' : return 'text'
        case 'email' : return 'email'
        case 'tel' : return 'tel'
        case 'string' : return 'string'
        case 'password' : return 'password'
        default: return false
      }
    },
    otherType: function () {
      if (this.Ftype.match(/^enum/)) {
        return 'enum'
      } else {
        switch (this.Ftype) {
          case 'boolean' : return 'checkbox'
          case 'confirm' : return 'checkbox'
          case 'checkbox' : return 'checkbox'
          case 'radio' : return 'radio'
          case 'decimal' : return 'decimal'
          case 'float' : return 'decimal'
          case 'date' : return 'date'
          case 'time' : return 'time'
          case 'datetime' : return 'time'
          case 'fixed' : return 'fixed'
          case 'reference' : return 'reference'
          case 'hidden' : return 'hidden'
          default: return false
        }
      }
    },
    disabled: function () {
      if (this.localError && !this.formChanged) {
        return true
      } else if (this.access === 'read') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    testClass: function (field) {
      return 'mandatoryPrompt'
    },
    errid (name) {
      var id = name + '-error'
      console.log('errid field: ' + id)
      return id
    },
    nullFunction () {
      console.log('null function...')
    },
    saveMe (val) {
      console.log('save Me')
      // this.$set(this.form, this.vModel, this.field.default)
    },
    myKeyup (evt) {
      if (this.validateOn === 'keyup') {
        this.validate(evt)
      }
    },
    myChange (evt) {
      console.log('execute on change...')
      if (evt.target.type === 'checkbox') {
        this.$set(this.myForm, this.vModel, evt.target.checked)
      } else {
        this.$set(this.myForm, this.vModel, evt.target.value)
      }
      if (this.validateOn === 'keyup') {
        this.validate(evt)
      }
    },
    myBlur (evt) {
      // Adjust input / label class based upon validation
      console.log('execute on blur...')
      if (this.field.validate) {
        console.log('Validate: ' + JSON.stringify(this.field))
      }

      if (this.onBlur) {
        this.onBlur(evt, this.vModel)
      }

      this.formLeft = true
    },
    myFocus (evt) {
      console.log('execute on focus...')
      if (this.onFocus) {
        console.log('DBFE focused on ' + this.vModel + ' : ' + this.vModel)
        console.log(JSON.stringify(evt))
        this.onFocus(evt, this.vModel)
      }
    },
    validate (arg) {
      // arg may be evt or null (default to field specs)
      var type = null
      var val = null
      if (arg && arg.target) {
        type = arg.target.type
        val = arg.target.value
      } else {
        type = this.field.type
        val = this.myForm[this.vModel]
      }

      var regexp
      if (this.field.regexp) {
        regexp = new RegExp(this.field.regexp)
      }

      if (this.field.mandatory && !val) {
        this.myClass = 'mandatoryInputNotOK'
        this.labelClass = 'mandatoryPrompt'
      } else {
        if (type === 'email' && !val.match(/[a-zA-Z0-9.+-]+@[a-zA-Z]+\.[a-z.+-]+/)) {
          console.log('not an email ?')
          this.$set(this.errors, this.field.name, 'Invalid Email')
          this.labelClass = 'mandatoryPrompt'
          this.myClass = 'mandatoryInputNotOK'
        } else if (regexp && !val.match(regexp)) {
          console.log('regexp mismatch with ' + this.field.regexp)
          this.$set(this.errors, this.field.name, 'Regexp mismatch')
          this.labelClass = 'mandatoryPrompt'
          this.myClass = 'mandatoryInputNotOK'
        } else {
          console.log(this.vModel + ' validate ok')
          // Passed all validation checks !
          if (this.localError) {
            console.log('cleared error')
            this.localError = ''
            this.formChanged = true
          }
          this.$set(this.errors, this.field.name, null)
          this.labelClass = 'mandatoryPromptOK'
          this.myClass = 'mandatoryInputOK'
        }
      }
    },
    // type: function (field) {
    //   if (!field) {
    //     return null
    //   } else { return Ftype }
    // },
    form_element: function (field) {
      if (!field) {
        return null
      } else if (this.Ftype.match(/^int/i)) {
        return null
      } else {
        return true
      }
    },

    list: function (field) {
      var regex = /^(enum|radio)\(['"]?(.*?)['"]?\)/
      // var regex = /^(enum|radio)[([]['"]?(.*?)['"]?[)\]]/i
      var list = this.Ftype.match(regex)
      var prompt = field.prompt || field.name

      if (prompt) {
        prompt = '- select ' + prompt + ' -'
      } else {
        prompt = this.options.defaultPrompt
      }

      var List = [{value: null, text: prompt}]
      if (list) {
        var elements = list[2].split(/['"]\s*,\s*['"]/)
        for (var i = 0; i < elements.length; i++) {
          List.push({value: elements[i], text: elements[i]})
          List.text = elements[i]
        }
        return List
      } else {
        return {placeholder: 'Pick Date'}
      }
    },
    isNumber: function (field) {
      var name = this.model
      console.log('name: ' + name)
      return 'ok'
      // return this[name].length > 2
    },
    presetClass: function (field) {
      var myClass = this.options.class || ''
      var labelClass = this.options.labelClass || ''
      if (this.options.colour === 'off') {
        // skip colour coding
      } else if (!this.formLeft && this.options.colour !== 'on') {
        // myClass = ''
        // } else if (this.formChanged && !this.localError) {
        //   myClass = ''
      } else {
        if (this.localError) {
          labelClass = 'mandatoryPrompt'
          myClass = 'mandatoryInputNotOK'
        } else {

        }
      }
      this.myClass = myClass
      this.labelClass = labelClass
    },
    checkField: function (field) {
      if (this.myForm[field.name]) {
        return true
      } else { return false }
    }
  },
  watch: {
  }
}
</script>
<style>
.form-element {
  text-align: left;
}
.element-label {
  font-size: initial;
}

input.input-lg.date-type {
  line-height: inherit !important;
  /* fixes size for some reason (?) */
}
.prompt {

}
.fieldValue {
  color: blue;
}
input.input-lg {
  width: 100%;
}
div.form-element input.is-valid {
  // box-shadow: 0 0 1px 1px green, 0 0 8px;
  border-color: 1px solid green !important;
}
</style>
