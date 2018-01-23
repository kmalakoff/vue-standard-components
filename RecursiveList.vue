<!-- src/components/RecursiveList.vue -->

<!-- Usage:
  Generates a recursive list of items in which child items may be toggled on and off via their parent.

  Input:
    - list (array of hashes MUST include keys for 'id, name, parent')

  Options:
    - show (initial array of ids to include as open - defaults to those without 'parent' values)
    - style options (?)

 -->
  <template lang='pug'>
    div.recursiveList
      span(v-if="newItems")
        b.undecided {{newItems}} New Interests available: &nbsp; &nbsp;
        i {{Object.keys(newItem).join(', ')}}
      ul
        li(v-for="item in reOrderedList" v-show="openItems['id' + item.parent_id] === true")
          span(v-for='count in item.indents')
            span &nbsp; &nbsp; > &nbsp;

          span.newItem(v-if="newItem[item.name]")
            input(v-model='select[item.name]' type='radio' value = 'yes' @click.prevent='pickYes(item.id)')
            span &nbsp; Yes &nbsp;
            input(v-model='select[item.name]' type='radio' value = 'no' @click.prevent='pickNo(item.id)') 
            span &nbsp; No &nbsp;          
          input(v-else type='checkbox' v-model='select[item.name]' @click.prevent='pick(item.id)')
          span &nbsp;
          span(v-if="select[item.name]")
            b.selected {{item.name}} &nbsp; &nbsp;
          span(v-else-if="newItem[item.name]")
            b.undecided {{item.name}} &nbsp; &nbsp;
          span(v-else)
            b.unselected {{item.name}} &nbsp; &nbsp;            
          button.btn.btn-xs(@click.prevent="toggle(item.id)"  v-if="openItems['id' + item.id] && under[item.id]")
            icon(name='compress')
          button.btn.btn-xs(@click.prevent="toggle(item.id)"  v-if="openItems['id' + item.id] === false  && under[item.id]")
            icon(name='expand')
  </template>
  <script>
  // import _ from 'lodash'
  import 'vue-awesome/icons/expand'
  import 'vue-awesome/icons/compress'
  
  export default {
    components: {
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
      list: { type: Array }
    },
    created: function () {
      var list = this.list || []
      for (var i = 0; i < list.length; i++) {
        var name = list[i].name
        var selected = list[i].selected
        var id = list[i].id
        var parent = list[i].parent_id || list[i].parent

        this.$set(this.parent, id, parent)

        if (selected) {
          console.log('select ' + name + ' P: ' + parent)
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
      var PS = Object.keys(this.selectParent)
      for (var j = 0; j < PS.length; j++) {
        var pid = PS[j]
        this.$set(this.openItems, 'id' + pid, true)
        console.log('open ' + pid)
      }

      this.addRecursive(1, 0)
      this.addRecursive(2, 0)
      this.addRecursive(3, 0)

      console.log('reordered list: ' + JSON.stringify(this.rList))
      console.log('reordered list: ' + JSON.stringify(this.reOrderedList))
      console.log('tracked underitems list: ' + JSON.stringify(this.under))
    },
    computed: {
      orderedList: function () {
      },
      isOpen: function (interest) {
        var key = interest.parent_id

        // console.log('got ' + key + ' from ' + JSON.stringify(interest))
        var isOpen = this.openItems[key]
        console.log('returned ' + isOpen + ' for ' + interest.id)
        return isOpen
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

        console.log('addRecursive: ' + id + ' : ' + this.list[refIndex].name)
        var ids = id.toString()

        var index = this.reOrderedList.length || 0

        if (this.rList.indexOf(ids) === -1) {
          this.$set(this.rList, this.rList.length, ids)
          var item = this.list[refIndex]
          item.indents = level
          this.$set(this.reOrderedList, index++, item)
        }

        if (this.under[ids]) {
          console.log('under ' + id + ' : ' + this.under[ids])
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
