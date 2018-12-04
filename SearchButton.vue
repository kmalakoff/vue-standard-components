<template lang='pug'>
  div
    div.form-group.has-success.has-feedback(v-if="!visibleSearch")
      span.input-group
        span.input-group-addon(style='background-color: transparent; border: 0px;')
          a(href='/' onclick='return false' @click.prevent="toggleSearch")
            icon(name='search' color='blue' scale='2')
          span &nbsp; &nbsp;
    div(@mouseleave="hideSearch")
      form(:onsubmit='callSearchMethod')
        table.table.search-table.input-lg(v-if="visibleSearch")
          tr(width='100%')
            td(width='100%')
              div.form-group
                span.input-group
                  input.form-control.input-lg.full-page#searchString(type='text' :placeholder='searchPrompt' @click.prevent='onFocus')
                  span.input-group-btn
                    button.btn.btn-lg.btn-primary.full-page(@click.prevent='callSearchMethod')
                      icon(name='search' color='white')
    Modal(v-if="target === 'modal'" id='searchresults' type='data')
    div(v-if='results && postResults')
      h2 Results:
      hr
      DataGrid(:data="results" :onPick='onClick')
       // :type="link.type" :modal="link.modal" :record="data[index]" :link="link")

</template>

<script>
// require icon supplied by calling component...
import Modal from './Modal'
import DataGrid from './DataGrid'
import 'vue-awesome/icons/search'

export default {
  name: 'SearchButton',
  components: {
    Modal,
    DataGrid
  },
  data () {
    return {
      holdSearch: false,
      visibleSearch: true,
      results: null
    }
  },
  props: {
    searchIcon: {
      type: String,
      default: 'search'
    },
    target: {
      type: String,
      default: 'inline'
    },
    includeInput: {
      type: Boolean,
      default: true
    },
    searchMethod: {
      type: Function,
      default: null
    },
    searchPrompt: {
      type: String,
      default: '-- Search --'
    },
    onClick: {
      type: Function,
      default: null
    },
    onFocus: {
      type: Function,
      default: null
    },
    postResults: {
      type: Boolean,
      default: false
    }
  },
  computed: {
  },
  methods: {
    toggleSearch (block) {
      if (!this.includeInput) {
        this.visibleSearch = this.includeInput || !this.visibleSearch
        console.log('toggled hold: ' + this.holdSearch + ': ' + this.visibleSearch)
      }
    },
    hideSearch (block) {
      // Hide menu (delay ignores rapid toggling by mouse out / in movements)
      if (!this.includeInput) {
        var _this = this
        if (!block) {
          console.log('no block defined')
        } else if (this.holdSearch) {
          this.onexpire = false
        } else {
          setTimeout(
            () => {
              _this.holdSearch = false
              this.visibleSearch = this.onexpire
            }, 1000)
          this.holdSearch = true
        }
      }
    },
    callMethod: function (string) {
      if (this.searchMethod) {
        console.log('using search method...')
        return this.searchMethod(string)
      } else {
        var results = [
          { name: 'searched for', value: string },
          { name: 'found_eg', value: 'value_eg' }
        ]
        return results
      }
    },
    callSearchMethod () {
      var id = document.getElementById('searchString')
      var search = ''
      if (id && id.value) {
        console.log('search for: ' + id.value)
        search = id.value
      } else {
        console.log('no search string...')
      }
      console.log('perform search for ' + search)

      var results = this.callMethod(search)
      console.log('got ' + JSON.stringify(results))

      if (this.target === 'modal') {
        this.$store.dispatch('clearModal')
        // populate modal...
        this.$store.dispatch('setModalData', results)
        this.$store.dispatch('toggleModal', 'searchresults')
        console.log('results: ' + JSON.stringify(results))
      } else {
        this.results = results
      }
    }
  }
}
</script>

<style scoped lang="sass?outputStyle=expanded">

 .popup-table {
    // position: relative;
    // right: 0;
    // top: 60px;
    // margin: 0px;
  }
  .popup-table tr {
    /*padding: 5px;*/
  }
  .popup-table tr td {
    /*padding: 0px;*/
    /*padding-left: 15px;*/
  }

  .popup-table a{
    display: block;
    padding: 5px;
    padding-left: 15px;
    /*text-decoration: none;*/
  }
  .popup-table a:hover{
    display: block;
    padding: 5px;
    padding-left: 15px;
    text-decoration: none;
  }
</style>
