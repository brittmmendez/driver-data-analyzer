// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const BrandImages = types.model({
  mediaFile: types.optional(types.string, ''),
  mediaTitle: types.optional(types.string, '')
});

export default BrandImages;
