// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const VariantValues = types.model({
  // this is the format that BigC api sends options for products
  id: types.optional(types.number, 0),
  label: types.optional(types.string, ''),
  option_display_name: types.optional(types.string, '')
});

export default VariantValues;
