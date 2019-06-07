// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types, flow, getParent } from 'mobx-state-tree';
import { Cookies } from 'react-cookie';
import ShippingRates from './ShippingRates';

const Shipping = types
  .model({
    shipping_rates: types.optional(types.array(ShippingRates), []),
    selected_shipping_id: types.optional(types.string, ''),
    selected_shipping_type: types.optional(types.string, ''),
    selected_shipping_description: types.optional(types.string, ''),
    selected_shipping_cost: types.optional(types.number, 0),
    selected_shipping_transit_time: types.optional(types.string, '')
  })
  .actions(self => ({
    addShippingOptions(options) {
      self.shipping_rates = options;
    },

    setSelectedShipping(shippingSelected) {
      self.selected_shipping_id = shippingSelected.id;
      self.selected_shipping_type = shippingSelected.type;
      self.selected_shipping_description = shippingSelected.description;
      self.selected_shipping_cost = shippingSelected.cost;
      self.selected_shipping_transit_time = shippingSelected.transit_time;
    },

    resetSelectedShipping() {
      self.shipping_rates = []
      self.selected_shipping_id = ''
      self.selected_shipping_type = ''
      self.selected_shipping_description = ''
      self.selected_shipping_cost = 0
      self.selected_shipping_transit_time = ''
    },

    setShippingOption: flow(function* setShippingOption(shippingOptionId) {
      try {
        const response = yield window.fetch(
          // need to have the consignment ID
          `${getParent(self, 1).apiUrl}/checkouts/${
          getParent(self, 1).checkout.id
          }/consignments/${getParent(self, 1).checkout.consignmentId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            // need to add body for updating address
            body: JSON.stringify({
              shipping_option_id: shippingOptionId
            })
          }
        );
        let json = response;
        json = yield json.json();
        getParent(self, 1).cart.setShipping(json.shipping_cost_total_inc_tax);
        // set shipping option ID if res has selected_shipping_option
        const shippingSelected = json.consignments[0].selected_shipping_option;
        if (shippingSelected) {
          self.setSelectedShipping(shippingSelected);
        }
        getParent(self, 1).cart.setCartAmount(json.grand_total);
        getParent(self, 1).cart.setTaxAmount(json.tax_total);
        const cookies = new Cookies();
        cookies.set('shippingOptionSet', { shippingOptionSet: true }, { path: '/' });
        getParent(self, 1).checkout.setShippingMethodError(false);
        return true
      } catch (err) {
        console.log(err);
        getParent(self, 1).checkout.setShippingMethodError(true);
        return false
      }
    })
  }));

export default Shipping;
