// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';
import Benefit from './Benefit';

const ProductBenefitGroup = types
  .model({
    productBenefitGroupTitle: types.optional(types.string, ''),
    productBenefitMessaging: types.optional(types.string, ''),
    ctaURL: types.optional(types.string, ''),
    ctaText: types.optional(types.string, ''),
    benefits: types.optional(types.array(Benefit), [])
  })
  .actions(self => ({
    setBenefits(benefits) {
      self.ctaText =
        benefits.items[0].fields.ctaButton.fields.ctaText

      self.ctaURL =
        benefits.items[0].fields.ctaButton.fields.ctaRelativeUrl

      self.productBenefitGroupTitle =
        benefits.items[0].fields.productBenefitGroupTitle;
      self.productBenefitMessaging =
        benefits.items[0].fields.productBenefitMessaging;
      benefits.items[0].fields.productBenefit.map(benefit => {
        //eslint-disable-line
        self.benefits.push({
          productBenefitMediaFile: `https:${
            benefit.fields.productBenefitMedia.fields.file.url
            }`,
          productBenefitMediaTitle:
            benefit.fields.productBenefitMedia.fields.title
        });
      });
    }
  }));

export default ProductBenefitGroup;
