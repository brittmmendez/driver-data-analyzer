// MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable no-debugger */
import { types, flow, getParent } from 'mobx-state-tree';
import { Cookies } from 'react-cookie';
import BillingInfo from './BillingInfo';
import ShippingInfo from './ShippingInfo';
import OrderConfirmation from './OrderConfirmation';
import CheckoutStepTracker from './CheckoutStepTracker';

const Checkout = types
  .model({
    id: types.optional(types.string, ''),
    consignmentId: types.optional(types.string, ''),
    shippingInfo: types.optional(ShippingInfo, {}),
    shippingInfoError: types.optional(types.boolean, false),
    shippingMethodError: types.optional(types.boolean, false),
    billingInfo: types.optional(BillingInfo, {}),
    billingInfoError: types.optional(types.boolean, false),
    orderConfirmation: types.optional(OrderConfirmation, {}),
    checkoutStepTracker: types.optional(CheckoutStepTracker, {})
  })
  .views(self => ({
    get checkoutError() {
      return (self.shippingInfoError || self.shippingMethodError || self.billingInfoError)
    },

  }))
  .actions(self => ({
    setCheckoutId(cookieCheckoutId) {
      self.id = cookieCheckoutId;
      self.getCheckoutSummary();
    },

    clearCheckoutIds() {
      self.consignmentId = '';
      self.id = '';
    },

    resetErrors() {
      self.shippingInfoError = false;
      self.shippingMethodError = false;
      self.billingInfoError = false;

    },

    setShippingMethodError(boolean) {
      self.shippingMethodError = boolean;
    },

    // adds shipping info from checkout form
    addShippingInfo(info) {
      const infoObj = {
        first_name: info.first_name,
        last_name: info.last_name,
        address1: info.address1,
        address2: info.address2,
        city: info.city,
        state_or_province: info.state_or_province,
        state_or_province_code: info.state_or_province_code,
        postal_code: info.postal_code,
        country: 'US',
        phone: info.phone,
        email: info.email
      };
      self.shippingInfo = infoObj;
      if (self.consignmentId) {
        return self.updateConsignment();
      }
      return self.addConsignment();

    },

    // adds shipping info from checkout form
    addBillingInfo(info) {
      const infoObj = {
        first_name: info.first_name,
        last_name: info.last_name,
        address1: info.address1,
        address2: info.address2,
        city: info.city,
        state_or_province: info.state_or_province,
        state_or_province_code: info.state_or_province_code,
        postal_code: info.postal_code,
        country: 'US',
        phone: info.phone,
        email: info.email
      };
      self.billingInfo = infoObj;
      return self.addBilling();
    },

    getCheckoutSummary: flow(function* getCheckoutSummary() {
      if (self.id) {
        try {
          const response = yield window.fetch(
            `${getParent(self, 1).apiUrl}/checkouts/${self.id}`
          );

          let json = response;
          json = yield json.json();
          getParent(self, 1).cart.setCartAmount(json.grand_total);
          if (json.consignments.slice().length > 0) {
            const shippingInfo = json.consignments.slice()[0].shipping_address;
            if (shippingInfo) {
              const infoObj = {
                first_name: shippingInfo.first_name,
                last_name: shippingInfo.last_name,
                address1: shippingInfo.address1,
                address2: shippingInfo.address2,
                city: shippingInfo.city,
                state_or_province: shippingInfo.state_or_province,
                state_or_province_code: shippingInfo.state_or_province_code,
                postal_code: shippingInfo.postal_code,
                country: 'US',
                phone: shippingInfo.phone,
                email: shippingInfo.email
              };
              self.shippingInfo = infoObj;
            }
            self.consignmentId = json.consignments[0].id;
            getParent(self, 1).shipping.addShippingOptions(
              json.consignments[0].available_shipping_options
            );
            getParent(self, 1).cart.setTaxAmount(json.tax_total);
            getParent(self, 1).cart.setShipping(
              json.shipping_cost_total_inc_tax
            );
          }
          if (json.billing_address.id) {
            self.billingInfo.id = json.billing_address.id;
            self.billingInfo.first_name = json.billing_address.first_name;
            self.billingInfo.last_name = json.billing_address.last_name;
            self.billingInfo.address1 = json.billing_address.address1;
            self.billingInfo.address2 = json.billing_address.address2 || '';
            self.billingInfo.city = json.billing_address.city;
            self.billingInfo.state_or_province =
              json.billing_address.state_or_province;
            self.billingInfo.state_or_province_code =
              json.billing_address.state_or_province_code;
            self.billingInfo.postal_code = json.billing_address.postal_code;
            self.billingInfo.country = 'US';
            self.billingInfo.email = json.billing_address.email;
          }
        } catch (err) {
          console.log(err);
        }
      }
    }),

    prepItems() {
      // add additional product info based on your products ex. product option id's and values
      const items = getParent(self, 1).cart.items.map(item => ({
        item_id: item.uuid,
        quantity: item.quantity
      }));
      return items;
    },

    addConsignment: flow(function* addConsignment() {
      const { shippingInfo, id } = self;
      if (id) {
        try {
          const response = yield window.fetch(
            `${getParent(self, 1).apiUrl}/checkouts/${self.id}/consignments`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
              },
              body: JSON.stringify([
                {
                  shipping_address: {
                    first_name: shippingInfo.first_name,
                    last_name: shippingInfo.last_name,
                    email: shippingInfo.email,
                    address1: shippingInfo.address1,
                    address2: shippingInfo.address2,
                    city: shippingInfo.city,
                    state_or_province: shippingInfo.state_or_province,
                    state_or_province_code: shippingInfo.state_or_province_code,
                    country_code: 'US',
                    postal_code: shippingInfo.postal_code,
                    phone: shippingInfo.phone
                  },
                  line_items: self.prepItems()
                }
              ])
            }
          );
          let json = response;
          json = yield json.json();
          self.consignmentId = json.consignments[0].id;
          self.shippingInfoError = false;
          self.checkoutStepTracker.setShippingInfoComplete();
          // creating and setting a consignmentId cookie so that we can prepopulate shipping info form data on page reload
          const cookies = new Cookies();
          cookies.set(
            'consignmentId',
            { consignmentId: json.consignments[0].id },
            { path: '/' }
          );

          getParent(self, 1).shipping.addShippingOptions(
            json.consignments[0].available_shipping_options
          );
          getParent(self, 1).cart.setTaxAmount(json.tax_total);
          getParent(self, 1).cart.setCartAmount(json.grand_total);

          // presetting billing infor for same as shipping credit card submission
          self.billingInfo.setStreet(self.shippingInfo.address1);
          self.billingInfo.setCity(self.shippingInfo.city);
          self.billingInfo.setState(self.shippingInfo.state_or_province);
          self.billingInfo.setZip(self.shippingInfo.postal_code);
          return true
        } catch (err) {
          self.shippingInfoError = true;
          return false
        }
      }
      return true
    }),

    updateConsignment: flow(function* updateConsignment() {
      const { shippingInfo, id } = self;
      if (id) {
        try {
          const response = yield window.fetch(
            // need to have the consignment ID
            `${getParent(self, 1).apiUrl}/checkouts/${self.id}/consignments/${
            self.consignmentId
            }`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
              },
              body: JSON.stringify({
                shipping_address: {
                  first_name: shippingInfo.first_name,
                  last_name: shippingInfo.last_name,
                  email: shippingInfo.email,
                  address1: shippingInfo.address1,
                  address2: shippingInfo.address2,
                  city: shippingInfo.city,
                  state_or_province: shippingInfo.state_or_province,
                  state_or_province_code: shippingInfo.state_or_province_code,
                  country_code: 'US',
                  postal_code: shippingInfo.postal_code,
                  phone: shippingInfo.phone
                },
                line_items: self.prepItems()
              })
            }
          );
          let json = response;
          json = yield json.json();
          getParent(self, 1).shipping.addShippingOptions(
            json.consignments[0].available_shipping_options
          );
          // if shippingOption was already submitted -> resubmit.
          if (self.checkoutStepTracker.shippingOptionComplete) {
            getParent(self, 1).shipping.setShippingOption(
              json.consignments[0].available_shipping_options[0].id
            );
          }

          // if billing is same as shipping, resubmit billing
          self.addBillingInfo({
            first_name: shippingInfo.first_name,
            last_name: shippingInfo.last_name,
            address1: shippingInfo.address1,
            address2: shippingInfo.address2,
            city: shippingInfo.city,
            state_or_province: shippingInfo.state_or_province,
            state_or_province_code: shippingInfo.state_or_province_code,
            postal_code: shippingInfo.postal_code,
            country: 'US',
            phone: shippingInfo.phone,
            email: shippingInfo.email
          })

          self.shippingInfoError = false;
          return true
        } catch (err) {
          self.shippingInfoError = true;
          return false
        }
      }
      return true
    }),

    addBilling: flow(function* addBilling() {
      const { billingInfo, id } = self;
      if (id) {
        try {
          const response = yield window.fetch(
            `${getParent(self, 1).apiUrl}/checkouts/${self.id}/billing-address`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
              },
              body: JSON.stringify({
                first_name: billingInfo.first_name,
                last_name: billingInfo.last_name,
                email: self.shippingInfo.email,
                address1: billingInfo.address1,
                address2: billingInfo.address2,
                city: billingInfo.city,
                state_or_province: billingInfo.state_or_province,
                state_or_province_code: billingInfo.state_or_province_code,
                country_code: 'US',
                postal_code: billingInfo.postal_code
              })
            }
          );
          let json = response;
          json = yield json.json();
          billingInfo.id = json.billing_address.id;
          self.billingInfoError = false
          return true
        } catch (err) {
          console.log(err);
          self.billingInfoError = true
          return false
        }
      }
      return true
    }),

    // MobX State Tree Lifecycle methods
    afterCreate() {
      self.load();
    },

    load() {
      self.getCheckoutSummary();
    },

    reload() {
      self.load();
    }
  }));

export default Checkout;
