<!-- src/components/Login.vue -->

<template lang='pug'>
  div.search-form
    input.input-lg(:id='scope' v-model='searchString' name='searchString' :placeholder='prompt')
    button.btn.btn-primary(@click.prevent="searchForIt") Search
    span &nbsp; &nbsp;
    button.btn.btn-danger(@click.prevent="increment") Inc
</template>

<script>
  import axios from 'axios'
  import cors from 'cors'

  export default {

    data () {
      return {
        fields: [],
        condition: '',
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
      scope: {
        type: String
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

    methods: {
      increment () {
        console.log('Incremented')
        this.$store.commit('increment')
      },
      searchForIt () {
        console.log('Search for data containing...' + this.searchString)

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
        if (method === 'post') {
          data = {}
          data.model = this.scope
          var conditions = this.conditions || [1]

          var searchConditions = []
          for (var i = 0; i < this.fields.length; i++) {
            searchConditions.push(this.fields[i] + ' LIKE "%' + this.searchString + '%"')
          }
          var addCondition
          if (searchConditions.length) {
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
          var newdata = result.data
          _this.$store.commit('stashResults', {scope: _this.scope, data: newdata})
          _this.$store.commit('increment')

          console.log('set results: ' + JSON.stringify(newdata))
        })
        .catch(function (err) {
          console.log('axios errror: ' + err)
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
