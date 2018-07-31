<!-- src/components/Picked.vue -->

<template lang='pug'>
  div(v-if='picked && picked[scope] && picked[scope].length')
    ul
      li(v-for='chose in picked[scope]')
        b {{chose.label}} : {{chose.id}} &nbsp; &nbsp;
        button(@click="deselect(chose.id)") x
</template>

<script>
import { mapState } from 'vuex'

export default {

  data () {
    return {
    }
  },

  props: {
    scope: {
      type: String
    }
  },

  computed: mapState([
    'picked',
    'searchStatus'
  ]),

  methods: {
    deselect (id) {
      this.$store.commit('unselectOne', {scope: this.scope, id: id})
    }
  }

}
</script>
