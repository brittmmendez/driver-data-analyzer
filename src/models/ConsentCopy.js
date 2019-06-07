// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
import { types } from 'mobx-state-tree';


const ConsentCopy = types
  .model({
    title: types.optional(types.string, ''),
    consentCopy: types.optional(types.string, ''),
    consentProductsPage: types.optional(types.string, ''),
    checkoutConsentFormDescription: types.optional(types.string, ''),
    consentFormTitle: types.optional(types.string, ''),
    consentLegalNumber: types.optional(types.string, ''),
    consentFormSubHeader: types.optional(types.string, ''),
    consentFormBody: types.optional(types.string, ''),
    consetnAgreeOption: types.optional(types.string, ''),
  });

export default ConsentCopy;
