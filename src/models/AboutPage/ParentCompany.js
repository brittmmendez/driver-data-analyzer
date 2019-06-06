// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';
import BrandImages from './BrandImages';

const ParentCompany = types
  .model({
    title: types.optional(types.string, ''),
    subTitle: types.optional(types.string, ''),
    body: types.optional(types.string, ''),
    img: types.optional(types.array(BrandImages), []),
  })
  .actions(self => ({
    setParentCompany(parentCompany) {
      self.title = parentCompany.items[0].fields.detailedInfoHeading
      self.subTitle = parentCompany.items[0].fields.detailedInfoSubheading
      self.body = parentCompany.items[0].fields.detailedInfoBody

      parentCompany.items[0].fields.detailedInfoImage.map(image => { //eslint-disable-line
        self.img.push({
          mediaFile: `https:${image.fields.file.url}`,
          mediaTitle: image.fields.title,
        });
      })
    }
  }))

export default ParentCompany;
