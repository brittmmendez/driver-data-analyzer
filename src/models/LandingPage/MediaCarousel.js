// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';
import Media from './Media';

const MediaCarousel = types
  .model({
    socialProofGroupTitle: types.optional(types.string, ''),
    media: types.optional(types.array(Media), []),
    socialProofGroupMessage: types.optional(types.string, '')
  })
  .actions(self => ({
    setMediaCarousel(proofs) {
      self.socialProofGroupTitle = proofs.fields.socialProofGroupTitle;
      self.socialProofGroupMessage = proofs.fields.socialProofMessaging;
      proofs.fields.socialProof.forEach(proof => {
        self.media.push({
          socialProofMediaFile: `https:${
            proof.fields.socialProofMedia.fields.file.url
            // }?fm=webp`,
            }`,
          socialProofMediaTitle: proof.fields.socialProofMedia.fields.title
        });
      });
    }
  }));

export default MediaCarousel;
