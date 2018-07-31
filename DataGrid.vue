<!-- src/components/Login.vue -->

<!--
Usage:

  DataGrid(:data="data" :type="link.type" :modal="link.modal" :record="data[index]" :link="link")

Input:

  name - name of modal (should be distinct if multiple modals used)
  type - button / modal

Advanced Options:

  record - data record to pass to modal for secondary action
-->

<template lang='pug'>
  div.data-grid
    table.table-bordered.ResultsGrid(v-if='dynamicData && dynamicData.length')
      thead
        tr(v-show="data_header")
          td(:class="headerClass" :colspan="columns")
            b {{data_header}}
      tr.dataHeader(v-if="options.listBy === 'column'")
        <!-- Put Records in Columns -->
        th.result-heading Field
        th.result-heading Value
      tr.dataHeader(v-else)
        <!-- Put Records in Rows -->
        th.result-heading(v-for="key in data_fields")
          span {{key}}
        th.result-heading(v-if="deSelectable") Remove
        th.result-heading(v-if="options && options.addLinks" v-for="func, key in options.addLinks")
          span &nbsp; <!-- add empty column headers -->
      tbody.dataBody(v-if="options.listBy === 'column'")
        <!-- Put Records in Columns -->
        tr.result-row(v-for="key in data_fields")
          td.result-prompt {{key}}: &nbsp;
          td.result-cell(:class="dynamicClass(record)" v-for="record, index in dynamicData")
            a(href='#' onclick='return false;' data-html='true' data-model={model} data-attribute={key} @click.prevent="pickOne(index)") {{record[key]}}

        tr.result-cell(v-if="deSelectable")
          td Remove
          td button.btn.btn-xs.btn-danger(v-on:click="remove(index)") x {{index}}
        tr.result-cell(v-if="options && options.addLinks" v-for="link in options.addLinks")
          td &nbsp;
          td
            span(v-if="link.type === 'button'")
              ActionButton(:name="link.name" :type="link.type" :modal="link.modal" :record="dynamicData[index]" :link="link" :links="links")
            span(v-if="link.type === 'icon'")
              span(v-if="link.modal")
                a(href="#" onclick='return false' @click.prevent="link.modal.onPick(record)" :record="dynamicData[index]")
                  icon(:name='link.name' :color='link.colour' :scale='link.scale')
              span(v-else)
                icon(:name='link.name' :color='link.colour' :scale='link.scale')
      tbody.dataBody(v-else)
        <!-- Put Records in Rows -->
        tr.result-row(:class="dynamicClass(record)" v-for="record, index in dynamicData")
          td.result-cell(v-for="key in data_fields")
            a(href='#' onclick='return false;' data-html='true' data-model={model} data-attribute={key} @click.prevent="pickOne(index)") {{record[key]}}
          td.result-cell(v-if="deSelectable")
            button.btn.btn-xs.btn-danger(v-on:click="remove(index)") x {{index}}
          td.result-cell(v-if="options && options.addLinks" v-for="link in options.addLinks")
            span(v-if="link.type === 'button'")
              ActionButton(:name="link.name" :type="link.type" :modal="link.modal" :record="dynamicData[index]" :link="link" :links="links")
            span(v-if="link.type === 'icon'")
              span(v-if="link.modal")
                a(href="#" onclick='return false' @click.prevent="link.modal.onPick(record)" :record="dynamicData[index]")
                  icon(:name='link.name' :color='link.colour' :scale='link.scale')
              span(v-else)
                icon(:name='link.name' :color='link.colour' :scale='link.scale')

    div(v-if='!dynamicData || !dynamicData.length')
      table(align='center' v-if='noDataMsg')
        tr
          td {{noDataMsg}}
</template>

<script>
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
        default () { return {} }
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
      },
      baseClass: {
        type: String
      },
      fieldClass: {
        type: String
      }
    },
    created: function () {
      console.log('created DataGrid...')
      // this.metaData = this.data // Slightly dangerous !? This is a reference equation so the original data is changed ? (ie not a clone)
      if (this.stored) { console.log('stored DataGrid') }
    },
    computed: {
      dynamicData: function () {
        if (this.data) {
          console.log('got defined data: ' + JSON.stringify(this.data))
          return this.data
        } else if (this.stored) {
          var storedData = this.$store.getters.getHash(this.stored)
          console.log('dynamically loaded: ' + JSON.stringify(storedData))
          return storedData || []
        } else {
          console.log('no data supplied for DataGrid')
          return []
        }
      },
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
      stored: function () {
        if (this.options && this.options.stored) {
          return this.options.stored
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
      remove (index) {
        console.log('remove item #' + index)
        console.log(JSON.stringify(this.data))
        // this.data.splice(index, 1)
        // console.log(JSON.stringify(this.data))

        // this.$store.commit('removeHashItem', {key: this.stored, index: index})

        if (this.onDelete) {
          this.onDelete(index)
        } else if (this.options.onDelete) {
          this.options.onDelete(index)
        } else {
          console.log('requires onDelete function specification')
        }

        // this.$store.getters.getHash('updates')
      },
      pickOne (index) {
        console.log('pick ' + index)
        console.log('MS ? ' + this.multiSelect)

        console.log('picked: ' + JSON.stringify(this.picked))
        console.log('data: ' + JSON.stringify(this.data))
        var item = this.data[index]
        console.log('item: ' + JSON.stringify(item))
        console.log('options: ' + JSON.stringify(this.options))

        // var target = this.options.target

        var record = {}
        var keys = Object.keys(item)
        for (var i = 0; i < keys.length; i++) {
          // this.$set(this.target, keys[i], item[keys[i]])
          record[keys[i]] = item[keys[i]]
        }

        if (this.multiSelect) {
          console.log(this.target + ' data appended with: ' + JSON.stringify(this.picked))

          if (this.stored) {
            console.log('DYNO - Add record: ' + JSON.stringify(record))
            this.$store.commit('squeezeHash', {key: this.stored, record: record})
          }
          console.log('target ? ' + this.target)
          console.log(this.stored + ' TARGET ->  ' + JSON.stringify(this.$store.getters.getHash(this.stored)))
        } else {
          console.log('reset pick')
          this.$set(this.picked, 0, item)
          console.log('TARGET2 = ' + JSON.stringify(this.picked))
        }

        // if (this.onPick) {
        //   console.log('onPick defined')
        //   this.onPick(this.picked)
        // } else {
        //   console.log('no onpick for DG')
        // }
        this.$store.getters.getHash('updates')

        return false
      },
      dynamicClass: function (record) {
        // enables control of class for highlighting or hiding records based on specific field values ...
        if (this.options && this.options.fieldClass && record[this.options.fieldClass]) {
          return this.options.baseClass + ' ' + record[this.options.fieldClass]
        } else if (this.options && this.options.baseClass) {
          return this.options.baseClass
        } else {
          return ''
        }
      }
    }
  }
</script>

<style scoped>

.ResultsGrid {
    width: 100%;
    border: 1px solid black;
    padding: 5px;
    /*background-color: lightgreen;*/
  }

  .result-heading {
    text-align: center;
    background-color: #999;
    color: #fff;
  }

  .result-prompt {
    text-align: right;
    background-color: #eee;
    color: #000;
  }

  .result-row {
    padding:10px;
  }

  .result-cell {
    padding:5px;
    vertical-align: top;
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
