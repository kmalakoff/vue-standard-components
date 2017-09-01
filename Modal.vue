<!-- src/components/dbRecordModal.vue -->
// Webpack CSS import

// JS import
import Vue from 'vue';

<template id="modal-template" lang='pug'>
  div
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
                div(v-if="table")
                  slot(name="body")
                    div.modal-body(v-show="loadStatus==='loaded'")
                      table.table.bordered-table.modal-table
                        thead
                          th.table-header
                            b Field
                          th.table-header
                            b Value
                        tbody
                          tr(v-for="field in fields")
                            td {{field.name}}
                            td
                              input(type='text' v-model="formData[field.name]" :placeholder="field.type")
                      hr
                      div(v-if="button")
                        button.btn.btn-primary(@click.prevent="modalClick()") {{button}} 

                    div(v-show="loadStatus !== 'loaded'")
                      b Loading...
                      img(src="./../../assets/spinning_wheel.gif" style="height: 100px")

                div(v-else) 
                  div(v-html="modalBody")
                  div(v-if="button")
                    button.btn.btn-primary(@click.prevent="modalClick()") {{button}} 

            div.modal-footer
              slot(name="footer")
                b {{footer}}
                button.btn.btn-danger(@click="$emit('close')") {{close}}
</template>

<script>
  import axios from 'axios'
  import config from '@/config.js'

  /*

  Usage:

  div(v-if='modal')
        div(v-if="showModal")
          Modal(v-if="showModal" @close="hideM" :name="name")
        div(v-else)
          button.btn.btn-success(id="show-modal" @click.prevent="showM") {{name}}
      div(v-else)
        button.btn.btn-success(@click.prevent="runEvent()") {{name}}

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
        },
        dbURL: config.dbURL
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
        default: 'default body'
      },
      footer: {
        type: String,
        default: ''
      },
      button: {
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
    created: function () {
      var table = this.table
      var url = this.dbURL
      var _this = this

      console.log('Record: ' + JSON.stringify(this.record))

      if (this.url) { url = this.url }

      if (this.table) {
        console.log('Modal run : ' + url)

        console.log('status = ' + this.status)
        console.log('name = ' + this.name)
        console.log('table = ' + this.table)

        axios.post(url, { table: table })
        .then(function (result) {
          console.log('R: ' + JSON.stringify(result.data))
          for (var i = 0; i < result.data.length; i++) {
            _this.$set(_this.fields, i, result.data[i])
          }
          _this.status = 'loaded'
          console.log('now status = ' + _this.status)
        })
        .catch(function (err) {
          if (err) {
            console.log('Err: ' + err)
          }
          _this.DBFields = []
        })
      } else if (this.url) {
        this.status = 'loaded'

        var urlData = this.urlData
        console.log('Record2: ' + JSON.stringify(this.record))
        if (urlData && this.record) {
          var keys = Object.keys(urlData)
          var fields = Object.keys(this.record)

          for (var i = 0; i < keys.length; i++) {
            for (var j = 0; j < fields.length; j++) {
              var tag = '<' + fields[j] + '>'
              console.log('check ' + urlData[keys[i]] + ' VS ' + tag)
              if (urlData[keys[i]] === tag) {
                console.log('FOUND ' + keys[i] + ' = ' + this.record[fields[j]])
                this.$set(this.urlData, keys[i], this.record[fields[j]])
              }
            }
          }
        }
        console.log('urlData: ' + JSON.stringify(this.urlData))

        axios.post(url, this.urlData)
        .then(function (result) {
          if (result.data && result.data.constructor === String) {
            _this.$set(_this.generated, 'body', result.data)
          } else {
            _this.$set(_this.generated, 'body', JSON.stringify(result))
          }
          _this.status = 'loaded'
          console.log('now status = ' + _this.status)
        })
        .catch(function (err) {
          if (err) {
            console.log('Err: ' + err)
          }
          _this.results = []
        })
        console.log('results')
      } else if (this.body) {
        this.status = 'loaded'
        console.log('body')
      } else {
        this.status = 'loaded'
        console.log('no body')
      }
    },
    methods: {
      showMe () {
        this.isVisible = true
        clearTimeout(this.timeoutID)
      },
      modalClick (data) {
        console.log('Form: ' + JSON.stringify(this.formData))
        if (this.function) {
          this.function()
        }
      },
      oNotification () {
        console.log('on')
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

