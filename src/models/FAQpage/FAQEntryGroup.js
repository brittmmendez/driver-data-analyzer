// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
import { types } from 'mobx-state-tree';
import FAQgroup from './FAQgroup';

const FAQEntryGroup = types
  .model({
    title: types.optional(types.string, ''),
    FAQEntry: types.optional(types.array(FAQgroup), [])
  });

export default FAQEntryGroup;
