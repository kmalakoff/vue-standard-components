<template lang='pug'>
  div.page
    Sparc
</template>

<script>
import config from '@/config.js'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'
import CustomMenu from '@/components/Standard/Menu'
import Sparc from '@/components/sparc/Main'

var links = config.complexLinks || ['Main']

export default {
  name: 'hello',
  components: {
    PublicHeader,
    CustomMenu,
    Sparc,
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
$margin-background-colour: white;
$default-padding: 40px 50px;
$margin-colour: darkgrey;

$header-height: 200px;
$header-font-size: 40px;

$footer-height: 100px;
$footer-font-size: 20px;

$subheader-height: 50px;
$submargin-background-colour: transparent;

$body-background-colour: #9a9;
$body-colour: black;

.page {
  /*margin-top: -20px;*/
  height: 100%;
  width: 100%;
}

.header {
  height: $header-height;
  color: $margin-colour;
  background-color: $margin-background-colour;
  padding: $default-padding;
  font-size: $header-font-size;
}
.footer {
  background-color: $margin-background-colour;
  color: $margin-colour;
  height: $footer-height;
  padding: $default-padding;
  font-size: $footer-font-size;
  width: 100%;

  padding-left: 40px;
  padding-right: 40px;
  padding-top: 15px;
  padding-bottom: 15px;
}

.a {
  color: $margin-colour;
}

.subheader {
  background-color: $submargin-background-colour;
  color: white;
  height: $subheader-height;
  width: 100%;
  z-index: 10000;
}

.body {
  padding-top: $subheader-height;
  min-height: calc(100vh - #{$header-height} - #{$footer-height});
  background-color: $body-background-colour;
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
