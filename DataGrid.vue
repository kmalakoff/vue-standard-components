<!-- src/components/Login.vue -->

<template lang='pug'>
  div.data-grid
    table.ResultsGrid(v-if='data && data.length')
      thead
        tr(v-show="data_header")
          td(:class="headerClass" :colspan="columns")
            b {{data_header}}
      tr
        th.result-heading(v-for="key in data_fields")
          span {{key}}
        th.result-heading(v-if="deSelectable") Remove
        th.result-heading(v-if="options && options.addLinks" v-for="func, key in options.addLinks")
          span &nbsp; <!-- add empty column headers -->         
      tbody
        tr.result-row(v-for="record, index in data")
          td.result-cell(v-for="key in data_fields")
            a(href='#' onclick='return false;' data-html='true' data-model={model} data-attribute={key} @click.prevent="pickOne(index)") {{record[key]}}
          td.result-cell(v-if="deSelectable") 
            button.btn.btn-xs.btn-danger(v-on:click="data.splice(index,1)") X 
          td.result-cell(v-if="options && options.addLinks" v-for="link in options.addLinks")
            ActionButton(:name="link.name" :type="link.type" :modal="link.modal" :record="data[index]" :link="link" :links="links")
    div(v-if='!data || !data.length')
      table(align='center' v-if='noDataMsg') 
        tr
          td {{noDataMsg}}
</template>

<script>
  // import { mapState } from 'vuex'

  import ActionButton from './ActionButton.vue'

  export default {
    name: 'data-grid',
    components: {
      ActionButton
    },
    data () {
      return {
        showModal: false
      }
    },
    props: {
      name: {
        type: String,
        default: 'data-grid'
      },
      header: {
        type: String
      },
      headerClass: {
        type: String,
        default: 'GridHeader'
      },
      data: {
        type: Array
      },
      fields: {
        type: Array
      },
      options: {
        type: Object,
        default: () => {}
      },
      search_options: {
        type: Object
      },

      links: {
        type: Object
      },
      noDataMsg: {
        type: String,
        default: ''
      },
      picked: {
        type: Array,
        default: () => []
      },
      onPick: {
        type: Function
      },
      multiSelect: {
        type: Boolean,
        default: false
      },
      deSelectable: {
        type: Boolean,
        default: false
      },
      addColumn: {
        type: Object
      },
      modal_options: {
        type: Object
      },
      modalButton: {
        type: String
      },
      modalTable: {
        type: String
      },
      modalURL: {
        type: String
      }
    },
    created: function () {
      console.log('created DataGrid...')
    },
    computed: {
      data_fields: function () {
        if (this.search_options && this.search_options.search_fields) {
          return this.search_options.search_fields
        } else if (this.options && this.options.fields) {
          return this.options.fields
        } else {
          var keys = Object.keys(this.data[0])
          console.log('defaulting to keys from first record since no fields specified')
          return keys
        }
      },
      target: function () {
        if (this.options && this.options.target) {
          return this.options.target
        } else { return null }
      },
      data_header: function () {
        if (this.header) {
          return this.header
        } else if (this.options && this.options.title) {
          return this.options.title
        } else { return '' }
      },
      addLinks: function () {
        if (this.options && this.options.addLinks && this.options.addLinks.length) {
          return this.options.addLinks
        } else {
          return []
        }
      },
      columns: function () {
        var count = 1

        if (this.data && this.data.length) {
          count += Object.keys(this.data[0]).length
        }

        if (this.addLinks) {
          count += Object.keys(this.addLinks).length
        }

        return count
      }
    },

    methods: {
      showM () {
        this.showModal = true
      },
      hideM () {
        this.showModal = false
      },

      pickOne (index) {
        console.log('pick ' + index)
        console.log('MS ? ' + this.multiSelect)

        console.log('picked: ' + JSON.stringify(this.picked))
        console.log('data: ' + JSON.stringify(this.data))
        var item = this.data[index]
        console.log('item: ' + JSON.stringify(item))
        console.log('options: ' + JSON.stringify(this.options))

        var target = this.search_options.target

        var record = {}
        var keys = Object.keys(item)
        for (var i = 0; i < keys.length; i++) {
          // this.$set(this.target, keys[i], item[keys[i]])
          record[keys[i]] = item[keys[i]]
        }

        if (this.multiSelect) {
          console.log(target + ' appended with: ' + JSON.stringify(this.picked))

          if (target) {
            console.log('Add record: ' + JSON.stringify(record))
            this.$store.commit('squeezeHash', {key: target, record: record})
          }
          console.log(target + ' TARGET ->  ' + JSON.stringify(this.$store.getters.getHash(target)))
        } else {
          console.log('reset pick')
          this.$set(this.picked, 0, item)

          console.log('TARGET2 = ' + JSON.stringify(this.picked))
        }

        if (this.onPick) {
          console.log('onPick defined')
          this.onPick(this.picked)
        } else {
          console.log('no onpick for DG')
        }
        this.$store.getters.getHash('updates')

        return false
      }
    }

  }
</script>

<style scoped>
.ResultsGrid {
    width: 100%;
    border: 1px solid black;
    padding: 5px;
    background-color: lightgreen;
  }  

  .result-heading {
    text-align: center;
    background-color: #999;
    color: #fff;
  }
  
  .result-row {
    padding:10px;
  }

  .result-cell {
    padding:5px;
  }

  .GridHeader {
    text-align: center;
    background-color: darkgreen;
    color: white;
  }

  .GridHeader2 {
    text-align: center;
    background-color: #fCf;
  }

  .GridHeader3 {
    text-align: center;
    background-color: #ffC;
  }
</style>

