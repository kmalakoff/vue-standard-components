<!-- src/components/dbRecordModal.vue -->
// Webpack CSS import

// JS import
import Vue from 'vue';

<template id="modal-template" lang='pug'>
  span
    span(v-show="!isVisible")
      button(type='button' @click.prevent='showMe()') {{openButton}} 
    span(v-show='isVisible')
      b v: {{isVisible}}
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
        
                    div(v-html="modalBody")

              div.modal-footer
                slot(name="footer")
                  b {{footer}}
                  button.btn.btn-danger(type='button' @click.prevent='hideMe()') {{close}}
</template>

<script>
  /*

  Usage:

    Modal(title='Modal Title' body='Modal Content' footer='Modal footer')

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
    data () {
      return {
        isVisible: false,
        timeoutID: 0,
        showModal: false,
        status: 'pending',
        formData: {},
        generated: {
          body: ''
        }
      }
    },
    props: {
      name: {
        type: String,
        default: 'modal'
      },
      title: {
        type: String,
        default: ''
      },
      table: {
        type: String
      },
      fields: {
        type: Array,
        default () { return [] }
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
        default: ''
      },
      footer: {
        type: String,
        default: ''
      },
      openButton: {
        type: String
      },
      action: {
        type: Function
      },
      url: {
        type: String
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
      }
    },
    computed: {
      loadStatus: function () {
        return this.status
      },
      myheader: function () {
        if (this.header) {
          return this.header
        } else if (this.title) {
          return this.title
        } else if (this.table) {
          return this.table
        } else {
          return ''
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
      }
      // modalClick (data) {
      //   console.log('Form: ' + JSON.stringify(this.formData))
      //   if (this.function) {
      //     this.function()
      //   }
      // }
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
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header {
  margin-top: 0;
  padding: 0;
  /*background-color: #cfc;*/
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

</style>

