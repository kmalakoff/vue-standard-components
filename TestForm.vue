<template lang="pug">
  div.container
    div.myForm-image
      img.myForm.underlay(:src='image')
      svg.myForm.overlay(v-if='labelled')
        ellipse(:cx='cx' :cy='cy' :rx='rx' :ry='ry' :fill='fill' :stroke='stroke' :stroke-width='strokeWidth')
    div.form.myForm-form
      p {{currentID[0]}}
      DBForm(:options='options' :record='example' :onSave='savePassport' :action='savePassport' method='get' :debug='debug')
      div
        input.input-lg(type='checkbox' v-model='example.agree')
        b {{agreement}}
        hr
        Modal(id='agreement' :options='confirm_options')

</template>
<script>
// import axios from 'axios'
import DBForm from './../Standard/DBForm'
import Modal from './../Standard/Modal'
import DBFormElement from './../Standard/DBFormElement'
import kyc from '@/assets/kyc/forms.js'
// import config from '@/config.js'

export default {
  components: {
    DBForm,
    Modal,
    DBFormElement
    // Messaging
  },
  data () {
    return {
      debug: true,
      focus: 'gender',
      cx: '',
      cy: '',
      rx: '',
      ry: '',
      fill: 'transparent',
      stroke: '',
      strokeColour: 'red',
      strokeWidth: 3,
      labels: {
        name: [190, 80, 70, 15],
        birthdate: [190, 117, 70, 15],
        gender: [138, 135, 15, 15]
      },
      labelled: false,
      forms: kyc.forms,
      myFields: [
        {name: 'name', type: 'text'},
        {name: 'birthdate', type: 'date', prompt: 'Birth Date'},
        {name: 'timestamp', type: 'time', prompt: 'Timestamp'},
        {name: 'kids', type: 'number', prompt: '# of Kids'},
        {name: 'gender', type: 'radio', options: ['M', 'F'], prompt: 'Gender'},
        {name: 'country', type: "enum('Canada', 'USA')", prompt: 'Country'},
        {name: 'agree', type: 'checkbox', prompt: 'I do agree'},
        {name: 'notyet', type: 'checkbox', prompt: 'I may agree'},
        {name: 'Rchoice', type: 'radio', options: ['A', 'B'], prompt: 'A or B'},
        {name: 'Cchoice', type: 'checkbox', options: ['C', 'D'], prompt: 'C and/or D'}
      ],
      example: {
        name: 'Jimmy Cliff',
        birthdate: '1977-02-07',
        kids: 4,
        gender: 'M',
        agree: true,
        notyet: false,
        Rchoice: 'B',
        Cchoice: ['C', 'D']
      },
      confirmed: false,

      show: '',
      image: '/static/images/kyc/passport.png',
      agreement: 'I agree..',
      confirm_options: {
        onSave: this.saveForm,
        type: 'confirm',
        prompt: this.agreement,
        openButton: 'Confirm'
      }
    }
  },
  computed: {
    options: function () {
      return {
        fields: this.myFields,
        context: 'Passport',
        access: 'append',
        title: 'Passport Form',
        onFocus: this.onFocus,
        onBlur: this.onBlur
      }
    },
    prompt: function (field) {
      return field.prompt || field.name
    }
  },
  props: {
    payload: {
      type: Object,
      default () { return {} }
    },
    currentID: {
      type: Array,
      default () { return [] }
    },
    onSave: {
      type: Function,
      default: null
    }
  },
  created: function () {
    if (!this.confirmed) {
      this.myFields.push({name: 'confirm', type: 'checkbox', prompt: 'I agree to this stuff...'})
      this.confirmed = true
    }
    this.$store.dispatch('clearMessages')
  },
  methods: {
    annotate: function (model) {
      console.log('draw ' + model)
      this.focus = model
      var specs = this.labels[model]
      if (specs) {
        console.log('specs: ' + specs.join(', '))
        this.cx = specs[0]
        this.cy = specs[1]
        this.rx = specs[2]
        this.ry = specs[3]
        this.labelled = true
        this.stroke = this.strokeColour
        console.log('draw: ' + this.cx + ', ' + this.cy + ', ' + this.rx + ', ' + this.ry + ':  ')
      } else {
        console.log('no label for ' + model)
      }
    },
    onFocus: function (evt, model) {
      console.log('looking at ' + model)
      this.annotate(model)
    },
    onBlur: function (evt, model) {
      console.log('look away')
      this.stroke = ''
    },
    savePassport: function (form) {
      console.log('passport form: ' + JSON.stringify(form))
      if (this.onSave) {
        form.type = 'passport'
        this.onSave(form)
      }
    }
  }
}
</script>

<style scoped lang="sass?outputStyle=expanded">
$header-height: 150px;
$subheader-height: 80px;
$image-height: 265px;
$image-width: 400px;
$image-narrow-ypos: calc(100vh - #{$image-height} - 20px);
$image-wide-ypos: calc(#{$header-height} + #{$subheader-height} + 40px);
$myForm-xpos: calc(#{$image-width} + 2rem);
$myForm-height: calc(100vh - #{$image-height} - #{$header-height} - 80px);

.myForm-container {
  padding: 5rem;
}

.form {
  z-index: 1;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.myForm-form {
  padding-left: $myForm-xpos;
  display: inline-block;
  vertical-align: top;
  width: 100%;
}
.myForm-image {
  width: $image-width;
  height: $image-height;
  vertical-align: top;
  display: inline-block;
  position: fixed;
  top: $image-wide-ypos;
}

.myForm-container {
  padding-left: 5rem;
  padding-right: 5rem;
}

.image-spacer {
  display: none;
}

@media screen and (max-width: 1200px) {
  .myForm-form {
    padding-left: 2rem;
    width: 100%;
    max-height: $myForm-height;
    overflow: scroll;
  }
  .myForm-container {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  .myForm-image {
    display: block;
    position: fixed;
    top: $image-narrow-ypos;
    width: 0;
  }
}

img.myForm.underlay {
  position: absolute;
  height: $image-height;
  width: $image-width;
  z-index:1;
}
svg.myForm.overlay {
  position: absolute;
  height: $image-height;
  width: $image-width;
  z-index: 5;
}
</style>
