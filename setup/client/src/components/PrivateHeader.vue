<template lang='pug'>
  div.info-header
    div.col-md-2.info-logo
      a(href='/')
        b.input-lg logo...
    div.col-md-6.info-left
      b.input-lg Name

      <!-- Demo(:demo="demo" name="patient") -->
      <!-- User(role='patient' :user="patient" title='Patient' :globalSearch="userSearch" :fields="userFields") -->
    div.col-md-4
      <!-- navbar-right items listed from right to left ! -->
      span.navbar-right
        Popup(icon='bars')
      span.navbar-right
        b.input-lg Staff:
          span(v-if="payload && payload.staff")
            b {{payload.staff.name}}
          span(v-else)
            b TBD

        <!-- Demo(:demo="demo" name='staff') -->
        <!-- User(role='staff' :user="staff" title='staff' include='staff' :globalSearch="staffSearch" :search="addStaff") -->
</template>

<script>
import User from '@/components/User'
import Demo from '@/components/ovid/Demo'
import Popup from '@/components/Standard/Popup'

import 'vue-awesome/icons/home'
import 'vue-awesome/icons/bars'

export default {
  data () {
    return {
      addStaff: {'user': ['name'], 'staff': ['alias']},
      userFields: ['email', 'name'],
      userSearch: false,
      staffSearch: true
    }
  },
  components: {
    User,
    Demo,
    Popup
  },
  props: {
    searchOpen: {
      type: Boolean,
      default: false
    },
    patient: {
      type: Object,
      default () { return {} }
    },
    staff: {
      type: Object,
      default () { return {} }
    },
    demo: {
      type: Boolean
    },
    payload: {
      type: Object
    }
  },
  methods: {
    setPatient (data) {
      console.log('set Patient')
      console.log(JSON.stringify(data))

      var keys = Object.keys(data[0])
      for (var i = 0; i < keys.length; i++) {
        this.$set(this.patient, keys[i], data[0][keys[i]])
      }

      console.log(JSON.stringify(this.patient))
    },
    setStaff (data) {
      console.log('set Staff')
      console.log(JSON.stringify(data))

      var keys = Object.keys(data[0])
      for (var i = 0; i < keys.length; i++) {
        this.$set(this.staff, keys[i], data[0][keys[i]])
      }
      console.log(JSON.stringify(this.staff))
    },
    clearPatient () {
      if (this.patient) {
        var keys = Object.keys(this.patient)
        for (var j = 0; j < keys.length; j++) {
          this.$delete(this.patient, keys[j])
        }
      } else { console.log('patient already empty') }
    },
    clearStaff () {
      if (this.staff) {
        var keys = Object.keys(this.staff)
        for (var j = 0; j < keys.length; j++) {
          this.$delete(this.staff, keys[j])
        }
      } else { console.log('staff already empty') }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.info-header {
  padding: 10px;
  height: 60px;
  background-color: #EEE;
}
.info-logo {
  text-align: left;
}

.info-left {
  text-align: left;
}

.info-right {
  text-align: right;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

</style>
