// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const SocialProof = types.model({
  socialProofCopy: types.optional(types.string, ''),
  socialProofUser: types.optional(types.string, '')
});

export default SocialProof;
