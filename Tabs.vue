<template lang='pug'>
  div
    span(v-for='item in list')
      a(href='#' target='_blank' @click.prevent="onClick(item)" v-bind:class="[{onPage: show===item}, {offPage: show!==item}]")
        b.submenu {{item}}
        span &nbsp; &nbsp;
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },
    default: {
      type: String,
      default: ''
    },
    pick: {
      type: Function,
      default () {
        return null
      }
    }
  },
  data () {
    return {
      show: this.default
    }
  },
  methods: {
    onClick: function (el) {
      console.log(' pick ' + JSON.stringify(el))
      if (this.pick) {
        this.show = el
        this.pick(el)
      }
    }
  }
}
</script>

<style scoped>
.onPage {
  color: black;
  font-weight: bold;
  // background-color: grey !important;
}
.onPage:hover {
  color: black;
  // background-color: grey !important;
}
.offPage {
  // background-color: grey !important;
  color: grey;
}
.offPage:hover {
  // background-color: darkgrey !important;
  color: black;
}
</style>
