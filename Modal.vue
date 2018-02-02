<!-- Stanard/Modal.vue

  Usage:

Options (for all modal types)
  - id (unique id) - not necessary if only one modal on page
  - header
  - body
  - footer
  - openButton (name of button used to open modal)
  - 

  Three primary types along with associated input props:

  Standard: 
    - data (array of links triggering function or another modal)

  Search Modal: (provides search field(s) that enable search via specified api)
    - search (hash with the following options)
      - options (hash input including the following search options)
        record - data record to pass to modal for secondary action
        table - table to autoload fields for (allows for easy generation of modal for adding / editing database records in a table)
        button - name of button for secondary action
        function - function to execute upon clicking of button above
        url - url to generate content of modal
        urlData - data to pass to url (post) (may include tags replaced by record data ( eg urlData = {id: '<foundId>'} where the record supplied includes the 'foundId' attribute))
  
  Record Modal: (provides access to record-based modal form)
    - record (hash with the following options)
      - table
      - model
      - access_type (view, edit, search, append)

-->

<template id=this.id lang='pug'>
  span
    span.modal-anchor
    span(v-if='openButton')
      button.btn.btn-primary(v-on:click="openModal()")
        span(v-html='openButton')
    span(v-else-if='openIcon')
      button.btn.btn-primary(v-on:click="openModal()")
        icon(:name='openIcon')      
    span.m-fadeOut(:id="id")
      transition(name="modal") 
        div.my-modal-mask
          div.my-modal-wrapper
            div.my-modal-container
              div.my-modal-header
                slot(name="header")
                  b {{myheader}}
                    span.navbar-right
                      button.btn.btn-danger.btn-xs(@click="closeModal")
                        icon(name='close')
              div.my-modal-body
                slot(name="body")
                  <!-- Body -->
                  div(v-if="type==='search'")
                    SearchBlock(:search_options="search_options" :links="links" :data_options="data_options" :picked="picked")
                  div(v-else-if="type==='record'")
                    DBForm(:options='options' :onSave='save' :append='append')
                    div(v-if='options.addLinks' v-for='link in options.addLinks')
                      button.btn.btn-primary(@click.prevent="link.onPick(modalData)") {{link.name}}
                  div(v-else-if="modalData && modalData.length")
                    DataGrid(:data="modalData" :options="data_options")
                  div(v-else-if='content')
                    b content: {{content}}
                  div(v-else)
                    b no data / search / record ... 
                    hr
              div.my-modal-footer
                slot(name="footer")
                  b {{footer}} &nbsp;
                  span.navbar-right
                    button.btn.btn-danger.btn-xs(@click="closeModal") {{closeButton}}
</template>

<script>
  /*

  Usage examples:
    Modal(header='Modal Title' body='Modal Content')

  Input:
    name - name of modal (should be distinct if multiple modals used)

  Advanced Options:

      - search (hash with the following options)
        - options (hash input including the following optional attributes)
          record - data record to pass to modal for secondary action
          table - table to autoload fields for (allows for easy generation of modal for adding / editing database records in a table)
          button - name of button for secondary action
          function - function to execute upon clicking of button above
          url - url to generate content of modal
          urlData - data to pass to url (post) (may include tags replaced by record data ( eg urlData = {id: '<foundId>'} where the record supplied includes the 'foundId' attribute))

  */

  import SearchBlock from './SearchBlock'
  import DataGrid from './DataGrid'
  import DBForm from './DBForm'

  export default {
    name: 'Modal',
    components: {
      SearchBlock,
      DataGrid,
      DBForm
    },
    data () {
      return {
        isVisible: false,
        timeoutID: 0,
        showModal: false,
        status: 'pending',
        fieldData: [],
        generated: {
          body: ''
        }
      }
    },
    props: {
      id: {
        type: String,
        default: 'default-modal_id'
      },
      type: {
        type: String,
        default: ''
      },
      header: {
        type: String,
        default: ''
      },
      title: {
        type: String
      },
      picked: {
        type: Array
      },
      footer: {
        type: String,
        default: ''
      },
      data: {
        type: Array
      },
      content: {
        type: String
      },
      // links: {
      //   type: Object
      // },
      toggle: {
        type: Boolean
      },

      // openButton: {
      //   type: String
      // },
      // closeButton: {
      //   type: String
      // },
      record: {
        type: Object
      },
      link: {
        type: Object
      },
      options: {
        type: Object,
        default () { return {} }
      },
      append: {
        type: Array
      }
      // title: {
      //   type: String,
      //   default: ''
      // },
      // table: {
      //   type: String
      // },
      // fields: {
      //   type: Array,
      //   default () { return [] }
      // },
      // prompt: {
      //   type: String
      // },
      // action: {
      //   type: Function
      // },
      // url: {
      //   type: String
      // },
      // urlData: {
      //   type: Object
      // },
      // function: {
      //   type: Function
      // },
      // close: {
      //   type: String,
      //   default: 'Cancel'
      // },
      // record: {
      //   type: Object
      // },
    },
    created: function () {
    },
    computed: {
      recordTable: function () {
        if (this.options.table) {
          return this.options.table
        } else {
          console.log('no table defined')
          return
        }
      },
      contents: function () {
        if (this.modalData && this.modalData.length) {
          return this.modalData.length
        } else if (this.content) {
          return this.content
        }
      },
      initClass: function () {
        if (this.options && this.options.show) {
          return 'm-fadeIn'
        } else {
          return 'm-fadeOut'
        }
      },
      search_options: function () {
        if (this.options && this.options.search) {
          return this.options.search
        } else { return {} }
      },
      data_options: function () {
        if (this.options && this.options.data_options) {
          return this.options.data_options
        } else { return {} }
      },
      body: function () {
        return this.options.body || ''
      },
      modalTitle: function () {
        if (this.options.title) {
          return this.options.title
        } else if (this.title) {
          return this.title
        } else {
          return this.$store.getters.getHash('modalTitle') || 'my Title'
        }
      },
      modalData: function () {
        if (this.options.data) {
          return this.options.data || {}
        } else if (this.options.stored) {
          var storedData = this.$store.getters.getHash(this.stored)
          console.log('dynamically loaded data to modal: ' + JSON.stringify(storedData))
          return storedData || []
        } else if (this.data) {
          return this.data
        } else {
          var key = this.options.key || 'unknown key'
          console.log('standardized modal : ' + key)
          var data = this.$store.getters.getHash(key)
          return data
        }
      },
      openButton: function () {
        if (this.options && this.options.openButton) {
          return this.options.openButton || 'no'
        } else { return '' }
      },
      openIcon: function () {
        if (this.options && this.options.openIcon) {
          return this.options.openIcon || 'no'
        } else { return '' }
      },
      closeButton: function () {
        if (this.options && this.options.closeButton) {
          return this.options.closeButton || 'no'
        } else { return 'Close' }
      },
      // links: function () {
      //   if (this.options && this.options.links) {
      //     return this.options.links || {}
      //   }
      // },
      links: function (key) {
        var L = this.$store.getters.getLinks
        if (L && L.constructor === Object) {
          console.log('got link object')
          return L
        } else {
          console.log('got link function ?')
          return L
        }
      },
      loadStatus: function () {
        return this.status
      },
      myheader: function () {
        if (this.modalTitle) {
          return this.modalTitle
        } else if (this.header) {
          return this.header
        } else if (this.options && this.options.header) {
          return this.options.header
        } else if (this.options && this.options.model) {
          return this.options.model
        } else {
          return 'Title'
        }
      },
      modalBody: function () {
        if (this.generated && this.generated.body) {
          return this.generated.body
        } else if (this.body) {
          return this.body
        }
      }
    },
    methods: {
      showMe () {
        this.isVisible = true
        clearTimeout(this.timeoutID)
      },
      hideMe () {
        this.isVisible = false
        clearTimeout(this.timeoutID)
      },
      openModal () {
        console.log('open modal...')
        console.log('and fade in')
        // document.getElementById(this.id).classList.toggle('m-fadeIn')
        // document.getElementById(this.id).classList.toggle('m-fadeOut')
        this.$store.getters.toggleModal(this.id)

        clearTimeout(this.timeoutID)
      },
      closeModal: function () {
        console.log('close modal...')
        console.log('fade out')
        this.$store.commit('clearModal')
        // document.getElementById(this.id).classList.toggle('m-fadeOut')
        // document.getElementById(this.id).classList.toggle('m-fadeIn')
        this.$store.getters.toggleModal(this.id)
      },
      save: function (form) {
        if (this.options.onSave) {
          console.log('save form: ' + JSON.stringify(form))
          this.options.onSave(form)
          this.closeModal()
        } else {
          console.log('save function not supplied')
        }
      },
      watch: {
        'toggle': function () {
          console.log('changed body')
        }
      }
    }
  }
</script>

<style>
.my-modal-mask {
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
  transition: opacity 1s ease;
}

.my-modal-wrapper {
  display: -webkit-box !important;
  display: -moz-box !important;
  display: -ms-flexbox !important;
  display: -webkit-flex !important;
  display: flex !important;
  margin: auto !important;
  max-width: 980px !important;
  padding: 64px !important;
  width: 100% !important;
}

.my-modal-container {
  width: 300px;
  background-color: #ffffff !important;
  box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.2) !important;
  -webkit-flex: 1 !important;
  -ms-flex: 1 !important;
  flex: 1 !important;
  width: 100% !important;
  margin: auto;
  /*padding: 20px 30px;*/
  background-color: #fff;
  /*border-radius: 2px;*/
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
  overflow:hidden;
}

.my-modal-header {
  margin-top: 0;
  padding: 20px;
  background-color: #666;
  color: white;
}

.my-modal-body {
  padding: 40px;
}

.my-modal-footer {
  padding: 30px;
  background-color: #aaa;
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

.modal-header {
  background-color: #666;  
}
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

.m-fadeOut {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s linear 1000ms, opacity 1000ms;
}
.m-fadeIn {
  visibility: visible;
  opacity: 1;
  transition: visibility 0s linear 0s, opacity 1000ms;
}

</style>

