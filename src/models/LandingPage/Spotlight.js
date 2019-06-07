// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const Spotlight = types
  .model({
    spotlightProductTitle: types.optional(types.string, ''),
    spotlightProductMessaging: types.optional(types.string, ''),
    spotlightProductMediaFile: types.optional(types.string, ''),
    spotlightProductMediaText: types.optional(types.string, ''),
    spotlightProductCtaButtonUrl: types.optional(types.string, ''),
    spotlightProductCtaButtonText: types.optional(types.string, ''),
    spotlightProductCtaButtonRelativeURL: types.optional(types.string, '')
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
      self.spotlightProductCtaButtonUrl =
        spotlight.fields.spotlightProductCtaButton.fields.ctaUrl;

      self.spotlightProductCtaButtonRelativeURL =
        spotlight.fields.spotlightProductCtaButton.fields.ctaRelativeUrl;
      self.spotlightProductCtaButtonText =
        spotlight.fields.spotlightProductCtaButton.fields.ctaText;
    }
  }));

export default Spotlight;
