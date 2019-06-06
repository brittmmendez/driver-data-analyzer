// MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types, flow, getParent } from 'mobx-state-tree';
import { Cookies } from 'react-cookie';
import OrderItem from './OrderItem';
import Coupon from './Coupon';

const cookies = new Cookies();

const Cart = types
  .model({
    id: types.optional(types.string, ''),
    creatingCart: types.optional(types.boolean, false),
    addToCartError: types.optional(types.boolean, false),
    // cart contains unique orderItems based off of the value id and product id selected
    items: types.optional(types.array(OrderItem), []),
    base_cart_amount: types.optional(types.number, 0),
    discount_amount: types.optional(types.number, 0),
    coupon: types.optional(Coupon, {}),
    cart_amount: types.optional(types.number, 0),
    shipping: types.optional(types.number, 0),
    tax_total: types.optional(types.number, 0),
    tax_set: types.optional(types.boolean, false),
    shipping_cost_total_inc_tax: types.maybe(types.number),
    subtotal_inc_tax: types.optional(types.number, 0),
    grand_total: types.optional(types.number, 0)
  })
  .views(self => ({
    get itemCount() {
      let totalQuantity = 0;
      self.items.map(i => {
        totalQuantity += i.quantity;
        return totalQuantity;
      });
      return totalQuantity;
    },

    get orderSummarySubTotal() {
      // return the subtotal until ground total equals something other than 0
      return self.base_cart_amount.toFixed(2);
    },

    get orderSummaryTotal() {
      // return the subtotal until ground total equals something other than 0
      if (self.grand_total === 0) {
        return self.cart_amount.toFixed(2);
      }
      return self.grand_total.toFixed(2);
    },

    get getShipping() {
      if (self.shipping_cost_total_inc_tax === 0) {
        return `$${self.shipping_cost_total_inc_tax.toFixed(2)}`;
      }
      return 'TBD';
    },

    get getOrderSummaryMsg() {
      if (self.getShipping === 'TBD' && self.getTax === 'TBD') {
        return 'Shipping and taxes are calculated during checkout';
      }
      if (self.getShipping !== 'TBD' && self.getTax !== 'TBD') {
        return '';
      }
      if (self.getShipping !== 'TBD' && self.getTax === 'TBD') {
        return 'Taxes are calculated during checkout';
      }
      return 'Shipping is calculated during checkout';
    },

    get getTax() {
      if (!self.tax_set) {
        return 'TBD';
      }
      return `$${self.tax_total.toFixed(2)}`;
    }
  }))
  .actions(self => ({
    createCartCookie(json) {
      cookies.set(
        'cart',
        { id: json.id, customer_id: json.customer_id },
        { path: '/', maxAge: 7776000 }
      );
    },

    resetAddToCartError() {
      self.addToCartError = false;
    },
    setTotals(json) {
      self.base_cart_amount = json.base_cart_amount;
      self.discount_amount = json.discount_amount;
      self.cart_amount = json.cart_amount;
    },

    setCartAmount(cartAmount) {
      self.cart_amount = cartAmount;
    },

    setTaxAmount(taxTotal) {
      self.tax_total = taxTotal;
      self.tax_set = true;
    },

    setGrandTotal(grandTotal) {
      self.grand_total = grandTotal;
    },

    clearCart() {
      self.id = '';
      self.creatingCart = false;
      self.items = [];
      self.shipping_cost_total_inc_tax = 1;
      self.tax_total = 0;
      getParent(self, 1).checkout.clearCheckoutIds();
      getParent(self, 1).checkout.shippingInfo.resetShippingInfo();
      getParent(self, 1).checkout.billingInfo.resetBillingInfo();
      getParent(self, 1).shipping.resetSelectedShipping();
      // will need to uncomment out once we have payment added into order confirmation api call
      // getParent(self, 1).payment.resetPayment();
      cookies.remove('cart', { path: '/' });
      cookies.remove('consignmentId', { path: '/' });
      cookies.remove('shippingOptionSet', { path: '/' });
      cookies.remove('sameAsBilling', { path: '/' });
      cookies.remove('stripeToken', { path: '/' });
    },

    setShipping(rate) {
      self.shipping_cost_total_inc_tax = rate;
    },

    setOptionSelections(options, optionValue1, optionValue2, optionValue3) {
      return options[0]
        ? [
          {
            option_id: options[0] ? options[0].id : 0,
            option_value: optionValue1
          },
          {
            option_id: options[1] ? options[1].id : 0,
            option_value: optionValue2
          },
          {
            option_id: options[2] ? options[2].id : 0,
            option_value: optionValue3
          }
        ]
        : [];
    },

    setOptionValues(
      options,
      optionValueName1,
      optionValueName2,
      optionValueName3
    ) {
      return options[0]
        ? [
          {
            label: options[0].display_name,
            value: optionValueName1
          },
          {
            label: options[1] ? options[1].display_name : '',
            value: optionValueName2 || ''
          },
          {
            label: options[2] ? options[2].display_name : '',
            value: optionValueName3 || ''
          }
        ]
        : [];
    },

    createBigCcart: flow(function* createBigCcart(
      item,
      quantity,
      optionValue1,
      optionValue2,
      optionValue3,
      optionValueName1,
      optionValueName2,
      optionValueName3
    ) {
      self.creatingCart = true;
      self.addToCartError = false;
      try {
        // (CORS) error run in terminal:
        // open /Applications/Google\ Chrome.app --args --disable-web-security --user-data-dir
        const response = yield window.fetch(
          `${getParent(self, 1).apiUrl}/carts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              line_items: [
                {
                  quantity,
                  product_id: item.id,
                  option_selections: self.setOptionSelections(
                    item.options,
                    optionValue1,
                    optionValue2,
                    optionValue3
                  )
                }
              ],
              customer_id: getParent(self, 1).user.id
            })
          }
        );
        let json = response;
        json = yield json.json();
        self.id = json.id;
        self.base_cart_amount = json.base_cart_amount;
        self.discount_amount = json.discount_amount;
        self.cart_amount = json.base_cart_amount;
        self.items.push({
          id: `${item.id}${optionValue1}${optionValue2}${optionValue3}`,
          item: item.id,
          uuid: json.line_items.physical_items[0].id,
          name: item.name,
          price: item.sale_price || item.variantPrice || item.price,
          retail_price: item.variantPrice || item.price,
          sale_price: item.sale_price,
          extended_sale_price:
            json.line_items.physical_items[0].extended_sale_price,
          quantity,
          thumbnail_url: item.images[0] ? item.images[0].standard_url : item.thumbnail_url,
          option_values: self.setOptionValues(
            item.options,
            optionValueName1,
            optionValueName2,
            optionValueName3
          )
        });
        self.coupon.resetCoupon();
        self.createCartCookie(json);
        getParent(self, 1).checkout.setCheckoutId(self.id);
      } catch (err) {
        self.creatingCart = false;
        self.addToCartError = true;
        console.log(err);
      }
    }),

    getBigCcart: flow(function* getBigCcart(cookie) {
      try {
        const response = yield window.fetch(
          `${getParent(self, 1).apiUrl}/carts/${cookie}`
        );
        let json = response;
        json = yield json.json();
        self.id = json.id;
        self.base_cart_amount = json.base_cart_amount;
        self.discount_amount = json.discount_amount;
        self.cart_amount = json.cart_amount;
        if (json.coupons.length) {
          self.coupon.getCoupon(json.coupons[0].code);
          self.coupon.setDiscountAmount(json.coupons[0].discounted_amount);
        }
        json.line_items.physical_items.map(item => {
          const product = getParent(self, 1).products.data.find(
            i => i.id === item.product_id
          );
          let optionValueName1 = '';
          let optionValueName2 = '';
          let optionValueName3 = '';
          let optionValue1 = 0;
          let optionValue2 = 0;
          let optionValue3 = 0;

          if (product.options.length) {
            // take the variant_id from item and filter product to find the option with the variant_id
            const variant = product.variants.filter(
              v => v.id === item.variant_id
            )[0];

            optionValueName1 = variant.values[0].label;
            optionValueName2 = variant.values[1] ? variant.values[1].label : '';
            optionValueName3 = variant.values[2] ? variant.values[2].label : '';

            optionValue1 = variant.values[0].id;
            optionValue2 = variant.values[1] ? variant.values[1].id : 0;
            optionValue3 = variant.values[1] ? variant.values[2].id : 0;
          }

          self.items.push({
            // creating frontend id so that we can convert
            // product into orderItem if it is already in cart
            id: `${
              item.product_id
              }${optionValue1}${optionValue2}${optionValue3}`,
            item: item.product_id,
            uuid: item.id,
            name: item.name,
            price: item.sale_price || item.variantPrice || item.price,
            retail_price: product.price,
            sale_price: product.sale_price,
            extended_sale_price: item.extended_sale_price,
            quantity: item.quantity,
            thumbnail_url: item.image_url,
            option_values: self.setOptionValues(
              product.options,
              optionValueName1,
              optionValueName2,
              optionValueName3
            )
          });
          return true;
        });
      } catch (err) {
        cookies.remove('cart', { path: '/' });
        console.log(err);
      }
    }),

    updateBigCcart: flow(function* updateBigCcart(
      item,
      quantity,
      optionValue1,
      optionValue2,
      optionValue3,
      optionValueName1,
      optionValueName2,
      optionValueName3
    ) {
      try {
        // (CORS) error run in terminal:
        // open /Applications/Google\ Chrome.app --args --disable-web-security --user-data-dir
        const response = yield window.fetch(
          `${getParent(self, 1).apiUrl}/carts/${self.id}/items`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              line_items: [
                {
                  quantity,
                  product_id: item.id,
                  option_selections: self.setOptionSelections(
                    item.options,
                    optionValue1,
                    optionValue2,
                    optionValue3
                  )
                }
              ]
            })
          }
        );
        let json = response;
        self.addToCartError = false;
        json = yield json.json();
        if (json.coupons.length) {
          self.coupon.setDiscountAmount(json.coupons[0].discounted_amount);
        }
        self.id = json.id;
        self.base_cart_amount = json.base_cart_amount;
        self.discount_amount = json.discount_amount;
        self.cart_amount = json.cart_amount;
        self.items.push({
          id: `${item.id}${optionValue1}${optionValue2}${optionValue3}`,
          item: item.id,
          uuid:
            json.line_items.physical_items[
              json.line_items.physical_items.length - 1
            ].id,
          name: item.name,
          price: item.sale_price || item.variantPrice || item.price,
          retail_price: item.retail_price || item.price,
          sale_price: item.sale_price,
          extended_sale_price:
            json.line_items.physical_items[
              json.line_items.physical_items.length - 1
            ].extended_sale_price,
          quantity,
          thumbnail_url: item.images[0] ? item.images[0].standard_url : item.thumbnail_url,
          option_values: self.setOptionValues(
            item.options,
            optionValueName1,
            optionValueName2,
            optionValueName3
          )
        });
        if (self.tax_total) {
          getParent(self, 1).checkout.getCheckoutSummary();
        }
      } catch (err) {
        console.log(err);
        self.addToCartError = true;
      }
    }),

    updateCartCustomer: flow(function* updateCartCustomer(customerId) {
      // for login/registration
      // if cart ctreated and customer_id is 0 update customer_id
      const cartCookie = cookies.get('cart');

      if (cartCookie.id) {
        try {
          const response = yield window.fetch(
            `${getParent(self, 1).apiUrl}/carts/${self.id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
              },
              body: JSON.stringify({
                customer_id: customerId
              })
            }
          );
          let json = response;
          json = yield json.json();

          console.log(json);
        } catch (err) {
          console.log(err);
        }
      }
    }),

    deleteBigCcart: flow(function* deleteBigCcart(cookie) {
      try {
        yield window.fetch(`${getParent(self, 1).apiUrl}/carts/${cookie}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        });
        self.clearCart();
        self.coupon.resetCoupon();
      } catch (err) {
        console.log(err);
      }
    }),

    addToCart({
      item,
      quantity,
      optionValue1,
      optionValue2,
      optionValue3,
      optionValueName1,
      optionValueName2,
      optionValueName3
    }) {
      // Check cart for existing order item
      const prevId = item.item ? item.item : item.id;
      const id = `${prevId}${optionValue1}${optionValue2}${optionValue3}`;
      const existingItem = self.items.find(i => i.id === id);
      // if brand new cart
      if (!self.id) {
        self.createBigCcart(
          item,
          quantity,
          optionValue1,
          optionValue2,
          optionValue3,
          optionValueName1,
          optionValueName2,
          optionValueName3
        );
        // if cart has an id already and product exists
      } else if (existingItem) {
        existingItem.addCartQuantity(quantity);
        // if cart has an id already and product doesn't exists
      } else {
        self.updateBigCcart(
          item,
          quantity,
          optionValue1,
          optionValue2,
          optionValue3,
          optionValueName1,
          optionValueName2,
          optionValueName3
        );
      }
    },

    removeFromCart(item) {
      item.removeFromCart();
      self.items = self.items.filter(i => i.id !== item.id);
      if (self.items.length === 0) {
        self.clearCart();
      }
    }
  }));

export default Cart;
