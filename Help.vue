<!-- src/components/Help.vue -->

  <template lang='pug'>
    div
      Modal(v-if="showModal" @close="showModal=false" :modalBody="message")
      div(v-else v-show="show")
        button.btn.btn-success(id="show-modal" @click="showModal = true")
          div(v-if="demoStep")
            b {{demoStep}}
          div(v-else)
            b ?

  </template>

  <script>
  import Modal from './Modal'

  export default {
    components: {
      Modal
    },
    data () {
      return {
        step: 1,
        showModal: false
      }
    },
    computed: {
      id: function () {
        if (this.demoStep) {
          return 'demoStep' + this.demoStep
        } else {
          return this.name
        }
      }
    },
    props: {
      demoStep: {
        type: String
      },
      name: {
        type: String,
        default: 'help'
      },
      message: {
        type: String
      },
      show: {
        type: Boolean
      }
    }
  }
  </script>

<style>
  
</style>
