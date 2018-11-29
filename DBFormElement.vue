<!-- src/components/Form.vue -->

<template lang='pug'>
  div
    b(v-if='debug') F={{field}} M={{vModel}}; T={{inputType}} or {{otherType}}; D={{defaultTo}})
      br
    span(v-if="promptPosition==='top' && access !=='read'")
      <!-- b(v-bind:class="[{mandatory: field.mandatory}]") {{field.prompt || field.name}}: &nbsp; &nbsp; -->
      br
    span(v-else-if="Ftype==='date' && !options.prompt && access !=='read'")
      b(v-bind:class="[{mandatory: field.mandatory}]") {{field.prompt || field.name}}: &nbsp; &nbsp;
      br
    <!-- span(v-else-if="access==='read' && !options.prompt") -->
      <!-- b(v-bind:class="[{mandatory: field.mandatory}]") {{field.prompt || field.name}}: &nbsp; &nbsp; -->
      <!-- br -->

    span(v-if="access==='read'")
      b.fieldValue(v-if="otherType==='date'") {{defaultTo.substring(0,10)}}
      b.fieldValue(v-else) {{defaultTo}}
    span(v-else-if="inputType")
      b-form-input.input-lg(@change.native="myChange" :type='inputType' :v-model='field.name' :placeholder="label" :value='defaultTo' :default='defaultTo' @blur.native='myBlur' @focus.native="myFocus" aria-describedby='helpfb errfb' :state='checkField')
      <!-- br -->
      <!-- b-form-invalid-feedback(id='errfb') Invalid input -->

    span(v-else-if="otherType==='checkbox'")
      b-form-checkbox.input-lg(@change.native="myChange" :v-model='vModel' :default='defaultTo' @blur.native='myBlur' @focus.native='onFocus' :label='field.name' value=true unchecked-value=false)
        span &nbsp; &nbsp; {{field.prompt || field.name}}

    span(v-else-if="otherType==='radio'")
      b-form-radio-group(@change.native="myChange" :v-model='vModel' :default='defaultTo' @blur.native='myBlur' @focus.native='onFocus' :label='field.prompt' :options='field.options')

    span(v-else-if="otherType==='date'")
      <!-- b-form-input.input-lg(@change.native="myChange" type='date' :placeholder="datePlaceholder" :value='defaultTo' :default='defaultTo'  @blur.native='myBlur' @focus.native="myFocus") -->
      b-form-input.input-lg(@change.native="myChange" type='date' :placeholder="datePlaceholder" :value='defaultTo' :default='defaultTo'  @blur.native='myBlur' @focus.native="myFocus" :v-model='vModel')
    span(v-else-if="otherType==='enum'")
      <!-- form-select requires use of evt based method (change passes evt instead of value for select list) -->
      b-form-select.input-lg(@change.native="myChange" :options="list(field)" :value='defaultTo' :default='defaultTo'  @blur.native='myBlur' @focus.native="myFocus")

    span(v-else-if="otherType==='decimal'")
      b-form-input.input-lg(type='text' :state="isNumber(field)" @change.native="myChange" :placeholder="placeholder" :value='defaultTo' :default='defaultTo' @blur.native='myBlur' @focus.native='onFocus')

    span(v-else-if="otherType==='fixed'")
      b-form-input.input-lg(type='text' @change.native="myChange" :placeholder="placeholder" disabled :value='defaultTo' :default='defaultTo' @blur.native='myBlur' @focus.native='onFocus')

    span(v-else-if="otherType==='reference'")
      b-form-input(type='text' @change.native="myChange" :placeholder="placeholder" disabled :value='defaultTo' :default='defaultTo' @blur.native='myBlur' @focus.native='onFocus')

    span(v-else-if="otherType==='hidden'")
      b-form-input(v-show=0 type='text' v-model="vModel" :placeholder="placeholder" disabled :value='defaultTo' :default='defaultTo' @blur.native='myBlur' @focus.native='onFocus')

    // span(v-else-if="otherType==='password'")
    //   b-form-input.input-lg(@change.native="myChange" type='password' :placeholder="placeholder" :value='defaultTo' :default='defaultTo' :disabled="access !== 'edit' && access !== 'append'" @blur.prevent='onBlur' @click.prevent='onFocus')

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
      bd: '1999-02-04'
    }
  },
  props: {
    field: { type: Object },
    placeholder: { type: String },
    vModel: { type: String },
    form: { type: Object },
    access: { type: String },
    record: { type: Object },
    options: { type: Object },
    defaultPrompt: {
      type: String,
      default: '-- select --'
    },
    promptPosition: {
      type: String,
      default: null
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
    // console.log(this.field.name + ' found default: ' + defaultTo)
  },
  computed: {
    datePlaceholder: function () { return this.placeholder || 'YYYY-MM-DD' },
    refModel: function () { return this.form[this.vModel] },
    Ftype: function () { return this.field.type || 'varchar' },
    label: function () { return this.field.placeholder || this.placeholder },
    name: function () { return this.field.name },
    mval: function (model) { return this[model] },
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
    checkField: function () {
      return true
    }
  },
  methods: {
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
    },
    myBlur (evt) {
      if (this.field.validate) {
        console.log('Validate: ' + JSON.stringify(this.field))
      }

      if (this.onBlur) {
        this.onBlur(evt, this.om)
      }
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
    }

  }

}
</script>
<style>
.mandatory {
  outline: solid red 1px;
  color: red;
}
.prompt {

}
.fieldValue {
  color: blue;
}
</style>
