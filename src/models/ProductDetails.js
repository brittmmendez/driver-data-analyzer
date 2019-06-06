// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const ProductDetails = types.model({
  productDetailsTitle: types.optional(types.string, ''),
  productDetailsCopy: types.optional(types.string, ''),
  productDetailsMediaFile: types.optional(types.string, ''),
  productDetailsMediaAlt: types.optional(types.string, '')
});

export default ProductDetails;
