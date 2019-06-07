// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';
import VariantValues from './VariantValues';

const ProductVariant = types.model({
  id: types.optional(types.number, 0),
  sku: types.optional(types.string, ''),
  inventory_level: types.optional(types.number, 0),
  inventory_warning_level: types.optional(types.number, 0),
  image_url: types.optional(types.string, ''),
  price: types.maybeNull(types.number, 0),
  calculated_price: types.optional(types.number, 0),
  values: types.optional(types.array(VariantValues), [])
});

export default ProductVariant;
