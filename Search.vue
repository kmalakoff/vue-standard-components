<!-- src/components/Login.vue -->

<template lang='pug'>
  div.search-form
    input.input-lg(:id='scope' v-model='searchString' name='searchString' :placeholder='prompt')
    button.btn.btn-primary(@click.prevent="searchForIt") Search
</template>

<script>
  import axios from 'axios'
  import cors from 'cors'
  import { mapState } from 'vuex'

  export default {

    data () {
      return {
        header: '',
        caseSensitive: false,
        show: [],
        onPick: '',
        searchString: '',
        selectOne: '',
        foundRecords: 0,
        corsOptions: {
          origin: true,
          methods: ['GET', 'POST'],
          credentials: true,
          maxAge: 3600
        }
      }
    },

    props: {
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
      }
    },

    computed: mapState([
      'picked',
      'searchStatus'
    ]),

    methods: {
      increment () {
        console.log('Incremented')
        this.$store.commit('increment')
      },
      deselect (id) {
        this.$store.commit('unselectOne', {scope: this.scope, id: id})
      },
      searchForIt () {
        console.log('Search for data containing...' + this.searchString)

        this.$store.commit('clearErrors')
        this.$store.commit('clearSearchResults', {scope: this.scope})
        this.$store.commit('setSearchStatus', {scope: this.scope, status: 'searching'})

        var data = cors(this.corsOptions)
        console.log('CORS: ' + JSON.stringify(cors))

        data = null

        var fullUrl = this.url
        console.log('** Search : ' + JSON.stringify(data))

        console.log(this.searchParameter + ' = ' + this.searchString)
        if (this.searchParameter && this.searchString) {
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
          console.log('got results')

          var newdata = {}
          if (_this.model && result.data[_this.model]) {
            newdata = result.data[_this.model]
          } else {
            newdata = result.data
          }

          _this.$store.commit('stashResults', {scope: _this.scope, data: newdata})
          _this.$store.commit('setSearchStatus', {scope: _this.scope, status: 'complete'})
          _this.$store.commit('increment')

          console.log('set results: ' + JSON.stringify(newdata))
        })
        .catch(function (err) {
          _this.$store.commit('setSearchStatus', {scope: _this.scope, status: 'aborted'})
          console.log('set error...')
          _this.$store.commit('setError', {context: 'searching for ' + _this.scope, err: err})
          console.log('axios error: ' + err)
        })
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
