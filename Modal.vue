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
                div(v-if="header")
                  h2 {{header}}

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
                      div(v-if="modalButton")
                        button.btn.btn-primary(v-if="type==='append'" @click.prevent="modalClick()") {{modalButton}} 

                    div(v-show="loadStatus !== 'loaded'")
                      b Loading...
                      img(src="./../../assets/spinning_wheel.gif" style="height: 100px")

                div(v-else) 
                  div(v-html="modalBody")
                  div(v-if="modalButton")
                    button.btn.btn-primary(v-if="type==='append'" @click.prevent="modalClick()") {{modalButton}} 

            div.modal-footer
              slot(name="footer")
                b {{modalFooter}}
                button.btn.btn-danger(@click="$emit('close')") {{closeButton}}
</template>

<script>
  import axios from 'axios'

  export default {
    data () {
      return {
        modalVisible: false,
        timeoutID: 0,
        showModal: false,
        status: 'pending',
        formData: {}
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

      modalHeader: {
        type: String,
        default: ''
      },
      modalBody: {
        type: String,
        default: 'body'
      },
      modalFooter: {
        type: String,
        default: ''
      },
      modalButton: {
        type: String
      },
      modalAction: {
        type: Function
      },
      close: {
        type: String
      }
    },
    computed: {
      loadStatus: function () {
        return this.status
      },
      header: function () {
        if (this.modalHeader) {
          return this.modalHeader
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
      }
    },
    created: function () {
      if (this.table) {
        var DBfieldUrl = 'http://localhost:1234/Record_API/fields'
        console.log('Modal run : ' + DBfieldUrl)

        var _this = this
        console.log('status = ' + this.status)
        console.log('name = ' + this.name)
        console.log('table = ' + this.table)

        axios.post(DBfieldUrl, { table: this.table })
        .then(function (result) {
          console.log('R: ' + JSON.stringify(result))
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
      } else {
        console.log('no table ref')
      }
    },
    methods: {
      showMe () {
        this.modalVisible = true
        clearTimeout(this.timeoutID)
      },
      modalClick () {
        console.log('Form: ' + JSON.stringify(this.formData))
        this.modalAction()
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
  // background-color: #666;
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

