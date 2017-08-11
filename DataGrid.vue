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
          th.result-heading(v-if="addColumn" v-for="func, key in addColumn")
            b {{ key }} 
          
      tbody
        tr.result-row(v-for="record, index in data")
          td.result-cell(v-for="val, key in record")
            a(href='#' onclick='return false;' data-html='true' data-model={model} data-attribute={key} v-on:click="onPick(index)") {{val}}
          td.result-cell(v-if="deSelectable") 
            button.btn.btn-xs.btn-danger(v-on:click="data.splice(index,1)") X
          th.result-heading(v-if="addColumn" v-for="func, key in addColumn")
            ActionButton(:buttonAction="func" :buttonName="key" :record="data[index]")
    div(v-if='!data || !data.length')
      table(align='center' v-if='noDataMsg') 
        tr
          td {{noDataMsg}}
</template>

<script>
  import axios from 'axios'
  import cors from 'cors'
  // import { mapState } from 'vuex'

  import ActionButton from './ActionButton.vue'

  export default {
    components: {
      ActionButton
    },
    data () {
      return {
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
      noDataMsg: {
        type: String,
        default: ''
      },
      picked: {
        type: Array,
        default () { return [] }
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
      }
    },

    computed: {
      columns: function () {
        var count = 1

        if (this.data && this.data.length) {
          count += Object.keys(this.data[0]).length
        }

        if (this.addColumn) {
          count += Object.keys(this.addColumn).length
        }

        return count
      }
    },

    methods: {
      onSelect (index) {
        console.log('picked ' + index)
        if (this.onPick) {
          this.onPick(index)
        }
      },
      searchForIt () {
        console.log('Search for data containing...' + this.searchString)

        var data = cors(this.corsOptions)
        console.log('CORS: ' + JSON.stringify(cors))

        data = null

        var fullUrl = this.url

        if (this.searchParameter && this.searchString) {
          console.log(this.searchParameter + ' = ' + this.searchString)
          fullUrl += '&' + this.searchParameter + '=' + this.searchString
        }

        var method = this.method || 'post'
        console.log('method = ' + method)

        if (method === 'post') {
          data = {}

          data.scope = this.search
          var conditions = this.conditions || [1]

          var searchConditions = []

          var fields = []
          if (this.search && this.model && this.search[this.model]) {
            fields = this.search[this.model]
          } else {
            fields = this.fields || []
          }
          console.log('got fields: ' + fields + ' from ' + JSON.stringify(this.search) + ' && ' + this.scope)

          for (var i = 0; i < fields.length; i++) {
            searchConditions.push(fields[i] + ' LIKE "%' + this.searchString + '%"')
            console.log('include ' + fields[i])
          }

          var addCondition
          if (searchConditions.length) {
            console.log('add ' + searchConditions.length + ' conditions')
            addCondition = '(' + searchConditions.join(' OR ') + ')'
          }

          var allConditions = conditions.join(' AND ')
          if (addCondition) { allConditions += ' AND ' + addCondition }

          data.condition = allConditions
        }

        console.log('axios ' + method + ': ' + fullUrl)
        console.log('data: ' + JSON.stringify(data))

        var _this = this
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

        axios({url: fullUrl, method: method, data: data})
        .then(function (result, err) {
          console.log('axios returned value(s): ' + JSON.stringify(result))
          if (err) {
            console.log('axios call error')
          }
          console.log('got results for ' + _this.model)

          var newdata = {}
          if (_this.model && result.data[_this.model]) {
            newdata = result.data[_this.model]
          } else {
            newdata = result.data
          }

          if (_this.multiSelect) {
            _this.clearList()
          }

          console.log(JSON.stringify(newdata))

          for (var i = 0; i < newdata.length; i++) {
            _this.list[_this.scope].push(newdata[i])
          }

          _this.searchStatus = 'found'

          console.log('set results: ' + JSON.stringify(newdata))
        })
        .catch(function (err) {
          // _this.$store.commit('setSearchStatus', {scope: _this.scope, status: 'aborted'})
          console.log('set error...')
          // _this.$store.commit('setError', {context: 'searching for ' + _this.scope, err: err})
          console.log('axios error: ' + err)
        })
      },

      clearList () {
        var _this = this
        if (_this.list[_this.scope]) {
          var count = _this.list[_this.scope].length
          console.log('clear current list of ' + count)
          for (var j = 0; j < count; j++) {
            _this.$delete(_this.list[_this.scope], 0)
            console.log('clear ' + j)
          }
        }
      },

      onPick (index) {
        console.log('pick ' + index)
        console.log('MS ? ' + this.multiSelect)

        console.log('data: ' + JSON.stringify(this.data))
        var item = this.data[index]
        console.log('item: ' + JSON.stringify(item))

        if (this.multiSelect) {
          console.log('pickit')
          this.picked.push(item)
        } else {
          console.log('nopick')
          this.$set(this.picked, 0, item)
        }
        console.log('Picked: ' + JSON.stringify(this.picked))
        console.log(JSON.stringify(item))
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

