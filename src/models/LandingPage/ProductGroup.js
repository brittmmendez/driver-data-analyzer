// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const ProductGroup = types.model({
  productGroupTitle: types.optional(types.string, ''),
  productGroupMediaFile: types.optional(types.string, ''),
  productGroupMediaTitle: types.optional(types.string, ''),
  productGroupRelativeUrl: types.optional(types.string, ''),
  productGroupPixelContentType: types.optional(types.string, '')
});

export default ProductGroup;
