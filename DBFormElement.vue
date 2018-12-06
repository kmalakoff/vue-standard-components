<!-- src/components/Form.vue -->

<template lang= 'pug'>
  div.form-element(role='group')
    b(v-if= 'debug') F={{field}} M={{vModel}}; T={{inputType}} or {{otherType}}; D={{defaultTo}})
      br
    label.element-label(v-if="promptPosition=== 'top' && otherType !== 'checkbox'" :for= 'field.name' :class="dynamicClass(field, 'label')") {{field.prompt || field.name}}:
    label.element-label(v-else-if="Ftype=== 'date' && !options.prompt" :for= 'field.name' ) {{field.prompt || field.name}}: &nbsp; &nbsp;

    b-form-input.input-lg(:id='randomId' v-if="inputType" @change.native="myChange" :type= 'inputType' :v-model= 'field.name' :placeholder="label" :value= 'defaultTo' :default= 'defaultTo' @blur.native= 'myBlur' @focus.native="myFocus" aria-describedby= 'helpfb errfb' :state='checkField(field)' :class="dynamicClass(field)" :disabled= 'disabled')

    b-form-checkbox.input-lg(:id='randomId' v-else-if="otherType=== 'checkbox'" @change.native="myChange" :v-model= 'vModel' :default= 'defaultTo' @blur.native= 'myBlur' @focus.native= 'onFocus' :label= 'field.name' value=true unchecked-value=false :class="dynamicClass(field)" :state='checkField(field)' :disabled= 'disabled')
        span &nbsp; &nbsp; {{field.prompt || field.name}}

    b-form-radio-group(:id='randomId' v-else-if="otherType=== 'radio'" @change.native="myChange" :v-model= 'vModel' :default= 'defaultTo' @blur.native= 'myBlur' @focus.native= 'onFocus' :label= 'field.prompt' :options= 'field.options' :class="dynamicClass(field)" :state='checkField(field)' :disabled= 'disabled')

    b-form-input.input-lg.date-type(:id='randomId' v-else-if="otherType=== 'date'" @change.native="myChange" type= 'date' :placeholder="datePlaceholder" :value= 'defaultTo' :default= 'defaultTo'  @blur.native= 'myBlur' @focus.native="myFocus" :v-model= 'vModel' :class="dynamicClass(field)" :state='checkField(field)' :disabled= 'disabled')

    b-form-select.input-lg(:id='randomId' v-else-if="otherType=== 'enum'" @change.native="myChange" :options="list(field)" :value= 'defaultTo' :default= 'defaultTo'  @blur.native= 'myBlur' @focus.native="myFocus" :class="dynamicClass(field)" :state='checkField(field)' :disabled= 'disabled')

    b-form-input.input-lg(:id='randomId' v-else-if="otherType=== 'decimal'" type= 'text' @change.native="myChange" :placeholder="placeholder" :value= 'defaultTo' :default= 'defaultTo' @blur.native= 'myBlur' @focus.native= 'onFocus' :class="dynamicClass(field)" :state="isNumber(field)" :disabled= 'disabled')

    b-form-input.input-lg(:id='randomId' v-else-if="otherType=== 'fixed'" type= 'text' @change.native="myChange" :placeholder="placeholder" :value= 'defaultTo' :default= 'defaultTo' @blur.native= 'myBlur' @focus.native= 'onFocus' :class="dynamicClass(field)" :state='checkField(field)' :disabled= 'disabled')

    b-form-input(:id='randomId' v-else-if="otherType=== 'reference'" type= 'text' @change.native="myChange" :placeholder="placeholder" :value= 'defaultTo' :default= 'defaultTo' @blur.native= 'myBlur' @focus.native= 'onFocus' :class="dynamicClass(field)" :state='checkField(field)' :disabled= 'disabled')

    b-form-input(:id='randomId' v-else-if="otherType=== 'hidden'" v-show=0 type= 'text' v-model="vModel" :placeholder="placeholder" :value= 'defaultTo' :default= 'defaultTo' @blur.native= 'myBlur' @focus.native= 'onFocus' :class="dynamicClass(field)" :state='checkField(field)' :disabled= 'disabled')

    //   b-form-input.input-lg(:id='randomId' v-else-if="otherType=== 'password'" @change.native="myChange" type= 'password' :placeholder="placeholder" :value= 'defaultTo' :default= 'defaultTo' :disabled="access !== 'edit' && access !== 'append'" @blur.prevent= 'onBlur' @click.prevent= 'onFocus' :class="dynamicClass(field)" :disabled= 'disabled')

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
      vm: this.field.default,
      om: this.vModel,
      test: '',
      bd: '1999-02-04',
      formChanged: false,
      formLeft: false,
      randomId: '0'
    }
  },
  props: {
    field: { type: Object },
    placeholder: { type: String },
    vModel: { type: String },
    form: { type: Object },
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
    localError: {
      type: String
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
    var defaultTo = this.field.default || this.form[this.om] || null

    this.$set(this.form, this.om, defaultTo)
    this.randomId = Math.random() + '-form-element'
    console.log('random: ' + this.randomId)
    // console.log(this.field.name + ' found default: ' + defaultTo)
  },
  computed: {
    datePlaceholder: function () { return this.placeholder || '' },
    refModel: function () { return this.form[this.vModel] },
    Ftype: function () { return this.field.type || 'varchar' },
    label: function () { return this.field.placeholder || this.placeholder },
    name: function () { return this.field.name },
    mval: function (model) { return this[model] },
    promptPosition: function () { return this.options.promptPosition || 'top' },
    defaultTo: function () {
      if (this.record && this.record[this.field.name]) {
        return this.record[this.field.name]
      } else {
        return this.field.default || this.field.value || this.form[this.om] || null
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
          case 'fixed' : return 'fixed'
          case 'reference' : return 'reference'
          case 'hidden' : return 'hidden'
          default: return false
        }
      }
    },
    disabled: function () {
      if (this.remoteError && !this.formChanged) {
        return false
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
      this.$set(this.form, this.om, this.vm)
    },
    myChange (evt) {
      if (evt.target.type === 'checkbox') {
        console.log('change ' + this.om + ' to boolean: ' + evt.target.checked)
        this.$set(this.form, this.om, evt.target.checked)
      } else {
        console.log('change ' + evt.target.type + ': ' + this.om + ' to ' + evt.target.value)
        this.$set(this.form, this.om, evt.target.value)
      }
      if (this.onBlur) {
        this.onBlur(evt, this.om)
      }
      if (this.remoteError) {
        console.log('cleared error')
        this.remoteError = ''
        this.formChanged = true
      }
    },
    myBlur (evt) {
      if (this.field.validate) {
        console.log('Validate: ' + JSON.stringify(this.field))
      }

      if (this.onBlur) {
        this.onBlur(evt, this.om)
      }

      this.formLeft = true
    },
    myFocus (evt) {
      if (this.onFocus) {
        console.log('DBFE focused on ' + this.om)
        console.log(JSON.stringify(evt))
        this.onFocus(evt, this.om)
      }
    },
    validate (evt) {
      console.log('validate ' + JSON.stringify(evt.target))
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
    dynamicClass: function (field, type) {
      var myClass = ''
      if (this.options.colour === 'off') {
      } else if (this.remoteError) {
        if (type === 'label') {
          myClass = 'mandatoryPrompt'
        } else {
          myClass = 'mandatoryInputNotOK'
        }
      } else if (!this.formLeft && this.options.colour !== 'on') {
        myClass = ''
      // } else if (this.formChanged && !this.localError) {
      //   myClass = ''
      } else if (field.mandatory) {
        if (type === 'label' && this.form[field.name]) {
          myClass = 'mandatoryPromptOK'
        } else if (type === 'label') {
          myClass = 'mandatoryPrompt'
        } else if (this.form[field.name]) {
          myClass = 'mandatoryInputOK'
        } else {
          myClass = 'mandatoryInputNotOK'
        }
      } else {
        if (type !== 'label' && this.form[field.name]) {
          myClass = 'mandatoryInputOK'
        } else {
          myClass = ''
        }
      }
      // console.log(this.form[field.name] + ' dynamic class for ' + field.name + '; M: ' + field.mandatory + '; C: ' + this.formChanged + ' = ' + myClass + ' ERR: ' + this.remoteError)
      return myClass
    },
    checkField: function (field) {
      if (this.form[field.name]) {
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
