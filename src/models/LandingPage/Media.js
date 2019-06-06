// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const Media = types.model({
  socialProofMediaFile: types.optional(types.string, ''),
  socialProofMediaTitle: types.optional(types.string, '')
});

export default Media;
