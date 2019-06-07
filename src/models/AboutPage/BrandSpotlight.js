// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const BrandSpotlight = types
  .model({
    title: types.optional(types.string, ''),
    subTitle: types.optional(types.string, ''),
    body: types.optional(types.string, ''),
    spotlightProductMediaFile: types.optional(types.string, ''),
    spotlightProductMediaText: types.optional(types.string, ''),
  })
  .actions(self => ({
    setBrandSpotlight(brandSpotlight) {
      self.title = brandSpotlight.items[0].fields.taglineHeading
      self.subTitle = brandSpotlight.items[0].fields.taglineSubheading
      self.body = brandSpotlight.items[0].fields.taglineBody
      self.spotlightProductMediaFile = `https:${brandSpotlight.items[0].fields.taglineImage.fields.file.url}`;
      self.spotlightProductMediaText = brandSpotlight.items[0].fields.taglineImage.fields.title
    },
  }))

export default BrandSpotlight;
