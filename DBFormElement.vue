<!-- src/components/Form.vue -->

<template lang='pug'>
  div
    <!-- b {{field}} : {{field.type}} {{list(field)}} : {{vModel}} = {{vm}} -->
    <!-- b {{form}} -->
    span(v-if="field.type==='string' || field.type==='text'")
      b-form-input.input-lg(v-model="vm" v-on:change="saveMe" type='string' :placeholder="placeholder" default='default')
    span(v-else-if="field.type==='int'")
      b-form-input.input-lg(v-model="vm" v-on:change="saveMe" type='number' :placeholder="placeholder" default='default')
    span(v-else-if="field.type==='varchar'")
      b-form-input.input-lg(v-model="vm" v-on:change="saveMe" type='text' :placeholder="placeholder" default='default')
    span(v-else-if="field.type==='date'")
      b-form-input.input-lg(v-model="vm" v-on:change="saveMe" type='date' :options="list(field)" placeholder="yyyy-mm-dd")
    span(v-else-if="field.type.match(/^enum/)")
      <!-- form-select requires use of evt based method (change passes evt instead of value for select list) -->
      b-form-select.input-lg(v-model="vm" :options="list(field)" @change.native="myChange")
    span(v-else-if="field.type==='boolean'")
      b-form-checkbox.input-lg(v-model="vm" v-on:change="saveMe")
    span(v-else-if="field.type==='decimal'")
      b-form-input.input-lg(type='text' :state="isNumber(field)" v-model="vm" v-on:change="saveMe" :placeholder="placeholder" )
    span(v-else-if="field.type==='fixed'")
      b-form-input.input-lg(type='text' v-model="vm" :placeholder="placeholder" disabled)
    span(v-else-if="field.type==='reference'")
      b-form-input(type='text' v-model="vm" :placeholder="placeholder" disabled)
    span(v-else-if="field.type==='hidden'")
      b-form-input(type='hidden' v-model="vm" :placeholder="placeholder" disabled)
    span(v-else)
      b {{field.type}}?: {{field}}

</template>

<script>
  // import axios from 'axios'
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
        om: this.vModel
      }
    },
    props: {
      field: { type: Object },
      placeholder: { type: String },
      vModel: { type: String },
      form: { type: Object }
    },
    created: function () {
      // var keys = _.pluck(this.field.default)
      this.$set(this.form, this.om, this.field.default)
      console.log(this.field.name + ' found default: ' + this.field.default)
    },
    computed: {
      type: function () { return this.field.type },
      name: function () { return this.field.name },
      mval: function (model) { return this[model] },
      default: function () { return this.field.default || '' },
      addClass: function () {
        if (this.addClass) {
          return this.addClass
        } else {
          return 'input-lg'
        }
      }
    },
    methods: {
      saveMe (val) {
        this.$set(this.form, this.om, this.vm)
      },
      myChange (evt) {
        this.$set(this.form, this.om, evt.target.value)
      },
      validate (evt) {
        console.log('validate ' + JSON.stringify(evt.target))
      },
      // type: function (field) {
      //   if (!field) {
      //     return null
      //   } else { return field.type }
      // },
      form_element: function (field) {
        if (!field) {
          return null
        } else if (field.type.match(/^int/i)) {
          return
        }
      },

      list: function (field) {
        var regex = /^enum\(['"]?(.*?)['"]?\)/
        var list = field.type.match(regex)
        if (list) {
          var elements = list[1].split(/['"],['"]/)
          return elements
        } else { return ['A', 'B', 'C'] }
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
