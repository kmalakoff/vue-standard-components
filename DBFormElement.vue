<!-- src/components/Form.vue -->

<template lang='pug'>
  span
    b F: {{field}}
    hr
    span(v-if="field.type==='int'")
      b Num: {{label(field)}}
      b-form-input(v-model="model" type='number')
    span(v-else-if="field.type==='varchar'")
      b Char: {{label(field)}}
      b-form-input(v-model="model" type='text')
    span(v-else-if="field.type==='date'")
      b Date: {{label(field)}}
      b-form-input(v-model="model" type='date')
    span(v-else-if="field.type.match(/^enum/)")
      b ENUM: {{label(field)}}
      b-form-select(v-model="model" :options="list(field)")
    span(v-else-if="field.type==='boolean'")
      b-form-checkbox(v-model="model")
    span(v-else-if="field.type==='decimal'")
      b-form-input(type='text' :state="isNumber(field)" v-model="model")
    span(v-else)
      b {{field.type}}?: {{label(field)}}
</template>

<script>
  import axios from 'axios'
  // import bFormInput from 'bootstrap-vue/es/components/b-form-input/b-form-input'
  // import bFormInputDirective from 'bootstrap-vue/es/directives/b-form-input/b-form-input'
  
  export default {
    components: {
      // 'b-form-input': bFormInput
    },
    // directives: {
    //   'b-form-input' : 'bFormInputDirective'
    // },
    data () {
      return {
      }
    },

    props: {
      field: { type: Object }
    },
    computed: {
      type: function () { return this.field.type },
      name: function () { return this.field.name }
    },
    methods: {
      loadTest () {
        this.DBfields = [
          {prompt: 'name', type: 'varchar'},
          {name: 'email', type: 'varchar', format: '.+@.+'},
          {prompt: 'B/date', name: 'birthdate', type: 'date'},
          {name: 'gender', type: "enum('M','F')"},
          {name: 'height', type: 'decimal'},
          {name: 'kids', type: 'int'},
          {name: 'mother', type: 'int', reference: 'person'}
        ]
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
          _this.DBFields = []
        })
      },

      validate (evt) {
        console.log('validate ' + JSON.stringify(evt.target))
      },
      label: function (field) {
        if (!field) {
          return null
        } else if (field.prompt) {
          return field.prompt
        } else { return field.name }
      },
      model: function (field) {
        if (!field) {
          return null
        } else if (field.model) {
          return field.model
        } else { return field.model }
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
        var name = this.model(field)
        console.log('name: ' + name)
        return 'ok'
        // return this[name].length > 2
      }

    }

  }
</script>
