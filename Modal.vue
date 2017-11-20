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
        span &nbsp;
        button.btn.btn-primary(v-on:click="openModal()") {{openButton}}
      span(v-else)
        span &nbsp; &nbsp; 
        button.btn.btn-primary(v-on:click="openModal()") +
    span.m-fadeOut(:id="id")
      transition(name="modal") 
        div.my-modal-mask
          div.my-modal-wrapper
            div.my-modal-container
              div.my-modal-header
                div.container
                  slot(name="header")
                    div(v-if="myheader")
                      b {{myheader}}
                        div.navbar-right
                          button.btn.btn-danger.btn-xs(@click="closeModal()")
                            icon(name='close')
              div.my-modal-body
                slot(name="body")
                  div(v-if="1")
                    slot(name="body")
                      <!-- Body -->
                      div(v-if="search")
                        SearchBlock(:search_options="search" :data_options="data" :picked="picked")
                      div(v-else)
                        b non-search Body...
              div.my-modal-footer
                slot(name="footer")
                  b {{footer}} &nbsp;
                  span.navbar-right
                    button.btn.btn-danger.btn-xs(@click="closeModal()") {{closeBtn}}
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

  export default {
    name: 'Modal',
    components: {
      SearchBlock
    },
    data () {
      return {
        isVisible: false,
        timeoutID: 0,
        showModal: false,
        status: 'pending',
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
        default: 'standard'
      },
      header: {
        type: String,
        default: ''
      },
      body: {
        type: String,
        default: ''
      },
      footer: {
        type: String,
        default: ''
      },
      openButton: {
        type: String
      },
      closeButton: {
        type: String
      },

      data: {
        type: Object
      },
      search: {
        type: Object
      },
      record: {
        type: Object
      },
      picked: {
        type: Array
      },

      options: {
        type: Object
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
    computed: {
      loadStatus: function () {
        return this.status
      },
      myheader: function () {
        if (this.header) {
          return this.header
        } else if (this.options && this.options.header) {
          return this.options.header
        } else if (this.options && this.options.model) {
          return this.options.model
        } else {
          return 'Title'
        }
      },
      closeBtn: function () {
        if (this.closeButton) {
          return this.closeButton
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
        document.getElementById(this.id).classList.toggle('m-fadeIn')
        document.getElementById(this.id).classList.toggle('m-fadeOut')

        clearTimeout(this.timeoutID)
      },
      closeModal: function () {
        console.log('close modal...')
        console.log('fade out')
        document.getElementById(this.id).classList.toggle('m-fadeOut')
        document.getElementById(this.id).classList.toggle('m-fadeIn')
      }
    }
  }
</script>

<style scoped>
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

