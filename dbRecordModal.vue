<!-- src/components/dbRecordModal.vue -->
// Webpack CSS import

// JS import
import Vue from 'vue';

<template id="modal-template" lang='pug'>
  div
    transition(name="modal") 
      div.modal-mask
        div.modal-wrapper
          div.modal-container

            div.modal-header
              slot(name="header" v-show="modal-header")
                b {{modalHeader}}

            div.modal-body
              slot(name="body")
                div(v-show="loadStatus==='loaded'")
                  h3 {{table}}
                  hr
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
                          input(type='text' :placeholder="field.type")
                  hr
                  div(v-if="modalButton")
                    button.btn.btn-primary(v-if="type==='append'" @click.prevent="modalAction()") {{modalButton}} 

                div(v-show="loadStatus !== 'loaded'")
                  b Loading...
                  img(src="./../../assets/spinning_wheel.gif" style="height: 100px")
            div.modal-footer
              slot(name="footer")
                b {{modalFooter}}
                button.modal-default-button.btn-danger(@click="$emit('close')")
                  b Cancel
</template>

<script>
  import axios from 'axios'

  export default {
    data () {
      return {
        modalVisible: false,
        timeoutID: 0,
        showModal: false,
        status: 'pending'
      }
    },
    props: {
      table: {
        type: String,
        default: 'Equipment'
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
        type: String
      },
      modalFooter: {
        type: String
      },
      modalBody: {
        type: String,
        default: 'Content...'
      },
      modalButton: {
        type: String
      },
      modalAction: {
        type: Function
      }
    },
    computed: {
      loadStatus: function () {
        return this.status
      }
    },
    created: function () {
      var DBfieldUrl = 'http://localhost:1234/Record_API/fields'
      console.log('DB run : ' + DBfieldUrl)

      var _this = this
      console.log('status = ' + this.status)
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
    },

    methods: {
      loadTable () {
        var DBfieldUrl = 'http://localhost:1234/Record_API/fields'
        console.log('run : ' + DBfieldUrl)

        var _this = this
        axios.post(DBfieldUrl, { table: this.table })
        .then(function (result) {
          console.log('R: ' + JSON.stringify(result))
          for (var i = 0; i < result.data.length; i++) {
            _this.$set(_this.fields, i, result.data[i])
          }
        })
        .catch(function (err) {
          if (err) {
            console.log('Err: ' + err)
          }
          this.DBFields = []
        })
      },
      showMe () {
        this.modalVisible = true
        clearTimeout(this.timeoutID)
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
  box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.2) !important;
  -webkit-flex: 1 !important;
  -ms-flex: 1 !important;
  flex: 1 !important;
  width: 100% !important;
  margin: 100px auto;
  padding: 20px 30px;
  background-color: #eee;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
  color: #333;
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

