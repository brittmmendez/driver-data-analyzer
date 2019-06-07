// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const SpotlightSolution = types
  .model({
    spotlightProductTitle: types.optional(types.string, ''),
    spotlightProductMessaging: types.optional(types.string, ''),
    spotlightProductMediaFile: types.optional(types.string, ''),
    spotlightProductMediaText: types.optional(types.string, ''),
    spotlightProductSubheading: types.optional(types.string, '')
  })
  .actions(self => ({
    setSpotlight(spotlight) {
      self.spotlightProductTitle = spotlight.fields.spotlightProductTitle;
      self.spotlightProductMessaging =
        spotlight.fields.spotlightProductMessaging;
      self.spotlightProductMediaFile = `https:${
        spotlight.fields.spotlightProductMedia.fields.file.url
      }`;
      self.spotlightProductMediaText =
        spotlight.fields.spotlightProductMedia.fields.title;
      self.spotlightProductSubheading =
        spotlight.fields.spotlightProductSubheading;
    }
  }));

export default SpotlightSolution;
