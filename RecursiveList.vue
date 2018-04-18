<!-- src/components/RecursiveList.vue -->

<!-- Usage:
  Generates a recursive list of items in which child items may be toggled on and off via their parent.

  Input:
    - list (array of hashes MUST include keys for 'id, name, parent')

  Options:
    - nameKey (key for name value (defaults to 'name'))
    - idKey (key for name value (defaults to 'id'))
    - parentKey (key for name value (defaults to 'parent_id'))

    - onPick (function to run when individual item is selected)
    - onPickIcon (icon to use for individual item selection (defaults to edit icon))

    - init (initial open setting (all, selected, top [default]) indicates which blocks to start in open mode.
    - style options (?)

 -->
  <template lang='pug'>
    div.recursiveList
      Modal(id='info-modal' type='record' :options="options")
      span(v-if="newItems")
        b.undecided {{newItems}} New {{options.label}} option(s) available: &nbsp; &nbsp;
        i {{Object.keys(newItem).join(', ')}}
      ul
        li(v-for="item in reOrderedList" v-show="openItems['id' + item.parent_id] === true")
          span(v-for='count in item.indents')
            span &nbsp; &nbsp; > &nbsp;

          span(v-if="1 || selectOne")
            span(v-if="select[item[nameKey]]")
              router-link(:to="{name: 'TourUTM', params: {id: item[idKey]}}")
                <!-- a(:href="linkTo") -->
                b.selected {{item[nameKey]}} &nbsp; &nbsp;
          span(v-else)
            span.newItem(v-if="newItem[item[nameKey]]")
              input(v-model='select[item[nameKey]]' type='radio' value = 'yes' @click.prevent='pickYes(item.id)')
              span &nbsp; Yes &nbsp;
              input(v-model='select[item[nameKey]]' type='radio' value = 'no' @click.prevent='pickNo(item.id)') 
              span &nbsp; No &nbsp;          
            input(v-else type='checkbox' v-model='select[item[nameKey]]' @click.prevent='pick(item.id)')
            span &nbsp;
            span(v-if="select[item[nameKey]]")
              b.selected {{item[nameKey]}} &nbsp; &nbsp;
            span(v-else-if="newItem[item[nameKey]]")
              b.undecided {{item[nameKey]}} &nbsp; &nbsp;
            span(v-else)
              b.unselected {{item[nameKey]}} &nbsp; &nbsp;

          a(href='#' v-if='onPick' @click.prevent='onClick(item)')
            icon.midline(name='edit')

          span &nbsp;
          a(href='#' @click.prevent="toggle(item.id)"  v-if="openItems['id' + item.id] && under[item.id]")
            icon.midline(name='compress')
          a(href='#' @click.prevent="toggle(item.id)"  v-if="openItems['id' + item.id] === false  && under[item.id]")
            span ({{under[item.id].length}} options) &nbsp;
              icon.midline(name='expand')
  </template>
  <script>
  // import _ from 'lodash'
  import 'vue-awesome/icons/expand'
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
        under: {},
        rList: [],
        parent: {},
        reOrderedList: [],
        name2id: {},
        id2name: {},
        select: {},
        selectParent: {},
        newItem: {},
        newItems: 0
      }
    },
    props: {
      list: { type: Array },
      onPick: { type: Function },
      options: { type: Object } // idKey, parentKey, open (defaults to: id, parent_id, false)
    },
    created: function () {
      var list = this.list || []
      for (var i = 0; i < list.length; i++) {
        var nameKey = this.options.nameKey || this.nameKey || 'name'
        var idKey = this.options.idKey || this.idKey || 'id'
        var parentKey = this.options.parentKey || 'parent_id'

        var name = list[i][nameKey]
        var selected = list[i].selected
        var id = list[i][idKey]
        var parent = list[i][parentKey]

        this.$set(this.parent, id, parent)

        if (selected) {
          this.$set(this.select, name, true)
          this.$set(this.selectParent, parent, true)
        } else if (selected === false) {
          this.$set(this.select, name, false)
        } else {
          var pname = this.id2name[parent]
          if (!this.newItem[pname]) {
            this.$set(this.newItem, name, true)
            this.newItems++
          }
        }

        this.$set(this.name2id, name, id)
        this.$set(this.id2name, id, name)

        // this.$set(this.select, name, false)
        if (this.list[i].parent_id) {
          if (!this.under[parent.toString()]) {
            this.$set(this.under, parent.toString(), [])
            this.$set(this.openItems, 'id' + parent, false)
          }

          var currentLength = this.under[parent.toString()].length
          this.$set(this.under[parent.toString()], currentLength, id)
        } else {
          this.$set(this.list[i], 'parent_id', 0)
        }
      }

      // open parent of selected interests (if applicable)
      if (this.options && this.options.open) {
        var PS = Object.keys(this.selectParent)
        for (var j = 0; j < PS.length; j++) {
          var pid = PS[j]
          this.$set(this.openItems, 'id' + pid, true)
        }
      }

      this.addRecursive(1, 0)
      this.addRecursive(2, 0)
      this.addRecursive(3, 0)

      console.log('tracked underitems list: ' + JSON.stringify(this.under))
    },
    computed: {
      nameKey: function () {
        if (this.options && this.options.nameKey) {
          return this.options.nameKey
        } else {
          return 'name'
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
      },
      selectOne: function () {
        if (this.options && this.options.selectOne) {
          return true
        } else {
          return false
        }
      },
      isOpen: function (interest) {
        var key = interest.parent_id

        // console.log('got ' + key + ' from ' + JSON.stringify(interest))
        var isOpen = this.openItems[key]
        console.log('returned ' + isOpen + ' for ' + interest.id)
        return isOpen
      },
      linkTo: function () {
        if (this.options.linkTo) {
          return this.options.linkTo
        } else {
          return '#'
        }
      }
    },
    methods: {
      toggle: function (id) {
        var key = 'id' + id
        console.log('toggle ' + id)
        this.$set(this.openItems, key, !this.openItems[key])

        if (!this.openItems[key]) {
          // close children
          var under = this.under[id] || []
          for (var i = 0; i < under.length; i++) {
            var underid = under[i]
            if (this.openItems['id' + underid]) {
              this.toggle(underid)
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
      pick: function (id) {
        var ids = 'id' + id
        var name = this.id2name[id]

        if (id && name) {
          // first clear sub interests if applicable ..
          if (this.select[name]) {
            console.log('deselect ' + id)
            // deselect
            if (this.under[id]) {
              for (var i = 0; i < this.under[id].length; i++) {
                var uid = this.under[id][i]
                var uname = this.id2name[uid]
                if (this.select[uname]) {
                  // this.$set(this.select, uname, false)
                  this.pick(uid)
                }
              }
            }
            this.$set(this.openItems, ids, false)
            // this.toggle(id)
          } else {
            console.log('select ' + id)
            // select
            this.$set(this.openItems, ids, true)

            // select parent interests automatcially
            var pid = this.parent[id]
            var pname = this.id2name[pid]
            if (pid && !this.select[pname]) {
              this.pick(pid)
            }
          }

          this.$set(this.select, name, !this.select[name])
        } else {
          console.log('error trying to pick ' + id + ':' + name)
        }
      },
      pickYes: function (id) {
        var name = this.id2name[id]
        // var ids = 'id' + id

        this.$set(this.select, name, false)
        this.pick(id)
        // if (this.openItems[ids] === false) {
        //   this.$set(this.openItems, ids, true)
        //   console.log('pick ' + name + ': ' + ids)
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
      pickNo: function (id) {
        var name = this.id2name[id] // interest.name

        console.log('unpick ' + id + name)
        this.$set(this.select, name, true)
        this.$set(this.newItem, name, null)
        this.pick(id)

        this.newItems--
      },
      addRecursive: function (id, level) {
        var refIndex = id - 1 // tmp

        var ids = id.toString()

        var index = this.reOrderedList.length || 0

        if (this.rList.indexOf(ids) === -1) {
          this.$set(this.rList, this.rList.length, ids)
          var item = this.list[refIndex]
          item.indents = level
          this.$set(this.reOrderedList, index++, item)
        }

        if (this.under[ids]) {
          for (var i = 0; i < this.under[ids].length; i++) {
            var newid = this.under[ids][i]
            this.addRecursive(newid, level + 1)
          }
        }
      }
    }
  }
  </script>

<style>
@import '/static/css/Standard.css';

.selected {
  color: blue;
}
.unselected {
  color: black;
}
.undecided {
  color: red;
}
.newItem {
  color: red;
}
.recursiveList ul li {
    display: block;
}
</style>
