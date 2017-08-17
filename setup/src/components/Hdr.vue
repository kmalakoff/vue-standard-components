<template>
  <div id="header">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'header'
}
</script>

<style>
#header {
  background-color: #ccf;
  padding: 5px;
  padding-left: 50px;
  padding-right: 30px;
}

</style>
