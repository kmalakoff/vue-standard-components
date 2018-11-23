<!-- Stanard/Modal.vue

  Usage:

Options (for all modal types)
  - type (search, record, data, raw, html, url)
  - id (unique id) - not necessary if only one modal on page

  - options (supply other options within hash of options)

  - header
  - body
  - footer
  - openButton (name of button used to open modal)
  - openText (alternative to 'openButton' - name of text used to open modal)

  Three primary types along with associated input props:

*** simple array of data records: ***
Modal(type='data', :data='data') // data = [{name: 'John Doe', email: 'john@gmail.com'}, {name: 'Jane Doe', email: 'jane@gmail.com'}]

*** data form for record(s) - referencing field types ***
Modal(type='record', :options='options') // options = {fields: [{ name: 'Full Name', type: 'text' }, name: 'Birthdate', type: 'date', prompt: 'Date of Birth'}]

Modal(type='data', :data='data') // data = [{example1: 'link to example 1'}, {example2: 'link to example2'}]
Modal(type='data', :data='data') // data = [{example1: 'link to example 1'}, {example2: 'link to example2'}]

  Standard:
    - data (array of links triggering function or another modal)
    - type (search, record, data, raw, html, url)
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

  Confirm Modal: (provide confirmation before performing action)
    - data (data hash to pass back to onSave function)
    - onSave (function)
    - prompt
    - saveButton (text for save button)
-->

<template id=this.id lang='pug'>
  span
    span.modal-anchor
    span(v-if='openButton')
      button.open-button.btn(v-on:click="openModal()" :class='options.buttonClass' v-bind:class="[{wideButton: wideOnMobile}]")
        span(v-html='openButton')
    span(v-else-if='openText')
      a.modal-link(href='#' onclick='return false' v-on:click="openModal()")
        b(style='font-size: larger') {{openText}}
    span(v-else-if='openIcon')
      button.btn.btn-default(v-on:click="openModal()" :class='options.buttonClass' v-bind:class="[{wideButton: wideOnMobile}]")
        icon(:name='openIcon')
    span(:class='initClass' :id="id")
      transition(name="modal")
        div.my-modal-mask
          div.my-modal-wrapper
            div.my-modal-container
              div.my-modal-header
                slot(name="header")
                  b {{myheader}} &nbsp; &nbsp;
                    span.navbar-right
                      button.btn.btn-danger.btn-xs(@click="closeModal")
                        icon(name='times')
              div.my-modal-body
                slot(name="body")
                  <!-- Body -->
                  div(v-if="modalType==='search'")
                    SearchBlock(:search_options="search_options" :links="links" :data_options="data_options" :picked="picked")
                  div(v-else-if="modalType==='record'")
                    DBForm(:options='options' :onSave='save' :append='append' :record='modalRecord')
                    div(v-if='options.addLinks' v-for='link in options.addLinks')
                      button.btn.btn-default(@click.prevent="link.onPick(modalData)") {{link.name}}
                  div(v-else-if="modalType==='data'")
                    div(v-if="modalData && modalData.length")
                      DataGrid(:data="modalData" :options="data_options")
                    div(v-else)
                      b No Data Available
                  div(v-else-if="modalType==='raw'")
                    div(v-if='contents')
                      b {{contents}}
                    div(v-else)
                      b No Content Supplied
                  div(v-else-if="modalType==='confirm'")
                    h4(v-if='myPrompt') {{myPrompt}}
                    DBForm(:options='confirmOptions', :onSave='save')
                  div(v-else-if="modalType==='input'")
                    b(v-if='myPrompt') &nbsp; &nbsp; {{myPrompt}}
                    input.input-lg(type='text' name='input' v-model='input' v-on:click='save')
                  div(v-else-if="modalType==='html'")
                    div(v-if='htmlContent' v-html="htmlContent")
                    div(v-else)
                      b No HTML Content supplied
                  div(v-else-if="modalType==='url'")
                    div(v-if='url')
                      span {{modalContent}
                    div(v-else)
                      b No URL or modalContent
                  div(v-else)
                    b no valid type supplied.  Options: (search, record, data, raw, html, url, ....
                    hr
                  p &nbsp;
                  b.error-msg(v-if='errorMsg') {{errorMsg}}
              Messaging
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
import Messaging from './Messaging'
import axios from 'axios'
import 'vue-awesome/icons/times'

export default {
  name: 'Modal',
  components: {
    SearchBlock,
    DataGrid,
    DBForm,
    Messaging
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
      },
      modalContent: '',
      errorMsg: '',
      confirmOptions: {
        submitButton: 'I Agree',
        access: 'append'
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

    button: {
      type: String
    },
    text: {
      type: String
    },
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
    },
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
    prompt: {
      // use for 'confirmation' and 'input' types
      type: String
    },
    confirm: {
      type: Array
    }
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
    if (this.confirm || this.options.confirm) {
      var fields = []
      var confirm = this.confirm || this.options.confirm

      for (var i = 0; i < confirm.length; i++) {
        var fld = confirm[i]
        if (fld.constructor === String) {
          fld = {name: fld}
        }
        if (!fld.type) { fld.type = 'checkbox' }
        fields.push(fld)
      }

      if (this.record) {
        var Fkeys = Object.keys(this.record)
        for (var j = 0; j < Fkeys.length; j++) {
          var f = Fkeys[j]
          fields.push({name: f, default: this.record[f], type: 'hidden'})
        }
      }
      this.$set(this.confirmOptions, 'fields', fields)
    }
  },
  computed: {
    wideOnMobile: function () {
      if (this.options && this.options.wideOnMobile) {
        return true
      } else {
        return false
      }
    },
    recordTable: function () {
      if (this.options.table) {
        return this.options.table
      } else {
        console.log('no table defined')
      }
    },
    contents: function () {
      if (this.modalData && this.modalData.length) {
        console.log('data defined')
        return this.modalData.length
      } else if (this.content) {
        console.log('content defined')
        return this.content
      } else if (this.options.content) {
        return this.options.content
      } else {
        console.log('content undefined')
        return 'content undefined'
      }
    },
    initClass: function () {
      if (this.options && this.options.show) {
        return 'm-fadeIn'
      } else {
        return 'm-fadeOut'
      }
    },
    htmlContent: function () {
      if (this.options && this.options.htmlContent) {
        return this.options.htmlContent
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
    modalType: function () {
      if (this.options.type) {
        return this.options.type
      } else if (this.type) {
        return this.type
      } else {
        return this.$store.getters.getHash('modalType') || 'content'
      }
    },
    modalTitle: function () {
      if (this.options.title) {
        return this.options.title
      } else if (this.title) {
        return this.title
      } else {
        return this.$store.getters.modalTitle || ''
      }
    },
    modalData: function () {
      if (this.options.data) {
        console.log('static option data: ' + JSON.stringify(this.data))
        return this.options.data || {}
      } else if (this.options.stored) {
        var storedData = this.$store.getters.getHash(this.stored)
        console.log('dynamically loaded ' + this.options.stored + ' data: ' + JSON.stringify(storedData))
        return storedData || []
      } else if (this.record) {
        return [this.record]
      } else if (this.data) {
        console.log('static data: ' + JSON.stringify(this.data))
        return this.data || []
      } else {
        var key = this.options.key || 'unknown key'
        console.log('standardized modal data: ' + key)
        // var data = this.$store.getters.getHash(key)
        var data = this.$store.getters.modalData
        return data || {}
      }
    },
    modalRecord: function () {
      if (this.record) {
        return this.record
      } else if (this.modalData && this.modalData.constructor === Array) {
        if (this.modalData.length) {
          console.log('use first data record')
          return this.modalData[0]
        } else {
          return null
        }
      } else if (this.modalData && this.modalData.constructor === Object) {
        console.log('modal record supplied as object')
      } else {
        console.log('? constructor is: ' + this.modalData.constructor + ' : ' + this.modalData.length)
        return { fields: 'undef' }
      }
    },
    openButton: function () {
      if (this.button) {
        return this.button
      } else if (this.options && this.options.openButton) {
        return this.options.openButton || '+'
      } else { return '' }
    },
    openText: function () {
      if (this.text) {
        return this.text
      } else if (this.options && this.options.openText) {
        return this.options.openText || '+'
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
    url: function () {
      // console.log('check for url in: ' + JSON.stringify(this.options))
      if (this.options.url) {
        console.log('Modal url: ' + this.options.url)
        return this.options.url
      } else {
        return null
      }
    },
    myPrompt: function () {
      if (this.prompt) {
        return this.prompt
      } else if (this.options && this.options.prompt) {
        return this.options.prompt
      } else {
        return 'Okay ?'
      }
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
      } else { return null }
    }
  },
  asyncComputed: {
    urlContent: function () {
      if (this.url) {
        console.log('generate url content from ' + this.url)
        var _this = this
        console.log('use axios in Modal')
        axios({url: this.url, method: 'get'})
          .then(function (result, err) {
            console.log('axios returned value(s): ' + JSON.stringify(result))
            if (err) {
              console.log('axios call error')
              return '<h3>Error calling url</h3>'
            }
            console.log('got results for ' + _this.url)
            _this.modalContent = result
            return _this.modalContent
          })
        return 'dynamic content'
      } else {
        return 'static content'
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
      if (this.url) {
        console.log('dynamic url content generation')
        console.log(this.urlContent)
      }
      this.$store.dispatch('toggleModal', this.id)

      clearTimeout(this.timeoutID)
    },
    closeModal () {
      this.$store.commit('clearModal')
      this.$store.dispatch('toggleModal', this.id)
    },
    async save (form) {
      if (this.options.onSave) {
        console.log('save form: ' + JSON.stringify(form))
        var response = await this.options.onSave(form)
        if (response.data) {
          response = response.data
        }
        console.log('Modal Save Response: ' + JSON.stringify(response))

        if (this.options.quiet) {
          // suppressing response messaging
        } else if (response && response.success) {
          console.log(response.success)
          this.closeModal()
        } else if (response && response.error) {
          console.log('error encountered: ' + response.error)
        } else {
          console.log('Please return success/message/warning/errors or response from axios call on response: ' + JSON.stringify(response))
          //   this.ErrMsg = 'OK...'
          this.closeModal()
        }
      } else {
        console.log('save function not supplied')
        this.closeModal()
      }
    }
  },
  watch: {
    toggle: function () {
      console.log('changed body')
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
  background-color: #fff;
  border-radius: 2px;
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
  min-height: 300px;
  padding: 40px;
  color: black;
}

.my-modal-footer {
  padding: 30px;
  background-color: #aaa;
  color: black;
}

.modal-default-button {
  float: right;
}

/* Responsive design - mobile first */

.my-modal-wrapper {
  padding: 0px;
}

.wideButton {
  width: 100%;
  padding: 15px;
  height: 100%;
}

@media screen and (min-width: 768px) {
  .wideButton {
    width: auto;
  }
  .my-modal-wrapper {
    padding: 64px !important;
  }
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
.modal-link {
  color: blue;
}

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
  min-height: 500px;
}

</style>
