<!-- src/components/Login.vue -->

<template lang='pug'>
  span
    span.search-section
      h3(v-if="title") {{ title }}
      div(v-if='picked && picked.length && multiSelect')
        DataGrid(:data="picked" header='Selected' headerClass='GridHeader3' :deSelectable="true" :target="target" :addColumn="addAction" :multiSelect="multiSelect" :modalButton="modalButton" :modalTable="modalTable")
        hr
      span
        input.input-lg(:id='scope' v-model='searchString' name='searchString' :placeholder='prompt')
        span &nbsp;
        button.btn.btn-primary(@click.prevent="searchForIt") Search
        span &nbsp; &nbsp;
        button.btn.btn-primary(v-if="searchString" @click.prevent="clearList(1)") Clear Search
    span.results-section(v-if="1 || currentList.length || picked.length")
      DataGrid(:data="currentList" :noDataMsg="noDataMsg" :header="chooseTitle" :picked="picked" :multiSelect="multiSelect" :onPick="searchPick")
</template>

<script>
  import axios from 'axios'
  import cors from 'cors'
  import DataGrid from './DataGrid'

  // import store from './../myStore.js'

  // import { mapState } from 'vuex'

  export default {
    components: {
      DataGrid
    },
    data () {
      return {
        header: '',
        caseSensitive: false,
        show: [],
        searchString: '',
        selectOne: '',
        foundRecords: 0,
        corsOptions: {
          origin: true,
          methods: ['GET', 'POST'],
          credentials: true,
          maxAge: 3600
        },
        currentList: this.list[this.scope],
        searchStatus: this.status
      }
    },

    props: {
      title: {
        type: String
      },
      model: {
        type: String
      },
      fields: {
        type: Array
      },
      condition: {
        type: String
      },
      scope: {
        type: String
      },
      search: {
        type: Object
      },
      url: {
        type: String
      },
      method: {
        type: String
      },
      prompt: {
        type: String
      },
      searchParameter: {
        type: String
      },
      reference: {
        type: String,
        default: 'id'
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
      multiSelect: {
        type: Boolean,
        default: false
      },
      inputList: {
        type: Array,
        default () { return [] }
      },
      noDataMsg: {
        type: String
      },
      list: {
        type: Object,
        default () {
          var def = {}
          def[this.scope] = this.inputList
          return def
        }
      },
      picked: {
        type: Array,
        default () { return [] }
      },

      status: {
        type: String,
        default: 'pending'
      },
      addAction: {
        type: Object,
        default () { return {} }
      },
      modalButton: {
        type: String
      },
      modalTable: {
        type: String
      },
      onPick: {
        type: Function
      },
      testPick: {
        type: Function
      }
    },
    computed: {
      chooseTitle: function () {
        return 'Select ' + this.scope
      }
    },
    methods: {
      searchPick (data) {
        console.log('search pick')
        if (this.onPick) {
          this.onPick(data)
          this.clearList()
        } else { console.log('no onPick') }
      },
      deselect (id) {
        console.log('unselectOne' + '{scope: this.scope, id: id}')
      },
      searchForIt () {
        console.log('Search for ' + this.model + 'data containing...' + this.searchString)

        this.clearList()

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

          if (!newdata.length) {
            var msg = 'no ' + _this.scope + ' record(s) found matching \'' + _this.searchString + '\''
            _this.$store.commit('setError', {context: 'searching for ' + _this.scope, err: msg})
          }

          if (_this.multiSelect) {
            _this.clearList()
          }

          console.log(JSON.stringify(newdata))

          for (var i = 0; i < newdata.length; i++) {
            if (!_this.list[_this.scope]) {
              _this.list[_this.scope] = []
            }

            _this.list[_this.scope].push(newdata[i])
          }

          _this.searchStatus = 'found'

          console.log('set results: ' + JSON.stringify(newdata))
        })
        .catch(function (err) {
          // _this.$store.commit('increment')
          // _this.$store.commit('setSearchStatus', {scope: _this.scope, status: 'aborted'})
          console.log('set error...' + _this.$store.state.count)
          _this.$store.commit('increment')
          _this.$store.commit('setError', {context: 'searching for ' + _this.scope, err: err})
          console.log('axios error: ' + err)
        })
      },

      clearList (clearsearch) {
        var _this = this
        if (_this.list[_this.scope]) {
          var count = _this.list[_this.scope].length
          console.log('clear current list of ' + count)
          for (var j = 0; j < count; j++) {
            _this.$delete(_this.list[_this.scope], 0)
            console.log('clear ' + j)
          }
        }

        if (clearsearch) {
          _this.searchString = ''
        }
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
  .result-row {
    padding:10px;
  }
  .result-heading {
    text-align: center;
    background-color: #999;
    color: #fff;
  }

  .search-section {
  }
  .results-section {

  }

</style>

