// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';
import ProductGroup from './ProductGroup';

const ProductGroupingGroup = types
  .model({
    productGroupingGroupTitle: types.optional(types.string, ''),
    productGroups: types.optional(types.array(ProductGroup), [])
  })
  .actions(self => ({
    setProductGroups(groups) {
      self.productGroupingGroupTitle =
        groups.items[0].fields.productGroupingGroupTitle;
      groups.items[0].fields.productGroup.map(group => {
        //eslint-disable-line
        self.productGroups.push({
          productGroupTitle: group.fields.productGroupTitle,
          productGroupMediaTitle: group.fields.productGroupMedia.fields.title,
          productGroupMediaFile: `https://${
            group.fields.productGroupMedia.fields.file.url
            }`,
          productGroupRelativeUrl: group.fields.ctaRelativeUrl,
          productGroupPixelContentType: group.fields.pixelContentType
        });
      });
    }
  }));

export default ProductGroupingGroup;
