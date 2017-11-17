<template id=this.id lang='pug'>
  span
    span.modal-anchor
      span(v-if='openButton')
        span &nbsp;
        button.btn.btn-primary(v-on:click="openModal()") {{openButton}}
      span(v-else)
        span &nbsp; &nbsp; 
        button.btn.btn-primary(v-on:click="clearTarget; openModal()") +
    span.m-fadeOut(:id="id")
      transition(name="modal") 
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
                        <!-- Body -->
                        div(v-if="type==='search'")
                          SearchBlock(:search_options="options")
                        div(v-else)
                          b non-search Body...
              div.modal-footer
                slot(name="footer")
                  b {{footer}}
                  button.btn.btn-danger(@click="closeModal()") {{close}}
</template>

<script>
  /*

  Usage:
    Modal(title='Modal Title' body='Modal Content' footer='Modal footer')

  Input:
    name - name of modal (should be distinct if multiple modals used)

  Advanced Options:

    type - [standard (default), search, dbRecord]
      search
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
      options: {
        type: Object
      },

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
        } else if (this.options && this.options.header) {
          return this.options.header
        } else if (this.options && this.options.model) {
          return this.options.model
        } else {
          return ''
        }
      },
      closeButton: function () {
        if (this.options && this.options.closeButton) {
          return this.options.closeButton
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
  transition: opacity 1s ease;
}

.modal-wrapper {
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

