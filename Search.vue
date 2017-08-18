<!-- src/components/Login.vue -->

<template lang='pug'>
  div
    div.search-section
      div(v-if="title") {{ title }}
      input.input-lg(:id='scope' v-model='searchString' name='searchString' :placeholder='prompt')
      span &nbsp;
      button.btn.btn-primary(@click.prevent="searchForIt") Search
      span &nbsp; &nbsp;
      button.btn.btn-primary(@click.prevent="clearList()") Clear Search
    div.results-section
      DataGrid(:data="currentList" :noDataMsg="noDataMsg" header='Search' :picked="picked" :multiSelect="multiSelect")
      hr
      div(v-if='picked && picked.length')
        DataGrid(:data="picked" header='Selected' headerClass='GridHeader3' :deSelectable="true" :addColumn="addAction" :multiSelect="multiSelect" :modalButton="modalButton")
</template>

<script>
  import axios from 'axios'
  import cors from 'cors'
  // import { mapState } from 'vuex'
  import DataGrid from './DataGrid'

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
      }
    },

    computed: {
    },

    methods: {
      deselect (id) {
        console.log('unselectOne' + '{scope: this.scope, id: id}')
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

        var item = this.list[this.scope][index]
        if (this.multiSelect) {
          this.picked.push(item)
        } else {
          this.$set(this.picked, 0, item)
        }
        console.log('Picked: ' + JSON.stringify(this.picked) + ' = ' + JSON.stringify(this.list))
        console.log(JSON.stringify(item))
        return false
      },

      onSelect (evt) {
        // id, name, record) {

        var picked = {}

        if (evt && evt.target) {
          picked = evt.target
          console.log('Picked: ' + picked.id + ' : ' + picked.name)
        }

        this.selectOne.id = picked.id
        this.selectOne.name = picked.name
        this.selectOne.label = {}
        this.selectOne.status = 'picked'
        this.selectOne.subject = { id: picked.id, name: picked.name }

        console.log('Call ? ' + this.onPick)
        if (this.onPick) {
          this.onPick(evt)
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

