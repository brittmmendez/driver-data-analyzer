// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';
import SocialProof from './SocialProof';

const SocialProofGroup = types
  .model({
    socialProofGroupTitle: types.optional(types.string, ''),
    socialProofs: types.optional(types.array(SocialProof), []),
    socialProofBackgroundImage: types.optional(types.string, '')
  })
  .actions(self => ({
    setSocialProofs(proofs) {
      self.socialProofGroupTitle = proofs.fields.socialProofGroupTitle;
      self.socialProofBackgroundImage =
        proofs.fields.backgroundImage.fields.file.url;
      proofs.fields.socialProof.forEach(proof => {
        self.socialProofs.push({
          socialProofCopy: proof.fields.socialProofCopy,
          socialProofUser: proof.fields.socialProofUser
        });
      });
    }
  }));

export default SocialProofGroup;
