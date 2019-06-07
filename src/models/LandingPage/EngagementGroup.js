// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';
import Conclusion from './Conclusion';

const EngagementGroup = types
  .model({
    userEngagementTitle: types.optional(types.string, ''),
    userEngagementMessaging: types.optional(types.string, ''),
    conclusions: types.optional(types.array(Conclusion), [])
  })
  .actions(self => ({
    setConclusions(conclusions) {
      self.userEngagementTitle = conclusions.fields.userEngagementTitle;
      self.userEngagementMessaging = conclusions.fields.userEngagementMessaging;
      conclusions.fields.userEngagementConclusion.map(conclusion => {
        self.conclusions.push({
          conclusionQuestion: conclusion.fields.conclusionQuestion,
          conclusionAnswer: conclusion.fields.conclusionAnswer,
          conclusionMessaging: conclusion.fields.conclusionMessaging
        });
      });
    }
  }));

export default EngagementGroup;
