<!-- src/components/Help.vue -->

  <template lang='pug'>
    span.standard-legend
      b {{title}}
      table.table.table-bordered
        tr(:class='baseClass')
          td.legend-cell(v-for='key in keys' :class='key')
            span {{key}}

  </template>

<script>
export default {
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
    altkeys: function () {
      if (this.demoStep) {
        return 'demoStep' + this.demoStep
      } else {
        return this.name
      }
    },
    dynamicClass: function () {
      var key = 'covered'
      return 'result-row result-cell ' + key
    }
  },
  props: {
    keys: {
      type: Array
    },
    baseClass: {
      type: String
    },
    title: {
      type: String
    },
    show: {
      type: Boolean
    }
  }
}
</script>

<style>

table tr td {
  border: solid black 3px;
}
.standard-legend {
  text-align: center;
}
.legend-cell {

}
</style>
