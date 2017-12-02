<!-- src/components/Standard/SearchBlock.vue -->

<template lang='pug'>
  div  
    Messaging
    div(v-if="0 && loadStatus === 'pending'")
      b Loading...
      img(src="./../../assets/spinning_wheel.gif" style="height: 100px")
    div(v-else)
      span(v-if="errs && errs.length")
        ul
          li(v-for='err in errs')
            alert.alert-danger {{err}}
      h2(v-if="invalid && invalid.length") 
        div.alert.alert-danger Invalid search options:
          ul
            li(v-for='problem in invalid') {{problem}}
        hr
      span(v-if='multiSelect && picked && picked.length')
        DataGrid.results.overlay(:data="picked" header='Current Selection' headerClass='GridHeader3' :deSelectable="true" :options="data_options" :links="links")
        p &nbsp;
      span.search-overlay(v-if="globalSearch && 1")
        input.input-lg(:id='scope' v-model='searchString' name='searchString' :placeholder='prompt')
        span &nbsp;
        button.btn.btn-primary(@click.prevent="searchForIt") Search
        span &nbsp; &nbsp;
        button.btn.btn-primary(v-if="searchString" @click.prevent="clearList(1)") Clear Search
      
      span.search-overlay(v-if="1 && !globalSearch")
        span(v-if='1')
          div.search-section
            table.table
              tr
                th(v-for="field in fields")
                  b {{field}}
              tr
                td(v-for="field in fields")
                  input.input-lg(v-model="searchStrings[field]")
                  b = {{searchStrings[field]}} or {{search}}
            hr
            button.btn.btn-primary(@click.prevent="searchForIt") Search {{scope}} record(s)
            span &nbsp; &nbsp;
            button.btn.btn-primary(@click.prevent="clearList(1); openModal()") Clear Search
      span.results-section(v-if="currentList.length")
        DataGrid.results-table(:data="currentList" :target="target" :noDataMsg="search_options.noDataMsg" header="Selected" :picked="picked" :multiSelect="multiSelect" :onPick="pickMe" :options="data_options" :search_options="search_options" :links="links")
</template>

<script>
import axios from 'axios'
import cors from 'cors'

import Messaging from './Messaging'
// import DataGrid from './DataGrid'
import DataGrid from './DataGrid'

export default {
  name: 'searchBlock',
  components: {
    Messaging,
    // DataGrid,
    DataGrid
  },
  data () {
    return {
      loadStatus: 'pending',
      formData: {},
      generated: {
        body: ''
      },
      searchString: '',
      searchStrings: [],
      selectOne: '',
      foundRecords: 0,
      list: [],
      searchStatus: this.status,
      errs: [],

      corsOptions: {
        origin: true,
        methods: ['GET', 'POST'],
        credentials: true,
        maxAge: 3600
      },

      testData: [
        {name: 'Ran', email: 'ran.guin'},
        {name: 'Admin', email: 'admin@gmail.com'}
      ]
    }
  },
  props: {
    search_options: {
      type: Object
    },
    data_options: {
      type: Object
    },
    onPick: {
      type: Function
    },
    picked: {
      type: Array
    },
    links: {
      type: Object
    }
  },
  created: function () {
    // this.closeModal()
    this.status = 'loaded'
    console.log('body')

    var fields = this.search_options.search_fields

    if (fields && fields.length) {
      for (var i = 0; i < this.search_options.search_fields.length; i++) {
        var f = this.search_options.search_fields[i]
        this.searchStrings[f] = ''
      }
    }

    if (this.invalid) {
      console.log('validation failed:')
      console.log(this.invalid.join('; '))
    }
  },
  computed: {
    link_keys: function () {
      if (this.links && this.links.constructor === Object) {
        return Object.keys(this.links)
      } else {
        return ['no links']
      }
    },
    search_result_options: function () {
      if (this.search_options && this.search_options.search_fields) {
        var dataOptions = {}
        if (this.data_options) {
          dataOptions = this.data_options
        }
        // dataOptions.fields = this.search_options.search_fields
        return dataOptions
      } else {
        return this.data_options
      }
    },
    url: function () {
      return this.search_options.url
    },
    model: function () {
      return this.search_options.model
    },
    scope: function () {
      return this.search_options.scope
    },
    search: function () {
      return this.search_options.search
    },
    globalSearch: function () {
      return this.search_options.globalSearch || 1
    },
    fields: function () {
      return this.search_options.search_fields
    },
    multiSelect: function () {
      return this.search_options.multiSelect
    },
    target: function () {
      return this.search_options.target || {}
    },
    prompt: function () {
      return this.search_options.prompt || ' ? '
    },

    currentList: function () {
      return this.list
    },
    invalid: function () {
      var reqd = ['fields|field', 'scope', 'url']

      var fail = []
      if (this.search_options) {
        for (var i = 0; i < reqd.length; i++) {
          var req = reqd[i]
          var or = req.split('|')
          if (or.length > 1) {
            var ok = 0
            for (var j = 0; j < or.length; j++) {
              if (this.search_options[or[j]]) {
                ok++
                j = or.length
              }
            }
            if (!ok) {
              fail.push('require \'' + or.join("' OR '") + '\'')
            }
          } else {
            if (!this.search_options[or]) {
              fail.push('missing ' + or)
            }
          }
        }
      } else {
        fail.push('no search options')
      }
      return fail
    }
  },
  methods: {
    pickMe (record) {
      console.log('stall')
    },
    pickMe2 (record) {
      var target = this.search_options.target
      console.log('PICK ME NOW')
      if (this.search_options.multiSelect) {
        console.log(target + ' appended with: ' + JSON.stringify(record))

        if (target) {
          console.log(target + ' appended: ' + JSON.stringify(record))
          this.$store.commit('squeezeHash', {key: target, record: record})
        }
        console.log(JSON.stringify(this.$store.getters.getHash(target)))
      } else {
        console.log('reset pick')
        this.$set(this.picked, 0, record)
      }
      this.clearList()
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
    clearTarget (close) {
      if (this.target) {
        var keys = Object.keys(this.target)
        for (var j = 0; j < keys.length; j++) {
          this.$delete(this.target, keys[j])
        }
      } else { console.log('target already empty') }

      if (close) {
        this.closeModal()
      }
    },
    pickTarget (data) {
      console.log('picked ' + this.title)
      console.log(JSON.stringify(data))
      console.log(JSON.stringify(this.target))

      var keys = Object.keys(data[0])
      for (var i = 0; i < keys.length; i++) {
        this.$set(this.target, keys[i], data[0][keys[i]])
        console.log('set target ' + keys[i] + ' to ' + data[0][keys[i]])
      }

      if (!this.search_options.multiSelect) {
        this.closeModal()
      }

      this.picked.push(this.target)

      console.log('Picked: ' + JSON.stringify(this.target))
      console.log('List: ' + JSON.stringify(this.picked))
    },
    searchForIt () {
      console.log('Search for ' + this.model + ' data containing...' + this.searchString)
      console.log('via url: ' + this.url)

      this.clearList()
      var orConditions = []
      var andConditions = []
      // var fields = []

      var conditions = this.conditions || [1]
      // var table = this.model

      var data = cors(this.corsOptions)
      console.log('CORS: ' + JSON.stringify(cors))

      data = null

      var fullUrl = this.url || ''
      var tagtest = /<(.+)>/
      var tags = fullUrl.match(tagtest)

      var method = this.search_options.method || 'post'

      console.log('options: ' + JSON.stringify(this.search_options))

      if (this.search_options.search_fields && this.searchString) {
        method = 'get'
        var fields = this.search_options.search_fields || []
        // global search
        console.log(this.search_options.search_fields + ' = ' + this.searchString)
        if (tags && tags.length) {
          var tag = new RegExp('<' + tags[1] + '>')
          fullUrl = fullUrl.replace(tag, this.searchString)
          console.log('replaced ' + tag + ' tag with ' + this.searchString)
        } else if (fields.length === 1) {
          fullUrl += '&' + this.search_options.search_field + '=' + this.searchString
          console.log('extend url: ' + fullUrl)
        } else {
          console.log('check ' + fields.length + fields)
          for (var i = 0; i < fields.length; i++) {
            orConditions.push(fields[i] + ' LIKE "%' + this.searchString + '%"')
            console.log(' .. or ' + fields[i] + ' containing ' + this.searchString)
          }
          method = 'post'
        }
      } else if (!this.globalSearch && this.searchStrings) {
        // fields specific search
        var check = Object.keys(this.searchStrings)
        for (var j = 0; j < check.length; j++) {
          var test = this.searchStrings[check[j]]
          if (test) {
            andConditions.push(check[j] + ' LIKE \'' + test + '%\'')
            console.log(' .. and ' + check[j] + ' like ' + test)

            if (tags && tags.length) {
              console.log('replace ' + tags.length + ' tags')
              for (var t = 1; t < tags.length; t++) {
                console.log(tags[t] + ' vs ' + check[j])
                if (tags[t] === check[j]) {
                  var thistag = new RegExp('<' + check[j] + '>')
                  fullUrl = fullUrl.replace(thistag, test)
                  console.log('replaced ' + thistag + ' tag with ' + test)
                }
              }
            } else {
              fullUrl += '&' + check[j] + '=' + test
            }
          }
        }
        method = 'get'
      } else {
        console.log('no search criteria')
        console.log('global: ' + this.globalSearch)
        console.log('search 1: ' + this.searchString + ' in ' + this.search_options.search_field)
        console.log('searcn N: ' + JSON.stringify(this.searchStrings))
      }

      console.log('method = ' + method)

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
      console.log('data: ' + JSON.stringify(data))

      var _this = this
      axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

      axios({url: fullUrl, method: method, data: data})
      .then(function (result, err) {
        console.log('axios returned value(s): ' + JSON.stringify(result))

        if (err) {
          console.log('axios call error')
        }

        var newdata = {}
        var model = _this.search_options.model || _this.scope

        console.log('got results for ' + _this.scope + ' : ' + model)

        if (model && result.data[model]) {
          console.log('found ' + model + ' results ')
          newdata = result.data[model]
        } else {
          console.log('generic results=')
          newdata = result.data
        }

        if (result.data && result.data.error) {
          _this.$store.commit('setError', {context: 'remote searching ' + _this.scope, err: result.data.error})
        } else if (!newdata.length) {
          var msg = 'no ' + _this.scope + ' record(s) found matching \'' + _this.searchString + '\''
          _this.$store.commit('setError', {context: 'Searching for ' + _this.scope, err: msg})
        }

        if (_this.multiSelect) {
          _this.clearList()
        }

        console.log(JSON.stringify(newdata))

        for (var i = 0; i < newdata.length; i++) {
          if (!_this.list) {
            _this.list = []
          }

          _this.list.push(newdata[i])
        }

        _this.searchStatus = 'found'

        console.log('set results: ' + JSON.stringify(newdata))
        console.log('LIST: ' + JSON.stringify(_this.list))
      })
      .catch(function (err) {
        // _this.$store.commit('increment')
        // _this.$store.commit('setSearchStatus', {scope: _this.scope, status: 'aborted'})
        console.log('set error...' + _this.$store.state.count)
        _this.$store.commit('increment')
        _this.$store.commit('setError', {context: 'Searching For ' + _this.scope, err: err})
        console.log('axios error: ' + err)
      })
    },

    clearList (clearsearch, close) {
      var _this = this
      if (_this.list) {
        var count = _this.list.length
        console.log('clear current list of ' + count)
        for (var j = 0; j < count; j++) {
          _this.$delete(_this.list, 0)
        }
      }

      if (clearsearch) {
        if (this.globalSearch) {
          console.log('global clear')
          _this.searchString = ''
        } else {
          for (var i = 0; i < this.fields.length; i++) {
            this.$delete(this.searchStrings, this.fields[i])
          }
        }
      }

      if (close) {
        _this.closeModal()
      }
    }
  }
}
</script>

<style>

</style>
