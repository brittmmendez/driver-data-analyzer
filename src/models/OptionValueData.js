// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const OptionValueData = types.model({
  // this is the format that BigC api sends options for products
  colors: types.maybeNull(types.array(types.string), [])
});

export default OptionValueData;
