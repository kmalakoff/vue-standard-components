// Webpack CSS import

// JS import

<template lang='pug'>
  div
    div(v-if='modal')
      div(v-if="showModal")
        Modal(v-if="showModal" @close="hideM" :record="record" :name="name" :table="modal.table" :button="modal.button" :body="modal.body" :function="modal.function" :url="modal.url" :urlData="modal.urlData")
      div(v-else)
        button.btn.btn-success(id="show-modal" @click.prevent="showM") {{name}}
    div(v-else)
      button.btn.btn-success(@click.prevent="runEvent()") {{name}}
</template>

<script>
import Modal from './../Standard/Modal.vue'
/*

Usage:

  ActionButton(:name="link.name" :type="link.type" :modal="link.modal" :record="data[index]" :link="link")

Input:

  name - name of modal (should be distinct if multiple modals used)
  type - button / modal

Advanced Options:

  record - data record to pass to modal for secondary action
*/
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
    name: {
      type: String
    },
    modal: {
      type: Object
    },
    link: {
      type: Object
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
      console.log('run event ' + JSON.stringify(this.link))
      console.log('data: ' + JSON.stringify(this.record))
      if (this.link.function) {
        console.log('Action: ' + this.link.function.constructor)
        this.link.function({ record: this.record })
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
