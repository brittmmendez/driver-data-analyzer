// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const ShippingRates = types
  .model({
    id: types.optional(types.string, ''),
    type: types.optional(types.string, ''),
    description: types.optional(types.string, ''),
    cost: types.optional(types.number, 0),
    transit_time: types.optional(types.string, ''),
  });

export default ShippingRates;
