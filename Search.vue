<!-- src/components/Login.vue -->

<template lang='pug'>
  span
    span.pre-search-section
      span(v-if='target && target.id')
        button.btn.btn-sm(v-if='tooltip' v-tooltip="{html: tipID}")
          b  {{target.name }} [{{target.id}}]
        span(:id="tipID" v-html="tooltip")
        span &nbsp;
        button.btn.btn-primary(v-if="!isOpen" v-on:click="clearTarget; searchOpen=true") change {{title}}
      span(v-else)
        span(v-if="!isOpen")
          button.btn.btn-primary(v-on:click="searchOpen=true") Load {{title}}
      span.search-section
        div(v-if='picked && picked.length && multiSelect')
          DataGrid.search-grid(:data="picked" header='Selected' headerClass='GridHeader3' :deSelectable="true" :target="target" :addLinks="addLinks" :multiSelect="multiSelect")
          hr
        span()
          span(v-if="globalSearch && isOpen")
            input.input-lg(:id='scope' v-model='searchString' name='searchString' :placeholder='prompt')
            span &nbsp;
            button.btn.btn-primary(@click.prevent="searchForIt") Search
            span &nbsp; &nbsp;
            button.btn.btn-primary(v-if="searchString" @click.prevent="clearList(1)") Clear Search
          span(v-if="!globalSearch")
            span(v-if='isOpen')
              div.search-section
                table.table
                  tr
                    th(v-for="field in fields")
                      b {{field}}
                  tr
                    td(v-for="field in fields")
                      input.input-lg(v-model="searchStrings[field]")
                hr
                button.btn.btn-primary(@click.prevent="searchForIt") Search {{scope}} record(s)
                span &nbsp; &nbsp;
                button.btn.btn-primary(@click.prevent="clearList(1); openSearch") Clear Search
    span.results-section(v-if="1 || currentList.length || picked.length")
      DataGrid.search-grid(:data="currentList" :noDataMsg="noDataMsg" :header="chooseTitle" :picked="picked" :multiSelect="multiSelect" :onPick="searchPick")
</template>

<script>
  import axios from 'axios'
  import cors from 'cors'
  import DataGrid from './DataGrid'
  /* Usage example:

      Search(:id='sampleString' model='sample' title='Schedule Immunizations' scope='sample' method='get' url='https://vids-siv.phac-aspc.gc.ca/api/sample.php?' searchParameter='product_name' prompt='Search Disease/Vaccines' :multiSelect="true" :addLinks="addLinks")

  Optional Properties of 'addLinks':
    name: name of button to link to function or modal generation
    function: optional function called when button (labelled with name above) is clicked

    modal: generates modal when button is clicked, with additional options eg modal: { button: 'Register', function: 'RegisterMe' }
    {
      button - button name within modal
      function - function to execute if button pressed
      close - label for 'Close/Cancel' button on footer of modal
      url - url used to generate content
        * if json is retrieved, it MUST be a form descriptor with fields, field_types...
        * otherwise, modal simply displays string returned as the modal body.
      urlData - optional data to include in url post call above (may include record data when fields surrounded by tags - eg {id: '<xid>'}
    }

    function: function
  */
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
        searchStrings: [],
        selectOne: '',
        foundRecords: 0,
        corsOptions: {
          origin: true,
          methods: ['GET', 'POST'],
          credentials: true,
          maxAge: 3600
        },
        currentList: this.list[this.scope],
        searchStatus: this.status,
        searchOpen: false
      }
    },

    props: {
      globalSearch: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: 'item'
      },
      model: {
        type: String
      },
      tables: {
        type: Array
      },
      conditions: {
        type: Array
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
        type: Object
      },
      targets: {
        type: Array
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
      onPick: {
        type: Function
      },
      addLinks: {
        type: Array
      },
      onClear: {
        type: Function
      },
      tooltip: {
        type: String
      }
    },
    computed: {
      tooltip_link: function () {
        return '{html:' + this.tipID + '}'
      },
      tipID: function () {
        return 'searchTipFor' + this.title
      },
      chooseTitle: function () {
        return 'Select ' + this.scope
      },
      isOpen: function () {
        return this.searchOpen
      }
    },
    methods: {
      openSearch (data) {
        this.searchOpen = true
      },
      searchPick (data) {
        console.log('search pick')
        if (this.pickTarget) {
          this.pickTarget(data)
          this.clearList()
        } else { console.log('no onPick') }
      },
      deselect (id) {
        console.log('unselectOne' + '{scope: this.scope, id: id}')
      },
      clearTarget () {
        if (this.target) {
          var keys = Object.keys(this.target)
          for (var j = 0; j < keys.length; j++) {
            this.$delete(this.target, keys[j])
          }
        } else { console.log('target already empty') }
      },
      pickTarget (data) {
        console.log('set ' + this.title)
        console.log(JSON.stringify(data))

        var keys = Object.keys(data[0])
        for (var i = 0; i < keys.length; i++) {
          this.$set(this.target, keys[i], data[0][keys[i]])
          console.log('set target ' + keys[i] + ' to ' + data[0][keys[i]])
        }
        this.searchOpen = false
        console.log(JSON.stringify(this.target))
      },
      searchForIt () {
        console.log('Search for ' + this.model + ' data containing...' + this.searchString)
        console.log('in ' + this.url)

        this.clearList()
        var orConditions = []
        var andConditions = []
        var fields = []

        var conditions = this.conditions || [1]
        var table = this.model

        if (this.search && table && this.search[table]) {
          fields = this.search[table]
        } else {
          fields = this.fields || []
        }
        console.log('got fields: ' + fields + ' from ' + JSON.stringify(this.search) + ' && ' + this.scope)

        var data = cors(this.corsOptions)
        console.log('CORS: ' + JSON.stringify(cors))

        data = null

        var fullUrl = this.url

        if (this.searchParameter && this.searchString) {
          // global search
          console.log(this.searchParameter + ' = ' + this.searchString)
          fullUrl += '&' + this.searchParameter + '=' + this.searchString

          for (var i = 0; i < fields.length; i++) {
            orConditions.push(fields[i] + ' LIKE "%' + this.searchString + '%"')
            console.log('include ' + fields[i])
          }
        } else if (!this.globalSearch && this.searchStrings) {
          // fields specific search
          var check = Object.keys(this.searchStrings)
          for (var j = 0; j < check.length; j++) {
            var test = this.searchStrings[check[j]]
            console.log('look for ' + check[j] + ' like ' + test)
            andConditions.push(check[j] + ' LIKE \'' + test + '%\'')
          }
        }

        var method = this.method || 'post'
        console.log('search method = ' + method)

        if (method === 'post') {
          data = {}

          data.scope = this.search

          var addCondition
          if (orConditions.length) {
            console.log('add ' + orConditions.length + ' OR conditions')
            addCondition = '(' + orConditions.join(' OR ') + ')'
          }

          if (andConditions.length) {
            console.log('add ' + andConditions.length + ' AND conditions')
            addCondition = '(' + andConditions.join(' AND ') + ')'
          }

          var allConditions = conditions.join(' AND ')
          if (addCondition) { allConditions += ' AND ' + addCondition }

          data.condition = allConditions
        }

        console.log('axios ' + method + ': ' + fullUrl)
        console.log('search data: ' + JSON.stringify(data))

        var _this = this
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

        axios({url: fullUrl, method: method, data: data})
        .then(function (result, err) {
          console.log('axios returned value(s): ' + JSON.stringify(result))
          if (err) {
            console.log('axios call error')
          }
          console.log('got results for ' + table)

          var newdata = {}
          if (table && result.data[table]) {
            newdata = result.data[table]
          } else {
            newdata = result.data
          }

          if (!newdata.length) {
            var msg = 'no ' + _this.scope + ' record(s) found matching: \'' + _this.searchString + '\''
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

        this.searchOpen = false

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
    /*background-color: #cdd;*/
    padding: 5px;
  }
  .results-section {

  }

  .tooltip {
    .tooltip-inner {
      background-color: #faa !important;
    }
  }

</style>

