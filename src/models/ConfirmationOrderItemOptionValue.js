// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const OrderItemOptionValue = types.model({
  // stores info from checkout form
  label: types.optional(types.string, ''),
  value: types.optional(types.string, '')
});

export default OrderItemOptionValue;
