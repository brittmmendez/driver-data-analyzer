// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const ShippingInfo = types.model({
  // stores info from checkout form
  first_name: types.optional(types.string, ''),
  last_name: types.optional(types.string, ''),
  address1: types.optional(types.string, ''),
  address2: types.optional(types.string, ''),
  city: types.optional(types.string, ''),
  state_or_province: types.optional(types.string, ''),
  state_or_province_code: types.optional(types.string, ''),
  postal_code: types.optional(types.string, ''),
  country: types.optional(types.string, 'United States'),
  phone: types.optional(types.string, ''),
  email: types.optional(types.string, '')
})
.actions(self => ({
  resetShippingInfo() {
    self.id = ''
    self.first_name = ''
    self.last_name = ''
    self.address1 = ''
    self.address2 = ''
    self.city = ''
    self.state_or_province = ''
    self.state_or_province_code = ''
    self.postal_code = ''
    self.email = ''
    self.phone = ''
    self.country = 'United States'
  },
}))

export default ShippingInfo;
