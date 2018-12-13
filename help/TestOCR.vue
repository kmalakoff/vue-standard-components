<template lang='pug'>
  div.container
    table.table
    div(v-for="image,i in images")
      tr
        td.testid
          b raw file: {{image}}
          p &nbsp;
          img.test(:src='image')
          p &nbsp;
          p
            button.btn.btn-primary(v-on:click='readImage(image, i)') Read Image
        td
          p {{text[i]}}
      tr
        td(colspan=2)
          hr
    hr
</template>

<script>
import Tesseract from 'tesseract.js'

export default {
  props: {
  },
  data () {
    return {
      images: [
        '/static/images/kyc/passport.png',
        '/static/images/kyc/test_image1.jpg',
        '/static/images/kyc/test_image2.jpg',
        '/static/images/kyc/test_image3.jpg',
        '/static/images/kyc/test_image4.jpg'
      ],
      text: []
    }
  },
  created: function () {
    for (var i = 0; i < this.images.length; i++) {
      this.$set(this.text, i, '')
    }
    console.log('cleared text')
  },
  components: {
  },
  methods: {
    readImage: function (myImage, i) {
      // const myImage = require('path').resolve(__dirname, 'cosmic.png');
      this.$set(this.text, i, 'reading image...(this can take 20 - 30 seconds)')
      console.log('attempting OCR on ' + myImage)
      try {
        Tesseract.recognize(myImage)
          // .progress(message => console.log('m:' + JSON.stringify(message)))
          .catch(err => console.error('e:' + JSON.stringify(err)))
          .then(result => {
            console.log('got ' + result)
            var text = result.text
            // console.log('r:' + JSON.stringify(data))
            console.log('*******************************')
            console.log(text)
            this.$set(this.text, i, text)
          })
          .finally(resultOrError => console.log('re=:' + resultOrError))
      } catch (err) {
        console.log('ERROR: ' + err)
        this.$set(this.text, i, 'Error: ' + err)
      }
    }
  }
}
</script>

<style scoped>
.testid {
  // border: 1px solid black;
}
img.test {
  height:300px;
}
</style>
