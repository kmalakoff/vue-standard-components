
<template id="modal-template" lang='pug'>
  span
    span(v-if="visible")
      transition(:name="name") 
        div.modal-mask
          div.modal-wrapper
            div.modal-container
              div.modal-header
                slot(name="header")
                  div(v-if="myheader")
                    h2 {{myheader}}
 
              div.modal-body
                slot(name="body")
                  div(v-if="1")
                    slot(name="body")
                      div.modal-body()
                        Messaging
                        hr
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
                          DataGrid.results.overlay(:data="picked" header='Current Selection' headerClass='GridHeader3' :deSelectable="true")
                          p &nbsp;
                        span.search-overlay(v-if="globalSearch && visible")
                          input.input-lg(:id='scope' v-model='searchString' name='searchString' :placeholder='prompt')
                          span &nbsp;
                          button.btn.btn-primary(@click.prevent="searchForIt") Search
                          span &nbsp; &nbsp;
                          button.btn.btn-primary(v-if="searchString" @click.prevent="clearList(1)") Clear Search
                        span.search-overlay(v-if="visible && !globalSearch")
                          span(v-if='visible')
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
                              button.btn.btn-primary(@click.prevent="clearList(1); showMe()") Clear Search
                        span.results-section(v-if="currentList.length")
                          DataGrid.results-table(:data="currentList" :target="target" :noDataMsg="search_options.noDataMsg" :header="chooseTitle" :picked="picked" :multiSelect="multiSelect" :onPick="onPick")

                      div(v-show="loadStatus !== 'loaded'")
                        b Loading...
                        img(src="./../../assets/spinning_wheel.gif" style="height: 100px")

              div.modal-footer
                slot(name="footer")
                  b {{footer}}
                  button.btn.btn-danger(@click="closeModal()") {{close}}
    span(v-if="!visible && openButton")
      span(v-if='picked && picked.length')
        span &nbsp; 
        button.btn.btn-primary(v-if="!visible" v-on:click="clearTarget; showMe()") change {{search_options.scope}}
      span(v-else)
        button.btn.btn-primary(v-on:click="showMe()") {{openButton}}
      <!-- button.modal-btn(:class='buttonClass' id="show-modal" @click="showMe()") {{buttonName}} -->

</template>


<script>
  import axios from 'axios'
  import cors from 'cors'

  import config from '@/config.js'
  import DataGrid from './DataGrid'
  import Messaging from './Messaging.vue'

  /*

  Usage:

  div(v-if='modal')
        div(v-if="showModal")
          Modal(v-if="showModal" @close="hideM" :name="name")
        div(v-else)
          button.btn.btn-success(id="show-modal" @click.prevent="showM") {{name}}
      div(v-else)
        button.btn.btn-success(@click.prevent="runEvent()") {{name}}

  Input:
    name - name of modal (should be distinct if multiple modals used)

  Advanced Options:

    record - data record to pass to modal for secondary action
    table - table to autoload fields for (allows for easy generation of modal for adding / editing database records in a table)
    button - name of button for secondary action
    function - function to execute upon clicking of button above
    url - url to generate content of modal
    urlData - data to pass to url (post) (may include tags replaced by record data ( eg urlData = {id: '<foundId>'} where the record supplied includes the 'foundId' attribute))

  */

  export default {
    components: {
      DataGrid,
      Messaging
    },
    data () {
      return {
        timeoutID: 0,
        showModal: false,
        status: 'pending',
        formData: {},
        generated: {
          body: ''
        },
        dbURL: config.dbURL,
        isVisible: false,

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
        list: [],
        searchStatus: this.status,
        errs: []
      }
    },
    props: {
      toggle: {
        type: Boolean,
        default: false
      },
      search_options: {
        type: Object,
        default () { return {} }
      },
      name: {
        type: String,
        default: 'modal'
      },
      openButton: {
        type: String,
        default: ''
      },
      buttonClass: {
        type: String,
        default: 'btn btn-primary'
      },
      title: {
        type: String,
        default: ''
      },
      table: {
        type: String
      },
      prompt: {
        type: String
      },
      type: {
        type: String
      },
      header: {
        type: String,
        default: ''
      },
      body: {
        type: String,
        default: 'default body'
      },
      footer: {
        type: String,
        default: ''
      },
      button: {
        type: String
      },
      action: {
        type: Function
      },
      urlData: {
        type: Object
      },
      function: {
        type: Function
      },
      close: {
        type: String,
        default: 'Cancel'
      },
      record: {
        type: Object
      },
      picked: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      loadStatus: function () {
        return this.status
      },

      url: function () {
        return this.search_options.url
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
        return this.search_options.fields
      },
      multiSelect: function () {
        return this.search_options.multiSelect
      },
      target: function () {
        return this.search_options.target || {}
      },
      chooseTitle: function () {
        return 'Click on record to select ' + this.scope
      },
      currentList: function () {
        return this.list
      },

      myheader: function () {
        if (this.search_options.title) {
          return this.search_options.title
        } else if (this.header) {
          return this.header
        } else if (this.title) {
          return this.title
        } else if (this.table) {
          return this.table
        } else {
          return 'default'
        }
      },
      closeButton: function () {
        if (this.close) {
          return this.close
        } else {
          return 'Cancel'
        }
      },
      modalBody: function () {
        if (this.generated && this.generated.body) {
          return this.generated.body
        } else if (this.body) {
          return this.body
        }
      },
      visible: function () {
        if (!this.toggle !== !this.isVisible) {
          return true
        } else {
          return false
        }
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
    created: function () {
      this.status = 'loaded'
      console.log('body')

      var fields = this.search_options.fields

      if (fields && fields.length) {
        for (var i = 0; i < this.search_options.fields.length; i++) {
          var f = this.search_options.fields[i]
          this.searchStrings[f] = ''
        }
      }

      if (this.invalid) {
        console.log('validation failed:')
        console.log(this.invalid.join('; '))
      }
    },
    methods: {
      showMe () {
        this.isVisible = !this.toggle

        clearTimeout(this.timeoutID)
      },
      onPick (data) {
        if (this.search_options.onPick) {
          this.search_options.onPick(data)
        }

        this.clearList(true, true)
      },
      modalClick (data) {
        console.log('Form: ' + JSON.stringify(this.formData))
        if (this.function) {
          this.function()
        }
      },
      oNotification () {
        console.log('on')
      },
      closeModal: function () {
        console.log('close modal...')
        this.isVisible = this.toggle
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
        console.log('or ' + this.searchStrings.name + ' or ' + this.searchStrings.email)
        console.log('via url: ' + this.url)

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

        var fullUrl = this.url || ''
        var tagtest = /<(.+)>/
        var tags = fullUrl.match(tagtest)

        var method = this.search_options.method || 'post'

        if (this.search_options.field && this.searchString) {
          // global search
          console.log(this.search_options.field + ' = ' + this.searchString)
          if (tags && tags.length) {
            var tag = new RegExp('<' + tags[1] + '>')
            fullUrl = fullUrl.replace(tag, this.searchString)
            console.log('replaced ' + tag + ' tag with ' + this.searchString)
          } else {
            fullUrl += '&' + this.search_options.field + '=' + this.searchString
          }

          for (var i = 0; i < fields.length; i++) {
            orConditions.push(fields[i] + ' LIKE "%' + this.searchString + '%"')
            console.log(' .. or ' + fields[i] + ' like ' + this.searchString)
          }
          method = 'get'
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
          console.log('search 1: ' + this.searchString + ' in ' + this.search_options.field)
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
            console.log('clear ' + j)
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

<style scoped>
.modal-mask {
  position: fixed !important;
  z-index: 2000 !important;
  top: 0px !important;
  right: 0px !important;
  bottom: 0px !important;
  left: 0px !important;
  overflow-y: auto !important;
  webkit-transform: translate3d(0,0,0) !important;
  background-color: rgba(255, 255, 255, 0.8) !important;
  display: -webkit-box !important;
  display: -moz-box !important;
  display: -ms-flexbox !important;
  display: -webkit-flex !important;
  display: flex !important;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: -webkit-box !important;
  display: -moz-box !important;
  display: -ms-flexbox !important;
  display: -webkit-flex !important;
  display: flex !important;
  margin: auto !important;
  max-width: 760px !important;
  padding: 64px !important;
  width: 100% !important;
}

.modal-container {
  width: 300px;
  background-color: #ffffff !important;
  box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.2) !important;
  -webkit-flex: 1 !important;
  -ms-flex: 1 !important;
  flex: 1 !important;
  width: 100% !important;
  margin: 100px auto;
  padding: 0px;   
  /*20px 30px;*/ use wrapper above for the padding... 
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header {
  margin-top: 0;
  padding: 0;
  background-color: #cfc;
  color: green;
}

.modal-body {
  margin: 20px 0;
  color: black;
}

.modal-default-button {
  float: right;
}

/*
 * the following styles are auto-applied to elements with
 * v-transition="modal" when their visiblity is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter, .modal-leave {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

/** Customized... ***/

.modal-footer {
  background-color: #666;
}

.modal-table {
  color: black
}

.table-header {
  background-color: #ddd;
  text-align: center;
}

.table-prompt {
  text-align: right;
}

.modal-btn {
  margin: 5px;
}
</style>

