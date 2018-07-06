<template lang='pug'>
  div
    div.form-group.has-success.has-feedback(v-if="!visibleSearch")
      span.input-group
        span.input-group-addon(style='background-color: transparent; border: 0px;')
          a(href='/' onclick='return false' @click.prevent="toggleSearch")
            icon(name='search' color='white' scale='2')
          span &nbsp; &nbsp;
    div(@mouseleave="hideSearch")
      table.table.popup-table.input-lg(v-if="visibleSearch")
        tr(width='100%')
          td(width='100%')
            div.form-group
              span.input-group
                input.form-control.input-lg.full-page#searchString(type='text' placeholder='-- Search --')
                span.input-group-btn
                  button.btn.btn-lg.btn-default.full-page(@click.prevent='searchMethod')
                    icon(name='search' color='black' background='blue')
</template>

<script>
  // require icon supplied by calling component...
  // import Modal from './Modal'
  import 'vue-awesome/icons/search'

  export default {
    data () {
      return {
        holdSearch: false,
        visibleSearch: false,

        searchIcon: {
          type: String,
          default: 'search'
        }
      }
    },
    methods: {
      toggleSearch (block) {
        this.visibleSearch = !this.visibleSearch
        console.log('toggled hold: ' + this.holdSearch + ': ' + this.visibleSearch)
      },
      hideSearch (block) {
        // Hide menu (delay ignores rapid toggling by mouse out / in movements)
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
      },
      searchMethod () {
        var id = document.getElementById('searchString')
        var search = ''
        if (id && id.value) {
          console.log('search for: ' + id.value)
          search = id.value
        } else {
          console.log('no search string...')
        }
        console.log('perform search for ' + search)
      }
    }
  }
</script>

