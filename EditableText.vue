<!-- Usage:

Generate block on page consisting of:

- title (required)
- subheader (optional)
- footer (optional)

- trigger (optional - execute upon clicking block title... can be used to open modal or control visibility

one of:
- content (optional)

- data (display records using DataGrid)
- data_header (optional header for displayed data)
- alt (optional - if data is empty)
 -->
  <template lang='pug'>
    span
      span(v-if="editable")
        span(v-if="!open")
          button.btn.btn-xs(type='button' v-on:click="open=true")
            icon(name='edit' )
          br
          span(v-html="new_content")
        span(v-if="open")
          button.btn.btn-xs.btn-danger(type='button' @click.prevent="cancelEditor" data-toggle='tooltip' title='cancel')
            icon(name='close')
          span &nbsp; &nbsp;
          button.btn.btn-xs.btn-success(type='button' @click.prevent="closeEditor" data-toggle='tooltip' title='accept changes')
            icon(name='check')
          textarea(style='width:100%' rows=5 v-model="new_content"  @keyup.enter="closeEditor")
      span(v-else)
        span(v-html="content")
  </template>

  <script>
  import 'vue-awesome/icons/edit'
  import 'vue-awesome/icons/close'
  import 'vue-awesome/icons/check'

  export default {
    data () {
      return {
        open: false,
        new_content: '',
        cached_content: ''
      }
    },
    props: {
      editable: {
        type: Boolean,
        default: false
      },
      content: {
        type: String
      },
      onClose: {
        type: Function
      },
      scope: {
        type: String,
        default: 'content'
      }
    },
    computed: {
    },
    created: function () {
      this.cached_content = this.content
      this.new_content = this.content
    },
    methods: {
      closeEditor: function () {
        console.log('close Editor')
        this.open = false
        this.cached_content = this.new_content

        if (this.onClose) {
          console.log('executing external function onClose...')
          this.onClose(this.new_content, this.scope)
        } else { console.log('content not updated external to component') }
      },
      cancelEditor: function () {
        console.log('cancel Editor')
        this.open = false

        this.new_content = this.cached_content
      }
    }
  }
  </script>

<style>
</style>
