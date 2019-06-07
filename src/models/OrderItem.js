// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable no-debugger */
import { types, flow, getParent } from 'mobx-state-tree';
import OrderItemOptionValue from './OrderItemOptionValue';

const OrderItem = types
  .model({
    id: types.maybe(types.string),
    item: types.number,
    uuid: types.string,
    // if a product added to cart (orderItem) has options
    // store them in array to display in cart and checkout process
    option_values: types.maybeNull(types.array(OrderItemOptionValue), []),
    name: types.maybe(types.string, ''),
    description: types.maybe(types.string, ''),
    thumbnail_url: types.maybeNull(types.string, ''),
    quantity: types.optional(types.number, 1),
    price: types.optional(types.number, 0),
    retail_price: types.optional(types.number, 0),
    sale_price: types.optional(types.number, 0),
    extended_sale_price: types.optional(types.number, 0)
  })
  .views(self => ({
    get productTotal() {
      return self.extended_sale_price.toFixed(2);
    }
  }))
  .actions(self => ({
    filteredOptions() {
      // returns filtered list of values selected for OrderItem
      const filtered = self.option_values.filter(value => value.label !== '');
      return filtered;
    },

    updateBigCcartItem: flow(function* updateBigCcartItem() {
      try {
        const response = yield window.fetch(
          `${getParent(self, 3).apiUrl}/carts/${getParent(self, 2).id}/items/${
            self.uuid
          }`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              line_item: {
                quantity: self.quantity,
                list_price: self.sale_price || self.price,
                product_id: self.item
              }
            })
          }
        );
        let json = response;
        json = yield json.json();

        // find item and get it's extended_sale_price
        const orderItem = json.line_items.physical_items.find(
          i => i.id === self.uuid
        );
        self.extended_sale_price = orderItem.extended_sale_price;
        // if there's a coupon, update discount amount
        if (getParent(self, 2).coupon.promo) {
          getParent(self, 2).coupon.setDiscountAmount(
            json.coupons[0].discounted_amount
          );
        }

        getParent(self, 2).setTotals(json);
        if (getParent(self, 2).tax_total) {
          getParent(self, 3).checkout.getCheckoutSummary();
        }
      } catch (err) {
        console.log(err);
      }
    }),

    deleteBigCcartItem: flow(function* deleteBigCcartItem() {
      const api = getParent(self, 3).apiUrl;
      const shop = getParent(self, 3);
      const cart = getParent(self, 2);
      try {
        yield window.fetch(`${api}/carts/${cart.id}/items/${self.uuid}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        });
        if (cart.id) {
          const response = yield window.fetch(`${api}/carts/${cart.id}`);
          let json = response;
          json = yield json.json();
          cart.setTotals(json);
          if (json.coupons.length) {
            cart.coupon.setDiscountAmount(json.coupons[0].discounted_amount);
          }
          if (cart.tax_total) {
            shop.checkout.getCheckoutSummary();
          }
        }
      } catch (err) {
        console.log(err);
      }
    }),

    addCartQuantity(quantity = 1) {
      self.quantity += quantity;
      self.updateBigCcartItem();
    },

    lowerCartQuantity(quantity = 1) {
      self.quantity -= quantity;
      self.updateBigCcartItem();
    },

    removeFromCart() {
      self.quantity_in_cart = 0;
      self.quantity = 0;
      self.deleteBigCcartItem();
    }
  }));

export default OrderItem;
