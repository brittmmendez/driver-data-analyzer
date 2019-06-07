// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const FAQqa = types.model({
  FAQQuestion: types.optional(types.string, ''),
  FAQAnswer: types.optional(types.string, '')
});

export default FAQqa;
