<!-- src/components/dbRecordModal.vue -->
// Webpack CSS import
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';

// JS import
import Vue from 'vue';

<template id="modal-template" lang='pug'>
  div
    h2 {{ JSON.stringify(formFields) }}
    transition(name="modal") 
      div.modal-mask
        div.modal-wrapper
          div.modal-container

            div.modal-header
              slot(name="header" v-show="modal-header")
                b {{modalHeader}}

            div.modal-body
              slot(name="body")
                div(v-show="formStatus='loaded'")
                  b {{table}}
                  hr
                  table.table.bordered-table
                    thead
                      th.table-header
                        b Field
                      th.table-header
                        b Value
                    tbody
                      tr(v-for="field in formFields")
                        td.table-prompt {{field.name}}
                        td
                          input.input-lg(type='text' :placeholder="field.type")
                  hr
                  button.btn.btn-primary(v-if="type==='append'") Save 
                div(v-show="formStatus !== 'loaded'")
                  b Loading...
            div.modal-footer
              slot(name="footer")
                b {{modalFooter}}
                button.modal-default-button(@click="$emit('close')")
                  b OK
</template>


<script>

  import { mapState } from 'vuex'
  import axios from 'axios'

  export default {
    data () {
      return {
        modalVisible: false,
        timeoutID: 0,
        showModal: false,
        DBFields: []
      }
    },
    computed: mapState([
      'formTable',
      'formFields',
      'formStatus'
    ]),
    props: {
      table: {
        type: String,
        default: 'Equipment'
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
      status: {
        type: String,
        default: 'pending'
      }
    },

    created: function () {
      var DBfieldUrl = 'http://localhost:1234/Record_API/fields'
      console.log('run : ' + DBfieldUrl)

      var _this = this
      axios.post(DBfieldUrl, { table: this.table })
      .then(function (result) {
        console.log('R: ' + JSON.stringify(result))
        for (var i = 0; i < result.data.length; i++) {
          _this.$set(_this.formFields, i, result.data[i])
        }
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
            _this.$set(_this.formFields, i, result.data[i])
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
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 600px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
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
}

.modal-default-button {
  float: right;
}


/** Customized... ***/

.table-header {
  background-color: #ddd;
  text-align: center;
}

.table-prompt {
  text-align: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>

