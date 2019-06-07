// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const CRMsignup = types.model({
    signupFormError: types.optional(types.boolean, false),
    signupFormSuccess: types.optional(types.boolean, false),
    signupModal: types.optional(types.boolean, false),
    viaSignupModal: types.optional(types.boolean, false),
    signupCompleted: types.optional(types.boolean, false),
    signupHeadline: types.optional(types.string, ''),
    signupDescription: types.optional(types.string, ''),
    signupBtnText: types.optional(types.string, ''),
    signupThankYouHeadline: types.optional(types.string, ''),
    signupThankYouDescription: types.optional(types.string, ''),
    signupOptIn: types.optional(types.string, ''),
    closeBtnText: types.optional(types.string, ''),
})
    .actions(self => ({
        setSignupFormError(boolean) {
            self.signupFormError = boolean;
        },

        setSignupFormSuccess(boolean) {
            self.signupFormSuccess = boolean;
            self.signupCompleted = true;
        },

        setSignupModal(boolean) {
            self.signupModal = boolean;
            self.signupCompleted = true;
        },

        setViaSignupModal(boolean) {
            self.viaSignupModal = boolean;
        },

        setSignup(signup) {
            self.signupHeadline = signup.fields.signupHeadline;
            self.signupDescription = signup.fields.signupDescription;
            self.signupBtnText = signup.fields.submitBtnText;
            self.signupThankYouHeadline = signup.fields.signupThankYouHeadline;
            self.signupThankYouDescription = signup.fields.signupThankYouDescription;
            self.closeBtnText = signup.fields.closeBtnText;
            self.signupOptIn = signup.fields.signupOptIn;
        }
    }));

export default CRMsignup;
