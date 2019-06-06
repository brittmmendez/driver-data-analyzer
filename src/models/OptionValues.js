// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';
import OptionValueData from './OptionValueData';

const OptionValues = types.model({
  id: types.optional(types.number, 0),
  label: types.optional(types.string, ''),
  sort_order: types.optional(types.number, 0),
  is_default: types.optional(types.boolean, false),
  // value_data helps with color -> hexcode found here to make actual color show on page
  value_data: types.maybeNull(OptionValueData, {})
});

export default OptionValues;
