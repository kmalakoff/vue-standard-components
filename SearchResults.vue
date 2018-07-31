<!-- src/components/Login.vue -->

<template lang='pug'>
  div.search-results
    b {{scope}}
    b found {{JSON.stringify(searchResults)}}

    table.ResultsGrid(v-if='searchResults[scope] && searchResults[scope].length')
      thead
        tr
          th.result-heading(v-for="val, key in searchResults[scope][0]")
            span {{key}}
      tbody
        tr(v-for="record in searchResults[scope]")
          td(v-for="val, key in record")
            span(v-if='reference && record[reference]')
              a(href='#' onclick='return false;' data-html='true' data-model={model} data-attribute={key} v-on:click="onPick(scope, record[reference], record[key])") {{val}}
            span(v-else) {{val}}
    div(v-if='!searchResults[scope] || !searchResults[scope].length')
      table(align='center' v-if='noDataMsg')
        tr
          td {{noDataMsg}}
    div(v-if='searchStatus[scope] === "searching"')
      b Searching...
    hr
    b Highlight {{highlight}} status: {{searchStatus}}
    div(v-if="picked && picked[scope] && picked[scope].length===1")
      b Picked: {{ picked[scope][0] }}
    div(v-else)
      b nothing picked...
</template>

<script>
export default {

  data () {
    return {
      fields: '',
      show: [],
      highlight: '',
      searchResults: this.list,
      searchStatus: this.status
    }
  },

  props: {
    scope: {
      type: String
    },
    noDataMsg: {
      type: String
    },
    reference: {
      type: String
    },
    list: {
      type: Array,
      default () { return [] }
    },
    picked: {
      type: Array,
      default () { return [] }
    },
    status: {
      type: String,
      default: 'pending'
    }
  },

  methods: {
    onPick (scope, id, label) {
      console.log(scope + ' picked ' + id)
      // this.$store.commit('selectOneMore', {scope: scope, id: id, label: label})
      this.picked.push({id: id, label: label})
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
</style>
