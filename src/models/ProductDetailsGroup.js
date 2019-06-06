// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';
import ProductDetails from './ProductDetails';

const ProductDetailsGroup = types.model({
  productId: types.optional(types.string, ''),
  productDetails: types.maybe(types.array(ProductDetails), [])
});

export default ProductDetailsGroup;
