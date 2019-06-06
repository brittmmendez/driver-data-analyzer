// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
import { types } from 'mobx-state-tree';
import FAQqa from './FAQqa';

const FAQgroup = types
  .model({
    entryTitle: types.optional(types.string, ''),
    FAQqa: types.optional(types.array(FAQqa), [])
  });

export default FAQgroup;
