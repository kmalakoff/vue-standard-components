<!-- src/components/Login.vue -->

<template lang='pug'>
  div.search-results
    table.ResultsGrid(v-if='searchResults[scope] && searchResults[scope].length')
      thead
        tr
          th.result-heading(v-for="val, key in searchResults[scope][0]")
            span {{key}}
      tbody
        tr(v-for="record in searchResults[scope]")
          td(v-for="val, key in record")
            a(href='#' data-html='true' data-model={model} data-attribute={key} v-on:click="onPick") {{val}}

    div(v-if='!searchResults[scope] || !searchResults[scope].length')
      table 
        tr
          td nothing found
 
    b Highlight {{highlight}}

</template>

<script>
  import { mapState } from 'vuex'
  export default {

    data () {
      return {
        fields: '',
        show: [],
        highlight: ''
      }
    },

    props: {
      scope: {
        type: String
      }
    },

    computed: mapState([
      'patient',
      'selected',
      'searchResults',
      'count'
    ]),

    methods: {
      onPick () {
        console.log('picked')
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
</style>
