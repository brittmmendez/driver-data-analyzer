// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';
import OptionValues from './OptionValues';

const ProductOptions = types.model({
  id: types.optional(types.number, 0),
  product_id: types.optional(types.number, 0),
  display_name: types.optional(types.string, ''),
  option_values: types.optional(types.array(OptionValues), []),
  type: types.optional(types.string, '')
});

export default ProductOptions;
