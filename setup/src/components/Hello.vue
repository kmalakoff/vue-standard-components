<template lang='pug'>
  div.page
    div.header
      PublicHeader(left='LH' right='RH' centre='CH')
    div.subheader.overlay
      CustomMenu(:links='links' type='url')
    div.body.container
      <!-- img.bg -->
      div.overlay
        Block(content="main block content...")
    div.footer.overlay
      PublicFooter(left="left" centre="<h3>centre</h3>" right="right")

</template>

<script>
import config from './../config.js'
import PublicHeader from './PublicHeader'
import PublicFooter from './PublicFooter'
import CustomMenu from './Standard/Menu'
import Block from './Standard/Block'

var links = config.complexLinks || ['Main']

export default {
  name: 'hello',
  components: {
    PublicHeader,
    CustomMenu,
    Block,
    PublicFooter
  },
  data () {
    return {
      msg: 'Welcome to My Vue.js App',
      // ################## Add Link List Below for Testing ######################
      links: links
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass?outputStyle=expanded">

/*** Customize Header / Footer Settings: ***/
$header-height: 80px;
$header-background-colour: #999;
$header-padding: 10px 30px;

$subheader-height: 50px;
$subheader-background-colour: transparent;

$footer-height: 90px;
$footer-colour: black;
$footer-background-colour: #ccc;

$body-colour: black;

.page {
  /*margin-top: -20px;*/
  height: 100%;
  width: 100%;
}

.header {
  height: $header-height;
  background-color: $header-background-colour;
  padding: $header-padding;

}
.footer {
  background-color: $footer-background-colour;
  color: $footer-colour;
  height: $footer-height;
  width: 100%;
  
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 15px;
  padding-bottom: 15px;
}

.subheader {
  background-color: $subheader-background-colour;
  color: white;
  height: $subheader-height;
  width: 100%;
  z-index: 10000;
}

.body {
  padding-top: $subheader-height;
  min-height: calc(100vh - #{$header-height} - #{$footer-height});
  color: $body-colour;
  z-index: 10000;
}

img.bg {
  z-index: -1;
  /* Set rules to fill background */
  min-height: 100%;
  /*min-width: 1024px;*/
  /*background-image: url("/static/images/teapour.jpeg");*/
/* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  /*background-color: rgba(255, 255, 0, 0.3);*/

  z-index: 0;
  opacity: 20%;

  /* Set up proportionate scaling */
  width: 100%;
  height: auto;
  
  /* Set up positioning */
  position: fixed;
  top: calc(#{$header-height});
  left: 0;
}

@media screen and (max-width: 1024px) { /* Specific to this particular image */
  img.bg {
    left: 50%;
    /*margin-left: -512px;   /* 50% */
  }
}

.overlay {
  position: absolute;
}

.navbar-centre
{
    position: absolute;
    width: 100%;
    left: 0;
    text-align: center;
    margin:0 auto;
}
</style>
