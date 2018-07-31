<!-- src/components/Standard/Upload.vue -->

<!-- Usage:

Generate block for uploading data from excel file:

 -->
  <template lang='pug'>
    div
      form(enctype="multipart/form-data" novalidate v-if="isInitial || isSaving")
        h1 Upload File(s)
        div.dropbox
          input.input-file(type='file' multiple :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount=$event.target.files.length" accept="image/*")
          p(v-if='isInitial')
            b Drag your file(s) here to begin
            b ...or click to browse
          p(v-else)
            img(src="./../../assets/spinner.gif" style="height: 100px")
            br
            b Uploading {{ fileCount }} files...
        hr
        <!-- button.btn.btn-primary(type='button' @click.prevent='uploadFile') Upload File -->

      <!-- Success / Failure Notification -->
      div(v-else-if='isSuccess')
        h2 Uploaded {{ uploadedFiles.length }} file(s).
        p
          a(href='javascript:void(0)' @click="reset()") Upload again
        div(v-if='uploadedFiles && uploadedFiles.length')
          b {{uploadedFiles}}
          <!-- ul.list-unstyled -->
            <!-- li(v-for="item in uploadedFiles") -->
              <!-- img(:src="item.url" class="img-responsive img-thumbnail" :alt="item.originalName") -->
      div(v-else-if='isFailed')
        h2 Upload Failed
        p
          a(href='javascript:void(0)' @click="reset()") Try again
          pre {{uploadError}}
      div(v-else)
        h2 Unrecognized result ... ?
  </template>

<script>
import Messaging from './Messaging.vue'
import { upload } from './../../services/file-upload.service'

const STATUS_INITIAL = 0
const STATUS_SAVING = 1
const STATUS_SUCCESS = 2
const STATUS_FAILED = 3

export default {
  components: {
    Messaging
  },
  data () {
    return {
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: 'untitled',
      fileCount: 0
    }
  },
  props: {
    type: {
      type: String,
      defaultTo: 'excel'
    }
  },
  computed: {
    isInitial: function () {
      return this.currentStatus === STATUS_INITIAL
    },
    isSaving: function () {
      return this.currentStatus === STATUS_SAVING
    },
    isSuccess: function () {
      return this.currentStatus === STATUS_SUCCESS
    },
    isFailed: function () {
      return this.currentStatus === STATUS_FAILED
    }
  },
  methods: {
    uploadFile (file) {
      console.log('upload ' + file)
    },
    // uploadToDB (data) {
    //   console.log('upload to database')
    // },
    // filesChange (data) {
    //   console.log('reload files based on change')
    // },
    reset () {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL
      this.uploadedFiles = []
      this.uploadError = null
    },
    save (formData) {
      // upload data to the server
      this.currentStatus = STATUS_SAVING

      upload(formData)
        .then(x => {
          this.uploadedFiles = [].concat(x)
          this.currentStatus = STATUS_SUCCESS
        })
        .catch(err => {
          console.log(JSON.stringify(err))
          this.uploadError = err.response || 'error uploading file(s)'
          this.currentStatus = STATUS_FAILED
        })
    },
    filesChange (fieldName, fileList) {
      // handle file changes
      const formData = new FormData()

      if (!fileList.length) return

      // append the files to FormData
      Array
        .from(Array(fileList.length).keys())
        .map(x => {
          formData.append(fieldName, fileList[x], fileList[x].name)
        })
        // save it
      this.save(formData)
    }
  },
  mounted: function () {
    this.reset()
  }
}
</script>

<style >
  .block {
    padding: 0px;
    /*border: 1px solid black;*/
    min-height: 200px;
  }
  .dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
    padding: 10px 10px;
    min-height: 220px; /* minimum height */
    position: relative;
    cursor: pointer;
  }
  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }

  .dropbox:hover {
    background: lightblue; /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
</style>
