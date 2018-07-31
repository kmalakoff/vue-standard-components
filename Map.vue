<!-- src/components/Help.vue -->

  <template lang='pug'>
    span.mapBlock(:id="mapId")
      b Map: {{title}} [{{markers.length}} places] {{index}}
      hr
      div.col-md-2
        ul
          li(v-for="(m, index) in markers")
            a(href='#' onclick='return false' @click="onPick(m.id)" @mouseover="onHover(index)" @mouseout="onBlur(index)")
              span.li-highlight(v-if='highlight[index]') {{m.label.text}}: {{m.name}}
              span.li-plain(v-else) {{m.label.text}}: {{m.name}}
      div.col-md-10#mapSubBlock
        gmap-map.google-map(:center="cent" :zoom="zoom" :style="style" ref='gmap')
          gmap-marker(
            :key="index"
            v-for="(m, index) in markers"
            :label="m.label.text"
            :position="m.position"
            :clickable="true"
            :draggable="true"
            ref='markers'
            @click="center=m.position"
            @mouseover="onHover(index)"
            @mouseout="onBlur(index)"
          )
  </template>

<script async defer src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=initialize"></script>

  <script>
  import config from '@/config.js'
  import * as VueGoogleMaps from 'vue2-google-maps'
  import Vue from 'vue'

  Vue.use(VueGoogleMaps, {
    load: {
      key: config.keys.googleAPI,
      // v: 'OPTIONAL VERSION NUMBER',
      libraries: 'places' // If you need to use place input
    }
  })

  export default {
    components: {
    },
    data () {
      return {
        // ** Test Data **/
        mapId: this.name + 'Map' + '-' + this.id,
        highlight: [false, true],
        cent: {lat: 48.204, lng: 16.2},
        zoom: 7,
        googleMapsInitialized: false
      }
    },
    // mounted: function () {
    //   const element = document.getElementById(this.mapId)
    //   const options = {
    //     zoom: 14,
    //     center: this.center
    //   }
    //   console.log(this.mapId + ' element: ' + element)
    //   console.log('options: ' + JSON.stringify(options))
    //   if (this.index) {
    //     this.$set(this.highlight, this.index, true)
    //   }
    // },
    created: function () {
      var key = config.keys.googleAPI
      console.log('retrieved google API key: ' + key)
    },
    computed: {
      style: function () {
        if (this.map && this.map.style) {
          return this.map.style
        } else {
          return 'height: 400px; width: 600px'
        }
      },
      center: function () {
        if (this.map && this.map.center) {
          console.log('found center: ' + JSON.stringify(this.map.center))
          return this.map.center
        } else {
          console.log('no center defined')
          return {lat: 10.0, lng: 10.0}
        }
      },
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
    mounted () {
      this.googleMapsInitialized = true // define this property in data
      if (!this.googleMapsInitialized) { return null }
      this.fitBounds()
    },
    methods: {
      initialize: function () {
        console.log('callback to initialize...')
      },
      fitBounds: function () {
        console.log('fit bounds..')
        var bounds = new window.google.maps.LatLngBounds()
        console.log('bounds: ' + JSON.stringify(bounds))
        for (var i = 0; i < this.markers.length; i++) {
          var num = i + 1
          console.log('set label to ' + num.toString())
          this.$set(this.markers[i], 'number', num)

          bounds.extend(this.markers[i].position)
          console.log('add ' + JSON.stringify(this.markers[i].position))

          console.log('find ' + this.markers[i].label.text)
          var mrkr = document.getElementById(this.markers[i].label.text)
          if (mrkr) {
            console.log('mrkr: ' + mrkr.constructor)
            mrkr.innerHTML = '<b>X</b>'
          }
        }
        console.log('fit it...')
        this.$refs.gmap.fitBounds(bounds)
      },
      onPick: function (index) {
        console.log('onpick...' + index)
        if (!this.googleMapsInitialized) { return null }
        this.fitBounds()

        console.log('continue..')
        if (this.onClick) {
          return this.onClick(index)
        } else {
          console.log('no onclick function')
        }
      },
      onHover: function (index) {
        console.log('hover over ' + index)
        var ref = 'marker'
        console.log('bounce ' + ref)
        this.$refs.markers[index].$markerObject.setAnimation(1)
        this.$set(this.highlight, index, true)
      },
      onBlur: function (index) {
        console.log('blur ' + index)
        this.$refs.markers[index].$markerObject.setAnimation(0)
        this.$set(this.highlight, index, false)
      }
    },
    props: {
      title: {
        type: String
      },
      id: {
        type: String,
        default: 'gmap'
      },
      name: {
        type: String,
        default: 'default'
      },
      map: {
        type: Object
      },
      markers: {
        type: Array,
        default () { return [{}] }
      },
      index: {
        type: Number
      },
      options: {
        type: Object
      },
      onClick: {
        type: Function
      }
    }
  }
  </script>

<style>

.li-plain {
  color: normal;
}
.li-highlight {
  color: blue;
  font-weight: bold;
}

.google-map {
  /*min-width: 800px;*/
  /*min-height: 600px;*/
  margin: 0 auto;
  background: gray;
  border: 3px solid black;

}
</style>
