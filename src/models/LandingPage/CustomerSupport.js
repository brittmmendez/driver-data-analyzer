// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const CustomerSupport = types
  .model({
    customerSupportTitle: types.optional(types.string, ''),
    customerSupportMessaging: types.optional(types.string, ''),
    customerSupportMediaFile: types.optional(types.string, ''),
    customerSupportMediaText: types.optional(types.string, ''),
    customerSupportCtaCallButtonText: types.optional(types.string, ''),
    customerSupportCtaCallButtonMobileText: types.optional(types.string, ''),
    customerSupportCtaCallButtonUrl: types.optional(types.string, ''),
    customerSupportCtaEmailButtonText: types.optional(types.string, ''),
    customerSupportCtaEmailButtonMobileText: types.optional(types.string, ''),
    customerSupportCtaEmailButtonUrl: types.optional(types.string, ''),
    customerSupportCtaFaqButtonText: types.optional(types.string, ''),
    customerSupportCtaFaqButtonUrl: types.optional(types.string, '')
  })
  .actions(self => ({
    setCustomerSupport(support) {
      self.customerSupportTitle = support.items[0].fields.customerSupportTitle;
      self.customerSupportMessaging =
        support.items[0].fields.customerSupportMessaging;
      self.customerSupportMediaFile =
        `https:${support.items[0].fields.customerSupportMedia.fields.file.url}`;
      self.customerSupportMediaText =
        support.items[0].fields.customerSupportMedia.fields.title;
      self.customerSupportCtaCallButtonUrl =
        support.items[0].fields.customerSupportCtacallButton.fields.ctaUrl;
      self.customerSupportCtaCallButtonText =
        support.items[0].fields.customerSupportCtacallButton.fields.ctaText;
      self.customerSupportCtaCallButtonMobileText =
        support.items[0].fields.customerSupportCtAcallMobileButton;
      self.customerSupportCtaEmailButtonUrl =
        support.items[0].fields.customerSupportCTAemailButton.fields.ctaUrl;
      self.customerSupportCtaEmailButtonText =
        support.items[0].fields.customerSupportCTAemailButton.fields.ctaText;
      self.customerSupportCtaEmailButtonMobileText =
        support.items[0].fields.customerSupportCtAemailMobileButton;
      self.customerSupportCtaFaqButtonText =
        support.items[0].fields.customerSupportCtAfaqButton.fields.ctaText;
      self.customerSupportCtaFaqButtonUrl =
        support.items[0].fields.customerSupportCtAfaqButton.fields.ctaRelativeUrl;
    }
  }));

export default CustomerSupport;
