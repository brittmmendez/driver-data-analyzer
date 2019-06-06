// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';
import defaultImage from '../static/images/Placeholder.png';
import ConfirmationOrderItemOptionValue from './ConfirmationOrderItemOptionValue';

const ConfirmationOrderItem = types
  .model({
    id: types.maybe(types.number, 0),
    sku: types.maybe(types.string, ''),
    name: types.maybe(types.string, ''),
    thumbnail_url: types.maybeNull(types.string, defaultImage),
    quantity: types.optional(types.number, 1),
    price: types.optional(types.number, 0),
    option_values: types.maybeNull(
      types.array(ConfirmationOrderItemOptionValue),
      []
    ),
    base_total: types.optional(types.string, '')
  })
  .views(self => ({
    get productTotal() {
      return parseFloat(self.base_total).toFixed(2);
    }
  }));

export default ConfirmationOrderItem;
