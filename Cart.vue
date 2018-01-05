<template lang='pug'>
  div.cart(v-if='items || 1')
    div.openCart(v-if='showCart')
      a(href='#' @click.prevent='closeCart')
        icon(name='close' color='black' scale='2')
      br
      b ({{items}} items)
      ul
        li(v-for="item in cart")
          b {{item.name}} [ {{item.amount}} x {{item.qty}} ] = {{item.amount*item.qty}}
      form(action="/process-payment" method="POST") 
        button.btn.btn-primary(:disabled="!items") Checkout
        <!-- stripe-checkout(stripe-key="my-stripe-key" product="product(tea.name, tea.description, tea.price100g)") -->
    div.closedCart(v-else)
      a(href='#' @click.prevent="openCart")
        icon(name='shopping-cart' color='black' scale=2)
      b &nbsp; [{{items}}]
</template>

<script>
import PublicHeader from './../PublicHeader'
import PublicFooter from './../PublicFooter'

import 'vue-awesome/icons/shopping-cart'
import 'vue-awesome/icons/close'
import 'vue-awesome/icons/home'

// import { StripeCheckout } from 'vue-stripe'

export default {
  name: 'hello',
  components: {
    PublicHeader,
    PublicFooter
  },
  data () {
    return {
      showCart: false
    }
  },
  props: {
    add: { type: Function },
    cart: { type: Object }
  },
  computed: {
    product: function (name, desc, price) {
      return { name: name, description: desc, amount: price }
    },
    items: function () {
      var ids = Object.keys(this.cart)
      var count = 0
      for (var i = 0; i < ids.length; i++) {
        var qty = this.cart[ids[i]].qty || 1
        count += qty
      }
      return count
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

.cart {
  position: fixed;
  right: 20px;
  /*margin: 10px;*/
}

.openCart {
  background-color: #eee;
  padding: 10px;
  border: 1px solid black;
}

.closedCart {
  background-color: #999;
  padding: 10px;
  border: 1px solid black;
}


ul {
  list-style-type: none;
  padding: 0;
}

li {
  color: black;
  /*display: inline-block;*/
  /*margin: 0 10px;*/
}

</style>