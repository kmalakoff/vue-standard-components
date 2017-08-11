// Webpack CSS import

// JS import

<template lang='pug'>
  div
    div(v-if="showModal")
      dbRecordModal(v-if="showModal" table='user' type='append' @close="showModal=false")
    div(v-else)
      button.btn.btn-success(id="show-modal" @click.prevent="runEvent()") {{buttonName}}
</template>

<script>
import dbRecordModal from './../Standard/dbRecordModal.vue'

export default {
  name: 'immunize',
  data () {
    return {
      status: 'loaded',
      showModal: false
    }
  },
  components: {
    dbRecordModal
  },
  props: {
    buttonName: {
      type: String
    },
    buttonAction: {
      type: Function
    },
    record: {
      type: Object
    }
  },
  methods: {
    runEvent () {
      console.log('run ' + this.buttonName)
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
