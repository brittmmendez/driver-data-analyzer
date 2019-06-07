// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
import { types, flow, getParent } from 'mobx-state-tree';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const CheckoutStepTracker = types
  .model({
    shippingInfoComplete: types.optional(types.boolean, false),
    shippingOptionComplete: types.optional(types.boolean, false),
    paymentInfoComplete: types.optional(types.boolean, false),
    consentComplete: types.optional(types.boolean, false),
    submitting: types.optional(types.boolean, false),

  })
  .actions(self => ({
    setTracker() {
      if (cookies.get('consignmentId')) {
        self.setShippingInfoComplete()
      }

      if (cookies.get('shippingOptionSet')) {
        self.setShippingOptionComplete()
      }

      if (cookies.get('stripeToken')) {
        self.setPaymentInfoComplete()
      }

      if (cookies.get('consentGiven')) {
        self.resetConsentComplete()
      }
    },

    setShippingInfoComplete() {
      self.shippingInfoComplete = true
      return self.nextStep()
    },

    setShippingOptionComplete() {
      self.shippingOptionComplete = true
      return self.nextStep()
    },

    setPaymentInfoComplete() {
      self.paymentInfoComplete = true
      return self.nextStep()
    },

    setSubmitting(boolean) {
      self.submitting = boolean
    },

    resetConsentComplete() {
      self.consentComplete = true
      return self.nextStep()
    },

    setConsentComplete: flow(function* setConsentComplete(firstName, lastName, email, legalID, legalHeader, legalMsg) {
      try {
        const response = yield window.fetch(
          `${getParent(self, 2).apiUrl}/checkouts/captureConsent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            // need to add body for updating address
            body: JSON.stringify({
              first_name: firstName,
              last_name: lastName,
              email,
              consentMessage: `${legalID} - ${legalHeader} ${legalMsg}`
            })
          }
        )
        let json = response;
        json = yield json.json();
        self.consentComplete = true
        cookies.set('consentGiven', { consentGiven: true }, { path: '/' });
        return self.nextStep()
      } catch (err) {
        console.log(err);
        return false
      }
    }),

    resetTracker() {
      const shop = getParent(self, 2);
      // reset shippingComplete to start at beginning of checkout flow
      self.shippingInfoComplete = false;

      // reset shippingOption info
      self.shippingOptionComplete = false;
      shop.shipping.resetSelectedShipping();
      cookies.remove('shippingOptionSet', { path: '/' });

      // reset payment info
      self.paymentInfoComplete = false;
      shop.checkout.billingInfo.resetBillingInfo()
      cookies.remove('sameAsBilling', { path: '/' });
      cookies.remove('stripeToken', { path: '/' });

      self.consentComplete = false;
      cookies.remove('consentGiven', { path: '/' });

      self.submitting = false
    },

    nextStep() {
      if (self.shippingInfoComplete && self.shippingOptionComplete && self.paymentInfoComplete && self.consentComplete) {
        // if all steps complete move to review order
        return '/review-order';
      }

      if (self.shippingInfoComplete && self.shippingOptionComplete && self.paymentInfoComplete) {
        // if all steps complete move to review order
        return '/terms-and-conditions';
      }

      if (self.shippingInfoComplete && self.shippingOptionComplete) {
        // if all up to payment, go to payment info page
        return '/billing';
      }
      // if all up to shipping method, go to shipping method
      return '/shipping';
    },
  }))
  .views(self => ({
    get trackerComplete() {
      if (self.shippingInfoComplete && self.shippingOptionComplete && self.paymentInfoComplete && self.consentComplete) {
        return true;
      }
      return false
    }

  }));

export default CheckoutStepTracker;
