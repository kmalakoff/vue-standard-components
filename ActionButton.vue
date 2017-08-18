// Webpack CSS import

// JS import

<template lang='pug'>
  div
    div(v-if='modalButton')
      div(v-if="showModal")
        Modal(v-if="showModal" table='user' type='append' @close="hideM" :modalAction="runModalEvent" :modalButton="modalButton" :modalBody="modalBody" :modalFooter="modalFooter")
      div(v-else)
        button.btn.btn-success(id="show-modal" @click.prevent="showM") M= {{buttonName}}
    div(v-else)
      button.btn.btn-success(@click.prevent="runEvent()") {{buttonName}}
</template>

<script>
import Modal from './../Standard/Modal.vue'

export default {
  name: 'immunize',
  data () {
    return {
      status: 'loaded',
      showModal: false
    }
  },
  components: {
    Modal
  },
  props: {
    buttonName: {
      type: String
    },
    buttonAction: {
      type: Function
    },
    modalButton: {
      type: String
    },
    modalAction: {
      type: Function
    },
    modalHeader: {
      type: String
    },
    modalBody: {
      type: String
    },
    modalFooter: {
      type: String
    },
    record: {
      type: Object
    }
  },
  computed: {
    visibleModal: function () {
      return this.showModal
    }
  },
  methods: {
    showM () {
      this.showModal = true
    },
    hideM () {
      this.showModal = false
    },
    runEvent () {
      console.log('run ' + this.buttonName)
      console.log('data: ' + JSON.stringify(this.record))
      if (this.buttonAction) {
        console.log('Action: ' + this.buttonAction.constructor)
        this.buttonAction({ record: this.record })
      }
      console.log(JSON.stringify(this.record))
      return false
    },
    runModalEvent () {
      console.log('run ' + this.buttonName)
      console.log('data: ' + JSON.stringify(this.record))
      if (this.buttonAction) {
        console.log('Action: ' + this.buttonAction.constructor)
        this.buttonAction({ record: this.record })
      }
      console.log(JSON.stringify(this.record))
      return false
    },
    openModal () {
      console.log('open modal')
      this.$refs.modal.open('mod1')
    },

    runAction () {
      console.log('run action')
    }
  }
}
</script>

<style scoped>
</style>
