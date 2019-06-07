// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable no-debugger */
import { types, flow, getParent } from 'mobx-state-tree';

const Coupon = types
  .model({
    id: types.maybe(types.number),
    code: types.optional(types.string, ''),
    name: types.optional(types.string, ''),
    coupon_type: types.optional(types.string, ''),
    discounted_amount: types.optional(types.number, 0),
    promo: types.optional(types.boolean, false),
    error: types.optional(types.boolean, false),
    errorMesage: types.optional(types.string, ''),

  })
  .views(self => ({
    get getDiscount() {
      if (self.discounted_amount === 0) {
        return '--';
      }
      return `-$${self.discounted_amount.toFixed(2)}`;
    }
  }))
  .actions(self => ({
    resetError() {
      self.error = false
      self.errorMesage = ""
    },
    // set coupon
    applyPromo: flow(function* applyPromo(couponCode) {
      try {
        const response = yield window.fetch(
          `${getParent(self, 2).apiUrl}/checkouts/${getParent(self, 1).id}/coupons`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              coupon_code: couponCode,
            })
          }
        );
        let json = response;
        json = yield json.json();
        self.setDiscountAmount(json.coupons[0].discounted_amount)
        self.getCoupon(json.coupons[0].code)
        self.error = false;
        getParent(self, 1).setCartAmount(json.grand_total);
        if (getParent(self, 1).tax_total !== 0) {
          getParent(self, 1).setTaxAmount(json.tax_total);
        }
        return true;
      } catch (err) {
        self.errorMesage = 'We’re sorry, this code is inapplicable.'
        self.error = true;
        return false;
      }
    }),

    // get promo
    getCoupon: flow(function* getCoupon(code) {
      try {
        const response = yield window.fetch(
          `${getParent(self, 2).apiUrl}/information/coupons/${code}`
        );
        let json = response;
        json = yield json.json();
        if (json.length && json[0].enabled) {
          self.setCoupon(json[0]);
        }
      } catch (err) {
        self.resetCoupon();
        console.log(err);
      }
    }),

    // remove coupon
    removePromo: flow(function* removePromo() {
      try {
        const response = yield window.fetch(
          `${getParent(self, 2).apiUrl}/checkouts/${getParent(self, 1).id}/coupons/${self.code}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            }
          }
        );
        let json = response;
        json = yield json.json();
        getParent(self, 1).setCartAmount(json.grand_total);
        if (getParent(self, 1).tax_total !== 0) {
          getParent(self, 1).setTaxAmount(json.tax_total);
        }
        self.resetCoupon();
      } catch (err) {
        console.log(err);
      }
    }),

    setDiscountAmount(discountAmount) {
      self.discounted_amount = discountAmount;
    },

    resetErrorMsg() {
      self.errorMesage = ''
      self.error = false;
    },

    resetCoupon() {
      self.promo = false;
      self.id = 0;
      self.code = '';
      self.coupon_type = '';
      self.discounted_amount = 0;
      self.name = '';
    },

    setCoupon(json) {
      self.promo = true;
      self.id = json.id;
      self.code = json.code;
      self.coupon_type = json.coupon_type;
      self.name = json.name;
    }
  }));

export default Coupon;
