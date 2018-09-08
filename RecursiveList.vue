<!-- src/components/RecursiveList.vue -->

<!-- Usage:
  Generates a recursive list of items in which child items may be toggled on and off via their parent.

  Input:
    - list (array of hashes MUST include keys for 'id, name, parent')
    - [onPick]  (function to run when individual item is clicked on)
    - [onSelect]  (function to run when individual item is selected using checkbox)

  Options:
    - nameKey (key for name value (defaults to 'name'))
    - idKey (key for name value (defaults to 'id'))
    - parentKey (key for name value (defaults to 'parent_id'))
    - clear (start with empty list of preselected values)
    - open (selected or all) - indicates which parent branches are initially open

    - selectOne (toggle items one at a time, closing list automatically upon selection)
    - selectable (enable users to toggle individual items on and off using checkbox)

    - selectText (text prompt to trigger individual select method)
    - showSelect (method to determine if selectText option is available for each record)

    - showSelect (optional method to enable dynamic visibility for selecting single items)
    -
    - onPickIcon (icon to use for individual item selection (defaults to edit icon))

    - init (initial open setting (all, selected, top [default]) indicates which blocks to start in open mode.
    - style options (?)

    - secondaryPick (clickable link beside static list item - only appears after selection is complete)
      - show (boolean or method returning computed boolean value)
      - selectText (text for clickable link for secondary pick execution)
      - onPick (method to execute upon selection for individual item)

 -->
  <template lang='pug'>
    div.recursiveList
      b S: {{selected}}
      span(v-show='title')
        u
          h4 {{title}} [{{selected_count}} / {{total_count}} selected]
        span(style='color: green; font-weight: bold' v-show='turnedOn.length') Turned On: {{turnedOn.join(', ')}} &nbsp;
        span(style='color: red; font-weight: bold' v-show='turnedOff.length') Turned Off: {{turnedOff.join(', ')}} &nbsp;
      Modal(:id='modalID' type='record' :options="options")
      span(v-if="newItems && promptNew")
        b.undecided {{newItems}}
          i New {{options.label}} option(s) available: &nbsp; &nbsp;
            span {{Object.keys(newItem).join(', ')}}
      div(v-if='hideList')
        ul(v-if='selectOne')
          li(v-for='picked in static')
            span(v-show = 'picked !== static[0]')  &nbsp; > &nbsp;
            h3 {{id2name[picked]}} &nbsp;
              span(v-if='secondaryPick && secondaryPick.show(hash[picked])')
                a(href='#' v-on:click='secondaryPick.onPick(hash[picked])')
                  b &nbsp; {{secondaryPick.selectText}}
        ul(v-else)
          li(v-for='picked in static') {{id2name[picked]}} &nbsp;
            span(v-if='secondaryPick && secondaryPick.show(hash[picked])')
              a(href='#' v-on:click='secondaryPick.onPick(hash[picked])')
                b &nbsp; {{secondaryPick.selectText}}
        br
        div.button.btn.btn-primary(@click.prevent='editList()') Edit
        span &nbsp;
        div.button.btn.btn-primary(@click.prevent='saveList(1)') Save Changes

      div(v-else)
        ul
          li(v-for="item in reOrderedList" v-show="openItems['id' + item.parent_id] === true")
            span(v-for='count in item.indents')
              span &nbsp; &nbsp; > &nbsp;

            span(v-if="selectToggle")
              span(v-if='select[item[idKey]]')
                b.selected {{item[nameKey]}} &nbsp; &nbsp;
                a(href='#' @click.prevent="deselectMe(item)")
                  icon.midline(name='minus')
              span(v-else)
                b.unselected {{item[nameKey]}} &nbsp; &nbsp;
                a(href='#' @click.prevent="selectMe(item)")
                  icon.midline(name='plus')

            span(v-else-if='selectable')
              // checkboxes to enbable multiple options to be chosen
              span.newItem(v-if="newItem[item[nameKey]] && promptNew")
                input(v-model='select[item[idKey]]' type='radio' value = 'yes' @click.prevent='toggleYes(item.id)')
                span &nbsp; Yes &nbsp;
                input(v-model='select[item[idKey]]' type='radio' value = 'no' @click.prevent='toggleNo(item.id)')
                span &nbsp; No &nbsp;
              input(v-else type='checkbox' v-model='select[item[idKey]]' v-on:change='toggle(item)')
              <!-- span(v-if='select[item[idKey]]') Y -->
              <!-- span(v-else) N               -->
              span &nbsp;
              span(v-if="select[item[idKey]]")
                b.selected {{item[nameKey]}} &nbsp; &nbsp;
              span(v-else-if="newItem[item[nameKey]]")
                b.newItem {{item[nameKey]}} &nbsp; &nbsp;
              span(v-else)
                b.unselected {{item[nameKey]}} &nbsp; &nbsp;
            span(v-else-if="onPick")
              a(href='#' v-if='onPick' @click.prevent='onPick(item)')
                b {{item.name}} &nbsp; &nbsp;
            span(v-else)
              b {{item.name}}

            span(v-if='showSelect && showSelect(item)')
              a(href='#' v-if='onSelect' @click.prevent='onSelect(item)')
                b {{selectText}}
                <!-- icon.midline(name='plus') -->
            span &nbsp;
            a(href='#' @click.prevent="toggleProgeny(item.id)"  v-if="openItems['id' + item.id] && under[item.id]")
              icon.midline(name='compress')
            a(href='#' @click.prevent="toggleProgeny(item.id)"  v-if="openItems['id' + item.id] === false  && under[item.id]")
              span.expand-text ({{under[item.id].length}} options) &nbsp;
                icon.midline(name='expand')
        span.button.btn.btn-primary(@click.prevent='saveList()' v-show='!hideList && !selectOne') Done
        span &nbsp; &nbsp;
        span.button.btn.btn-primary(@click.prevent='showList()' v-show='hideList') Edit
        p &nbsp;
        <!-- hr -->
        <!-- b Selected: {{JSON.stringify(selected)}} -->
  </template>
<script>
// import _ from 'lodash'
import 'vue-awesome/icons/expand'
import 'vue-awesome/icons/plus'
import 'vue-awesome/icons/minus'
import 'vue-awesome/icons/compress'
import 'vue-awesome/icons/edit'
import 'vue-awesome/icons/spinner'

import Modal from './Modal'

export default {
  components: {
    Modal
  },
  data () {
    return {
      openItems: {'idnull': true, 'id0': true},
      hash: {},
      seeds: [],
      under: {},
      rList: [],
      refIndex: {},
      parent: {},
      reOrderedList: [],
      name2id: {},
      id2name: {},
      select: {},
      selectParent: {},
      newItem: {},
      newItems: 0,
      static: ['nothing selected'],
      hideList: false,
      defaultModalID: 'info-modal',
      selected_count: 0,
      total_count: 0,
      turnedOn: [],
      turnedOff: []
    }
  },
  props: {
    title: { type: String },
    list: { type: Array },
    selected: {
      type: Array,
      default () { return null }
    },
    onPick: {
      type: Function,
      default () { return null }
    },
    onEdit: {
      type: Function,
      default () { return null }
    },
    onSelect: {
      type: Function,
      default () { return null }
    },
    options: { type: Object }, // idKey, parentKey, open (defaults to: id, parent_id, false)
    secondaryPick: {
      type: Object
    },
    onSave: {
      type: Function
    }
  },
  watch: {
    list: function () {
      console.log('rebuilding meta data after list change')
      this.buildMetaData()
      if (this.hide) {
        console.log('hide list initially... ')
        this.saveList()
      }
    },
    selected: function () {
      console.log('rebuilding meta data after selected change')
      this.buildMetaData()
      if (this.hide) {
        console.log('hide list initially... ')
        this.saveList()
      }
    }
  },
  created: function () {
    this.buildMetaData()
    console.log('build meta data with ' + JSON.stringify(this.options))
    if (this.hide) {
      console.log('hide list initially... ')
      this.saveList()
    }
  },
  after_created: function () {
  },
  computed: {
    hide: function () {
      if (this.options && this.options.hide) {
        return true
      } else {
        return false
      }
    },
    isSelected: function () {
      return this.select
    },
    modalID: function () {
      if (this.options && this.options.modalID) {
        return this.options.modalID
      } else {
        return this.defaultModalID
      }
    },
    clear: function () {
      if (this.options && this.options.clear) {
        return true
      } else {
        return false
      }
    },
    editable: function () {
      if (this.options && this.options.editable) {
        return true
      } else {
        return false
      }
    },
    selectText: function () {
      if (this.options && this.options.selectText) {
        return this.options.selectText || 'toggle'
      } else { return 'choose' }
    },
    promptNew: function () {
      if (this.options && this.options.promptNew) {
        return true
      } else {
        return false
      }
    },
    nameKey: function () {
      if (this.options && this.options.nameKey) {
        return this.options.nameKey
      } else {
        return 'alias'
      }
    },
    idKey: function () {
      if (this.options && this.options.idKey) {
        return this.options.idKey
      } else {
        return 'id'
      }
    },
    orderedList: function () {
      return null // fix this
    },
    showSelect: function () {
      if (this.options && this.options.showSelect) {
        return this.options.showSelect
      } else {
        return false
      }
    },
    selectOne: function () {
      if (this.options && this.options.selectOne) {
        return true
      } else {
        return false
      }
    },
    selectToggle: function () {
      if (this.options && this.options.selectToggle) {
        return true
      } else {
        return false
      }
    },
    selectable: function () {
      if (this.options && this.options.selectable) {
        return true
      } else {
        return this.selectOne
      }
    },
    open: function () {
      if (this.options && this.options.open) {
        return this.options.open
      } else {
        return 'selected'
      }
    },
    isOpen: function (interest) {
      var key = interest.parent_id

      // console.log('got ' + key + ' from ' + JSON.stringify(interest))
      var isOpen = this.openItems[key]
      // console.log('returned ' + isOpen + ' for ' + interest.id)
      return isOpen
    }
    // onPick: function () {
    //   if (this.options.onPick) {
    //     return this.options.onPick
    //   } else {
    //     return null
    //   }
    // },
  },
  methods: {
    buildMetaData: function (chosen) {
      console.log('reparse meta data for ' + this.title)
      this.selected_count = 0
      this.total_count = 0
      this.$set(this, 'select', {})
      this.$set(this, 'selectParent', {})

      var list = this.list || []
      var seeds = []
      // console.log('List: ' + JSON.stringify(list))
      console.log('build with chosen values: ' + JSON.stringify(chosen))
      console.log('initial selection: ' + JSON.stringify(this.selected))
      for (var i = 0; i < list.length; i++) {
        var nameKey = this.options.nameKey || this.nameKey || 'name'
        var idKey = this.options.idKey || this.idKey || 'id'
        var parentKey = this.options.parentKey || 'parent_id'
        this.total_count++

        var name = list[i][nameKey]
        var id = list[i][idKey]
        var parent = list[i][parentKey]

        this.refIndex[id] = i

        this.$set(this.hash, id, list[i])
        if (!parent) { seeds.push(id) }

        var selected
        if (chosen) {
          selected = chosen.indexOf(name) >= 0
        } else if (this.selected) {
          selected = (this.selected.indexOf(id) >= 0 || list[i].selected) && !this.clear
        } else {
          selected = list[i].selected && !this.clear
        }

        this.$set(this.parent, id, parent)

        if (selected) {
          this.selected_count++
          // console.log('pre-select ' + id)
          this.$set(this.select, id, true)
          this.$set(this.selectParent, parent, true)

          if (this.open === 'selected' && parent) {
            // console.log('pre-open ' + parent)
            this.$set(this.openItems, 'id' + parent, true)
          }
        } else if (selected === false) {
          this.$set(this.select, id, false)
        } else if (this.promptNew) {
          var pname = this.id2name[parent]
          if (!this.newItem[pname]) {
            this.$set(this.newItem, name, true)
            if (this.selectable) { this.newItems++ }
          }
        }

        if (this.open === 'all') {
          this.$set(this.openItems, 'id' + parent, true)
        }
        this.$set(this.name2id, name, id)
        this.$set(this.id2name, id, name)

        if (this.list[i].parent_id) {
          if (!this.under[parent.toString()]) {
            this.$set(this.under, parent.toString(), [])
            this.$set(this.openItems, 'id' + parent, false)
          }

          var currentLength = this.under[parent.toString()].length
          this.$set(this.under[parent.toString()], currentLength, id)
        } else {
          // console.log('no parent')
          // this.$set(this.list[i], 'parent_id', 0)
        }
      }

      // console.log('seeds are: ' + JSON.stringify(seeds))
      // console.log('under are: ' + JSON.stringify(this.under))

      this.seeds = seeds
      // open parent of selected interests (if applicable)
      if (this.options && this.options.open) {
        var PS = Object.keys(this.selectParent)
        for (var j = 0; j < PS.length; j++) {
          var pid = PS[j]
          this.$set(this.openItems, 'id' + pid, true)
        }
      }

      for (var k = 0; k < seeds.length; k++) {
        // console.log('seeding ' + k)
        this.addRecursive(seeds[k], 0)
      }

      console.log('tracked underitems list: ' + JSON.stringify(this.under))
    },
    clearList: function () {
      console.log('CLEAR ' + this.static[0])
      this.toggle(this.static[0])
      // for (var i = 0; i < this.seeds.length; i++) {
      //   if (this.openItems['id' + this.seeds[i]]) {
      //     console.log('close ' + this.seeds[i])
      //     this.toggle(this.seeds[i])
      //   }
      // }
    },
    reopenTree: function () {

    },
    deselectMe: function (item) {
      console.log('deselect ' + JSON.stringify(item.name))
      this.$set(this.select, item.id, false)
    },
    selectMe: function (item) {
      console.log('SelectMe: ' + JSON.stringify(item.name))
      this.$set(this.select, item.id, true)
    },
    toggleProgeny: function (id) {
      var key = 'id' + id
      console.log('Toggle ' + id)
      this.$set(this.openItems, key, !this.openItems[key])

      if (!this.openItems[key]) {
        // close children
        var under = this.under[id] || []
        for (var i = 0; i < under.length; i++) {
          var underid = under[i]
          if (this.openItems['id' + underid]) {
            this.toggleProgeny(underid)
          }
        }
      }
    },
    onClick: function (record) {
      if (this.onPick) {
        this.onPick(record)
      } else {
        console.log('no onPick option supplied to RecursiveList')
      }
    },
    toggle2: function (item) {
      var id = null
      if (item.constructor === Object) {
        id = item.id
      } else {
        id = item
        item = null
      }
      console.log('toggle: ' + id)
      // this.$set(this.select, id, !this.select[id])
    },
    toggle: function (item) {
      var id = null
      if (item.constructor === Object) {
        id = item.id
      } else {
        id = item
        item = null
      }
      var ids = 'id' + id
      var name = this.id2name[id]

      console.log(id + ids + name)
      console.log('check for clear: ' + this.static.length + '+' + item)
      if (this.selectOne && this.static.length && item) {
        console.log('clearlist ' + this.static[0])
        this.toggle(this.static[0])
      }

      if (id && name) {
        // first clear sub interests if applicable ..
        if (!this.select[id]) {
          console.log('deselect ' + id)
          // deselect
          this.trackOff(id)
          this.toggleOff(this.under[id])
          // this.$set(this.openItems, ids, false)
          // this.toggleProgeny(id)
        } else {
          console.log('select ' + id)
          // select
          this.$set(this.select, id, true)
          this.trackOn(id)

          this.$set(this.openItems, ids, true)
        }

        // this.$set(this.select, id, !this.select[id])
        if (this.selectOne) {
          console.log('save the list... ')
          this.saveList()
        }
      } else {
        console.log('error trying to toggle ' + id + ':' + name)
      }
    },
    toggleYes: function (id) {
      var name = this.id2name[id]
      // var ids = 'id' + id

      this.$set(this.select, id, false)
      this.toggle(id)
      // if (this.openItems[ids] === false) {
      //   this.$set(this.openItems, ids, true)
      //   console.log('toggle ' + name + ': ' + ids)
      // }

      // console.log('under ? ' + JSON.stringify(this.under[id]))
      // if (this.under[id]) {
      //   for (var i = 0; i < this.under[id].length; i++) {
      //     var subid = this.under[id][i]
      //     var subname = this.id2name[subid]
      //     console.log('add secondary new item: ' + subid + ' = ' + subname)
      //     this.$set(this.newItem, subname, true)
      //     this.newItems++
      //   }
      // }

      this.$set(this.newItem, name, null)
      this.newItems--
    },
    toggleOff: function (ids) {
      if (ids && ids.constructor === Number) {
        ids = [ids]
      }

      if (ids && ids.length) {
        for (var i = 0; i < ids.length; i++) {
          var id = ids[i]
          if (this.select[id]) {
            console.log('also toggle ' + id)
            this.toggleOff(this.under[id])
            this.$set(this.select, id, false)

            this.trackOff(id)
          }
        }
      }
    },
    trackOff: function (id) {
      console.log('TURN OFF ' + id)
      var onIndex = this.turnedOn.indexOf(id)
      if (onIndex >= 0) {
        console.log('return on ' + id + ' : ' + onIndex)
        this.turnedOn.splice(onIndex, 1)
      } else {
        console.log('turn off ' + id + ' : ' + onIndex)
        this.$set(this.turnedOff, this.turnedOff.length, id)
      }
    },
    trackOn: function (id) {
      var offIndex = this.turnedOff.indexOf(id)
      if (offIndex >= 0) {
        console.log('return off ' + id + ' : ' + offIndex)
        this.turnedOff.splice(offIndex, 1)
      } else {
        console.log('turn on ' + id + ' : ' + offIndex)
        this.$set(this.turnedOn, this.turnedOn.length, id)
      }
    },
    toggleNo: function (id) {
      var name = this.id2name[id] // interest.name

      console.log('untoggle ' + id + name)
      this.$set(this.select, id, true)
      this.$set(this.newItem, name, null)
      this.toggle(id)

      this.newItems--
    },
    addRecursive: function (id, level) {
      var refIndex = this.refIndex[id] // tmp
      if (id >= 0) {
        var ids = id.toString()

        var index = this.reOrderedList.length || 0

        // console.log('check for ' + ids + ' in ' + this.rList.join(', '))
        if (this.rList.indexOf(ids) === -1) {
          this.$set(this.rList, this.rList.length, ids)
          var item = this.list[refIndex]
          // console.log(refIndex + ' item: ' + JSON.stringify(item))
          item.indents = level
          this.$set(this.reOrderedList, index++, item)
        }

        if (this.under[ids]) {
          for (var i = 0; i < this.under[ids].length; i++) {
            var newid = this.under[ids][i]
            this.addRecursive(newid, level + 1)
          }
        }
      } else {
        console.log('no id specified...')
      }
    },
    saveList: function (update) {
      console.log('save list ...')
      // this.$set(this, 'hideList', true)
      this.hideList = true
      this.$set(this, 'static', [])
      var keys = Object.keys(this.select)
      for (var i = 0; i < keys.length; i++) {
        if (this.select[keys[i]]) {
          console.log('save: ' + JSON.stringify(keys[i]))
          this.static.push(keys[i])
        }
      }
      if (this.onSave) {
        var labels = []
        for (var j = 0; j < this.static.length; j++) {
          var label = this.id2name[this.static[j]]
          if (!label) { console.log(' no label for id: ' + this.static[j]) }
          labels.push(label)
        }
        this.onSave(this.static, labels)
      }

      if (update) {
        console.log('Save changes to database...')
        this.$set(this, 'turnedOn', [])
        this.$set(this, 'turnedOff', [])
      }

      this.selected_count += this.turnedOn.length
      this.selected_count -= this.turnedOff.length
      // this.static = this.selected
    },
    showTree: function () {
      this.hideList = false
    },
    editList: function () {
      console.log('Selected: ' + JSON.stringify(this.selected))
      this.hideList = false
    }
  }
}
</script>

<style>
/*@import '/static/css/Standard.css';*/

.selected {
  color: blue;
}
.unselected {
  color: black;
}
.undecided {
  color: orange;
}
.newItem {
  color: red;
}
.recursiveList ul li {
    display: block;
}
.expand-text {
  color: darkorange
}

</style>
