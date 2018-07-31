<template lang='pug'>
  <!-- Usage:
    Demo (name="example1" :demo="demo")
  -->
  span
    Help(:show="demo" :demoStep="docs.step" :title='docs.title' :message="docs.message" name='docs.name')
</template>

<script>
  import Help from './../Standard/Help.vue'

  export default {
    name: 'schedule',
    data () {
      return {
        documentation: {
          example1: {
            name: 'staff',
            title: 'Selecting Staff',
            step: '1',
            message: '<h2>message for this step</h2>'
          },
          example2: {
            name: 'patient',
            title: 'Selecting a new Patient',
            step: '2',
            message: '<h2>message for this step</h2>'
          }
        }
      }
    },
    props: {
      name: {
        type: String
      },
      demo: {
        type: Boolean
      }
    },
    components: {
      Help
    },
    computed: {
      docs: function () {
        if (this.documentation[this.name]) {
          console.log('get documentation for ' + this.name)
          return this.documentation[this.name]
        } else {
          console.log('no documentation for ' + this.name)
          return {}
        }
      }
    }
  }
</script>

<style scoped>
</style>
