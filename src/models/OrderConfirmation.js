// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types, flow, getParent } from 'mobx-state-tree';
import ConfirmationOrderItem from './ConfirmationOrderItem';

const OrderConfirmation = types
  .model({
    securedConfirmation: types.optional(types.boolean, false),
    orderLookUpError: types.optional(types.boolean, false),
    orderSummaryError: types.optional(types.boolean, false),
    order_id: types.maybe(types.number, 0),
    customer_id: types.maybe(types.number, 0),
    billing_first_name: types.optional(types.string, ''),
    billing_last_name: types.optional(types.string, ''),
    billing_address1: types.optional(types.string, ''),
    billing_address2: types.optional(types.string, ''),
    billing_city: types.optional(types.string, ''),
    billing_state_or_province: types.optional(types.string, ''),
    billing_state_or_province_code: types.optional(types.string, ''),
    billing_postal_code: types.optional(types.string, ''),
    billing_country: types.optional(types.string, 'United States'),
    shipping_first_name: types.optional(types.string, ''),
    shipping_last_name: types.optional(types.string, ''),
    shipping_address1: types.optional(types.string, ''),
    shipping_address2: types.optional(types.string, ''),
    shipping_city: types.optional(types.string, ''),
    shipping_email: types.optional(types.string, ''),
    shipping_state_or_province: types.optional(types.string, ''),
    shipping_state_or_province_code: types.optional(types.string, ''),
    shipping_postal_code: types.optional(types.string, ''),
    shipping_country: types.optional(types.string, 'United States'),
    sub_total: types.maybe(types.number, 0),
    shipping_handling: types.maybe(types.number, 0),
    tax: types.maybe(types.number, 0),
    promo_amount: types.maybe(types.number, 0),
    promo_name: types.optional(types.string, ''),
    promo_code: types.optional(types.string, ''),
    total: types.maybe(types.number, 0),
    items: types.optional(types.array(ConfirmationOrderItem), [])
  })
  .views(self => ({
    get itemCount() {
      let totalQuantity = 0;
      self.items.map(i => {
        totalQuantity += i.quantity;
        return totalQuantity;
      });
      return totalQuantity;
    }
  }))
  .actions(self => ({
    orderLookup: flow(function* orderLookup(info) {
      const shop = getParent(self, 2);
      try {
        const response = yield window.fetch(
          `${shop.apiUrl}/orders/${info.orderNumber}/lookup`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              email: info.email
            })
          }
        );
        let json = response;
        json = yield json.json();
        self.setOrderSummary(json);
        shop.payment.createOrderLookUpPaymentModel(json);
        self.securedConfirmation = true;
        return true;
      } catch (err) {
        console.log(err);
        self.securedConfirmation = false;
        self.orderLookUpError = true;
        return false;
      }
    }),

    setOrderSummary(json) {
      self.order_id = json.id;
      // shipping info
      const shippingInfo = json.shipping_address[0];
      if (shippingInfo) {
        self.shipping_first_name = shippingInfo.first_name;
        self.shipping_last_name = shippingInfo.last_name;
        self.shipping_address1 = shippingInfo.street_1;
        self.shipping_address2 = shippingInfo.street_2;
        self.shipping_city = shippingInfo.city;
        self.shipping_state_or_province = shippingInfo.state;
        // self.shipping_state_or_province_code = shippingInfo.state_or_province_code
        self.shipping_postal_code = shippingInfo.zip;
        self.shipping_country = 'US';
        self.shipping_phone = shippingInfo.phone;
        self.shipping_email = shippingInfo.email;
      }
      // billing info
      const billingInfo = json.billing_address;
      if (billingInfo) {
        self.billing_first_name = billingInfo.first_name;
        self.billing_last_name = billingInfo.last_name;
        self.billing_address1 = billingInfo.street_1;
        self.billing_address2 = billingInfo.street_2;
        self.billing_city = billingInfo.city;
        self.billing_state_or_province = billingInfo.state;
        // self.billing_state_or_province_code = billingInfo.state_or_province_code
        self.billing_postal_code = billingInfo.zip;
        self.billing_country = 'US';
        self.billing_phone = billingInfo.phone || '';
        self.billing_email = billingInfo.email || '';
      }
      // set sub total
      self.sub_total = parseFloat(json.subtotal_ex_tax);
      // set shipping
      self.shipping_handling = parseFloat(json.shipping_cost_inc_tax);
      // set tax
      self.tax = parseFloat(json.total_tax);
      // set total
      self.total = parseFloat(json.total_inc_tax);
      // set promo
      const coupon = json.coupons;
      if (coupon !== '') {
        self.promo_amount = parseFloat(coupon[0].discount);
        self.setCoupon(coupon);
      }

      // set orderItems
      json.products.map(item => {
        self.items.push({
          id: item.product_id,
          sku: item.sku,
          name: item.name,
          price: parseFloat(item.price_ex_tax),
          quantity: item.quantity,
          thumbnail_url: item.product_options.length
            ? self.setVariantImg(item.product_id, item.product_options)
            : item.thumbnail_url,
          base_total: item.base_total,
          option_values: item.product_options.length
            ? [
              {
                label: item.product_options[0].display_name,
                value: item.product_options[0].display_value
              },
              {
                label: item.product_options[1]
                  ? item.product_options[1].display_name
                  : '',
                value: item.product_options[1]
                  ? item.product_options[1].display_value
                  : ''
              },
              {
                label: item.product_options[2]
                  ? item.product_options[2].display_name
                  : '',
                value: item.product_options[2]
                  ? item.product_options[2].display_value
                  : ''
              }
            ]
            : []
        });
        return true;
      });
    },

    setCoupon: flow(function* setCoupon(coupon) {
      const shop = getParent(self, 2);

      const couponResponse = yield window.fetch(
        `${shop.apiUrl}/information/coupons/${coupon[0].code}`
      );
      let jsonCoupon = couponResponse;
      jsonCoupon = yield jsonCoupon.json();
      if (jsonCoupon.length && jsonCoupon[0].enabled) {
        self.promo_name = jsonCoupon[0].name;
        self.promo_code = jsonCoupon[0].code;
      }
    }),

    getOrderSummary: flow(function* getOrderSummary(orderId) {
      const shop = getParent(self, 2);
      try {
        const response = yield window.fetch(
          `${shop.apiUrl}/orders/${orderId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              chargeId: shop.payment.charge_id
            })
          }
        );
        let json = response;
        json = yield json.json();
        self.setOrderSummary(json);
        self.orderSummaryError = false
      } catch (err) {
        self.orderSummaryError = true
        console.log(err);
      }
    }),

    setVariantImg(id, options) {
      const shop = getParent(self, 2);
      const product = shop.products.data.find(p => p.id === id);
      const variantImg = product.findByVariant(
        options[0] && parseInt(options[0].value, 10),
        options[1] && parseInt(options[1].value, 10),
        options[2] && parseInt(options[2].value, 10)
      );

      if (variantImg.length !== 0) {
        return variantImg[0];
      }

      return product.thumbnail_url;
    },

    clearOrderSummary() {
      self.securedConfirmation = false;
      self.order_id = 0;
      self.customer_id = 0;
      self.billing_first_name = '';
      self.billing_last_name = '';
      self.billing_address1 = '';
      self.billing_address2 = '';
      self.billing_city = '';
      self.billing_state_or_province = '';
      self.billing_state_or_province_code = '';
      self.billing_postal_code = '';
      self.billing_country = 'United States';
      self.billing_email = '';
      self.billing_phone = '';
      self.shipping_first_name = '';
      self.shipping_last_name = '';
      self.shipping_address1 = '';
      self.shipping_address2 = '';
      self.shipping_city = '';
      self.shipping_email = '';
      self.shipping_phone = '';
      self.shipping_state_or_province = '';
      self.shipping_state_or_province_code = '';
      self.shipping_postal_code = '';
      self.shipping_country = 'United States';
      self.sub_total = 0;
      self.shipping_handling = 0;
      self.tax = 0;
      self.promo_amount = 0;
      self.promo_name = '';
      self.promo_code = '';
      self.total = 0;
      self.items = [];
    }
  }));

export default OrderConfirmation;
