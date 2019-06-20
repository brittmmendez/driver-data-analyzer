// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const Benefit = types.model({
  productBenefitMediaFile: types.optional(types.string, ''),
  productBenefitMediaTitle: types.optional(types.string, ''),
  productBenefitTitle: types.optional(types.string, ''),
  productBenefitCopy: types.optional(types.string, '')
});

export default Benefit;
