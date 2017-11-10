<!-- src/components/Help.vue -->

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
    div.block
      div.block-header(v-if="title || subheader")
        div(v-if="title") 
          a(href='#' onClick='return false' v-on:click="Trigger()")
            h2 {{title}}
      div.block-subheader(v-if='subheader' v-html="subheader")
      div.block-body
        div(v-if="data && data.length")
          DataGrid(:data="data" :header="data_title" :data_options="data_options")
        div(v-else)
          div(v-if="alt")
            EditableText(:content="alt" :onClose="editText" :editable="editable") 
          div(v-if="content")
            EditableText(:content="content" :onClose="editText" :editable="editable")  
      div.block-footer(v-html="footer")
  </template>

  <script>
  import DataGrid from './DataGrid'
  import EditableText from './EditableText'

  export default {
    components: {
      DataGrid,
      EditableText
    },
    data () {
      return {
        visible: true
      }
    },
    props: {
      title: {
        type: String
      },
      trigger: {
        type: Function
      },
      subheader: {
        type: String
      },
      content: {
        type: String
      },
      footer: {
        type: String
      },
      data: {
        type: Array
      },
      data_options: {
        type: Object
      },
      data_title: {
        type: String
      },
      alt: {
        type: String
      },
      updateContent: {
        type: Function
      },
      editable: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      id: function () {
        return 1
      }
    },
    methods: {
      Trigger () {
        if (this.trigger) {
          console.log('call trigger')
          this.trigger()
          console.log('ok')
        } else {
          console.log('no trigger')
        }
      },
      editText (newContent) {
        if (this.updateContent) {
          console.log('update content based on input prop function')
          this.updateContent(newContent)
        } else {
          console.log('require input prop functio updateContent to update content')
        }
      }
    }
  }
  </script>

<style>
  .block {
    padding: 0px;
    border: 1px solid black;
    min-height: 200px;
  }

  .block-header {
    padding: 10px;
    background-color: #ccc;
  }
  .block-subheader {
    padding: 10px;
    background-color: #ddd;
  }  
  .block-body {
    padding: 20px;
  }
  .block-footer {
    padding: 20px;
    background-color: '#eee';
  }
</style>
