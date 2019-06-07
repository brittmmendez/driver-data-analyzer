// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const HowItWorks = types
  .model({
    title: types.optional(types.string, ''),
    body: types.optional(types.string, ''),
    productMediaFile: types.optional(types.string, ''),
    productMediaText: types.optional(types.string, ''),
    btnText: types.optional(types.string, ''),
    btnUrl: types.optional(types.string, ''),
  })
  .actions(self => ({
    setHowItWorks(howItWorks) {
      self.title = howItWorks.items[0].fields.howItWorksHeading;
      self.body = howItWorks.items[0].fields.howItWorksDescription;
      self.btnText = howItWorks.items[0].fields.btnTxt;
      self.btnUrl = howItWorks.items[0].fields.btnUrl;
      self.productMediaFile = `https:${
        howItWorks.items[0].fields.howItWorksMedia[0].fields.file.url
        }`;
      self.productMediaText =
        howItWorks.items[0].fields.howItWorksMedia[0].fields.title;
    }
  }));

export default HowItWorks;
