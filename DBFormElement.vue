<!-- src/components/Form.vue -->

<template lang='pug'>
  div
    b(v-if='debug') F: {{field}} : {{vModel}} = {{vm}} :: {{vModel}} i? {{iType}} {{field.name}}
    span(v-if="access==='read'")
      b {{defaultTo}}
    span(v-else-if="iType")
      b-form-input.input-lg(@change.native="myChange" :type='iType' :v-model='field.name' :placeholder="label" :value='defaultTo' :default='defaultTo' @blur.native='myBlur' @focus.native="myFocus")
      // input.input-lg(@change.native="myChange" type='text' :placeholder="placeholder" :value='defaultTo' :default='defaultTo' @blur.prevent='onBlur' @focus.prevent='onFocus')
    // span(v-else-if="Ftype==='string' || Ftype==='text'")
    //   b-form-input.input-lg(@change.native="myChange" type='text' :placeholder="placeholder" :value='defaultTo' :default='defaultTo' @blur.prevent='onBlur' @focus.prevent='onFocus')
    // span(v-else-if="Ftype==='int' || Ftype==='integer'")
    //   b-form-input.input-lg(@change.native="myChange" type='number' :placeholder="placeholder" :value='defaultTo' :default='defaultTo')
    // span(v-else-if="Ftype==='varchar'")
    //   b-form-input.input-lg(@change.native="myChange" type='text' :placeholder="placeholder" :value='defaultTo' :default='defaultTo' :disabled="access !== 'edit' && access !== 'append'")
    // span(v-else-if="Ftype==='password'")
    //   b-form-input.input-lg(@change.native="myChange" type='password' :placeholder="placeholder" :value='defaultTo' :default='defaultTo' :disabled="access !== 'edit' && access !== 'append'" @blur.prevent='onBlur' @click.prevent='onFocus')
    span(v-else-if="Ftype==='date'")
      b-form-input.input-lg(@change.native="myChange" type='date' :options="list(field)" :placeholder="datePlaceholder" :value='defaultTo' :default='defaultTo'  @blur.native='myBlur' @focus.native="myFocus")
    span(v-else-if="Ftype.match(/^enum/)")
      <!-- form-select requires use of evt based method (change passes evt instead of value for select list) -->
      b-form-select.input-lg(@change.native="myChange" :options="list(field)" :value='defaultTo' :default='defaultTo'  @blur.native='myBlur' @focus.native="myFocus")
    // span(v-else-if="Ftype==='boolean'")
    //   b-form-checkbox.input-lg(@change.native="myChange" :value='defaultTo' :default='defaultTo')
    span(v-else-if="Ftype==='decimal'")
      b-form-input.input-lg(type='text' :state="isNumber(field)" @change.native="myChange" :placeholder="placeholder" :value='defaultTo' :default='defaultTo' @blur.native='myBlur' @focus.native='onFocus')
    span(v-else-if="Ftype==='fixed'")
      b-form-input.input-lg(type='text' @change.native="myChange" :placeholder="placeholder" disabled :value='defaultTo' :default='defaultTo' @blur.native='myBlur' @focus.native='onFocus')
    span(v-else-if="Ftype==='reference'")
      b-form-input(type='text' @change.native="myChange" :placeholder="placeholder" disabled :value='defaultTo' :default='defaultTo' @blur.native='myBlur' @focus.native='onFocus')
    span(v-else-if="Ftype==='hidden'")
      b-form-input(v-show=0 type='text' v-model="vModel" :placeholder="placeholder" disabled :value='defaultTo' :default='defaultTo' @blur.native='myBlur' @focus.native='onFocus')
    span(v-else)
      b {{Ftype}}?: {{field}}

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
      test: ''
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
    debug: { type: Boolean }
  },
  created: function () {
    // var keys = _.pluck(this.field.default)
    var defaultTo = this.field.default || this.form[this.om]

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
        return this.field.default || this.field.value || this.form[this.om]
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
    iType: function () {
      switch (this.Ftype) {
        case 'int' : return 'number'
        case 'integer' : return 'number'
        case 'varchar' : return 'text'
        case 'text' : return 'text'
        case 'string' : return 'string'
        case 'boolean' : return 'checkbox'
        case 'password' : return 'password'
        default: return false
      }
    }
  },
  methods: {
    nullFunction () {
      console.log('null function...')
    },
    saveMe (val) {
      console.log('save Me')
      this.$set(this.form, this.om, this.vm)
    },
    myChange (evt) {
      console.log('change ' + this.om + ' to ' + evt.target.value)
      this.$set(this.form, this.om, evt.target.value)
      if (this.onBlur) {
        this.onBlur(evt, this.om)
      }
    },
    myBlur (evt) {
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
      var regex = /^enum\(['"]?(.*?)['"]?\)/
      var list = this.Ftype.match(regex)
      if (list) {
        var elements = list[1].split(/['"]\s*,\s*['"]/)
        return elements
      } else { return null }
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
