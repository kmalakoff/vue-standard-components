<!-- src/components/Help.vue -->

  <template lang='pug'>
    span
      Modal(@close="showModal=false" :title="title" :name="name" :buttonName="demoStep" buttonClass='btn btn-xs btn-warning' :modalBody="message" close='Close')

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
