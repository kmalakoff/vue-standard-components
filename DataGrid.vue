<!-- src/components/Login.vue -->

<template lang='pug'>
  div.data-grid
    table.ResultsGrid(v-if='data && data.length')
      thead
        tr(v-show="header && data && data.length")
          td(:class="headerClass" :colspan="columns")
            b {{header}}
        tr
          th.result-heading(v-for="val, key in data[0]")
            span {{key}}
          th.result-heading(v-if="deSelectable") Remove
          th.result-heading(v-if="addLinks" v-for="func, key in addLinks")
            span &nbsp; 
          
      tbody
        tr.result-row(v-for="record, index in data")
          td.result-cell(v-for="val, key in record")
            a(href='#' onclick='return false;' data-html='true' data-model={model} data-attribute={key} v-on:click="pickOne(index)") {{val}}
          td.result-cell(v-if="deSelectable") 
            button.btn.btn-xs.btn-danger(v-on:click="data.splice(index,1)") X 
          th.result-heading(v-if="addLinks" v-for="link in addLinks")
              ActionButton(:name="link.name" :type="link.type" :modal="link.modal" :record="data[index]" :link="link")
    div(v-if='!data || !data.length')
      table(align='center' v-if='noDataMsg') 
        tr
          td {{noDataMsg}}
</template>

<script>
  // import { mapState } from 'vuex'

  import ActionButton from './ActionButton.vue'
  import dbRecordModal from './dbRecordModal.vue'

  export default {
    components: {
      ActionButton,
      dbRecordModal
    },
    data () {
      return {
        showModal: false
      }
    },

    props: {
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
      target: {
        type: Object,
        default () {
          return {
            name: '',
            id: 0
          }
        }
      },
      noDataMsg: {
        type: String,
        default: ''
      },
      picked: {
        type: Array,
        default () { return [] }
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
      modalButton: {
        type: String
      },
      modalTable: {
        type: String
      },
      modalURL: {
        type: String
      },
      addLinks: {
        type: Array
      }
    },

    computed: {
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

        console.log('data: ' + JSON.stringify(this.data))
        var item = this.data[index]
        console.log('item: ' + JSON.stringify(item))

        if (this.multiSelect) {
          this.picked.push(item)
        } else {
          console.log('reset pick')
          this.$set(this.picked, 0, item)
        }

        console.log('pick = ' + this.onPick)
        if (this.onPick) {
          this.onPick(this.picked)
        } else {
          console.log('no onpick for DG')
        }

        return false
      }
    }

  }
</script>

<style scoped>
.ResultsGrid {
    width: 80%;
    margin-left: 10%;
    margin-right: 10%;
    margin-top: 40px;
    border: 1px solid black;
    padding: 10px;
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
    background-color: #Cff;
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

