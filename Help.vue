<!-- src/components/Help.vue -->

  <template lang='pug'>
    span
      Modal(v-if="showModal" @close="showModal=false" :title="title" :name="name" :modalBody="message" close='Close')
      span(v-else v-show="show")
        button.btn.btn-danger.btn-xs(id="show-modal" @click="showModal = true")
          span(v-if="demoStep")
            b {{demoStep}}
          span(v-else)
            b ?
        span &nbsp;

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
      title: {
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
