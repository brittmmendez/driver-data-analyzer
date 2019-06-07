// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const Conclusion = types.model({
  conclusionQuestion: types.optional(types.string, ''),
  conclusionAnswer: types.optional(types.string, ''),
  conclusionMessaging: types.optional(types.string, '')
});

export default Conclusion;
