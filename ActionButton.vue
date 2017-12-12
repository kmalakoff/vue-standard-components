// Webpack CSS import

// JS import

<template lang='pug'>
  div
    div(v-if="link && link.modal && link.modal.onPick")
      button.btn.btn-success(@click.prevent="link.modal.onPick(record)") P:{{name}}
    div(v-else-if="link && link.function")
      button.btn.btn-success(@click.prevent="link.function(record)") F:{{name}}
    div(v-else-if="link && link.url")
      a(:href='link.url' target='_blank')
        button.btn.btn-success N:{{link.name}}
    div(v-else)
      b {{link.name}}
</template>

<script>
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
  },
  props: {
    name: {
      type: String
    },
    function: {
      type: Function
    },
    modal: {
      type: Object
    },
    link: {
      type: Object
    },
    record: {
      type: Object
    },
    modal_options: {
      type: Object
    },
    links: {
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
