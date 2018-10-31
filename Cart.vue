<template lang='pug'>
  div.myCart
    div.myOpenCart(v-if='showCart')
      div.navbar-right
        a(href='#' @click.prevent='closeCart')
          icon(name='times' color='red  ' scale='2')
        span &nbsp; &nbsp;
      b.input-lg {{items.count}} items: &nbsp; &nbsp;
      h3
        u Items in Cart:
      form.form#cartForm
        table.table
          thead
            tr
              th Name
              th Price
              th(v-if='sizes') Size
              th Qty
              th Sub-total
          tr(v-for="item, key in cart")
            td {{item.name}}
            td {{item.amount}}
            td(v-if='sizes') {{item.size}}
            td
              input(type='number' v-model='item.qty')
            td
              b.subtotal {{ Number((item.qty * item.amount).toFixed(2)) }}
      br
      h4.total Total: {{ Number((items.total).toFixed(2)) }}
      hr
      b {{JSON.stringify(items)}}
      hr
      form(action="/process-payment" method="POST")
        button.btn.btn-primary(:disabled="!items") Checkout
        <!-- stripe-checkout(stripe-key="my-stripe-key" product="product(tea.name, tea.description, tea.price100g)") -->
    div.myClosedCart(v-else)
      a(href='#' @click.prevent="openCart")
        icon(name='shopping-cart' color='black' scale=2)
      b &nbsp; [{{items.total}}]
</template>

<script>
import 'vue-awesome/icons/shopping-cart'
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/home'

// import { StripeCheckout } from 'vue-stripe'

export default {
  name: 'hello',
  components: {
  },
  data () {
    return {
      showCart: false,
      total: 0,
      sizes: true // include if size information is included in itemized list
    }
  },
  props: {
    add: { type: Function },
    recalculate: { type: Function },
    cart: { type: Object }
  },
  computed: {
    product: function (name, desc, price) {
      return { name: name, description: desc, amount: price }
    },
    items: function () {
      console.log('calculate')
      var ids = Object.keys(this.cart)
      var count = 0
      var total = 0
      // var total = 0
      for (var i = 0; i < ids.length; i++) {
        var qty = this.cart[ids[i]].qty || 1
        var price = this.cart[ids[i]].amount || 0
        console.log(price + ' * ' + qty + ' = ' + price * qty)
        // var subtotal = this.cart[ids[i]].amount * qty
        // total += subtotal
        count += qty
        total += qty * price
      }

      // this.total = total .. cannot introduce side-effects
      return {count: count, total: total}
    }
  },
  methods: {
    openCart () {
      this.showCart = true
    },
    closeCart () {
      this.showCart = false
    },
    add2cart (item) {
      if (this.add) {
        console.log('add to cart...')
        this.add(item)
      } else {
        console.log('no add function supplied')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass?outputStyle=expanded">

.total {
  font-weight: bold;
  color: red;
  border: 1px solid black;
  padding: 1rem;
}
.subtotal {
  font-weight: bold;
  color: orange;
}

.myCart {
  /*position: relative;*/
  /*right: 20px;*/
  margin: 10px;
}

.myOpenCart {
  /*position: relative;*/
  background-color: #eee;
  padding: 10px;
  border: 1px solid black;
  /*width: 100%;*/
  min-width: 400px;
}

.myClosedCart {
  /*position: relative;*/
  background-color: #999;
  padding: 20px;
  padding-top: 20px;
  border: 1px solid black;
}

ul {
  list-style-type: none;
}

</style>
