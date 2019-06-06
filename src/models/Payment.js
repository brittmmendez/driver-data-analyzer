// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable no-debugger */
import { types } from 'mobx-state-tree';
import visa from '../static/images/creditCards/visa.png';
import mastercard from '../static/images/creditCards/mastercard.png';
import discover from '../static/images/creditCards/discover.png';
import amex from '../static/images/creditCards/amex.png';

const Payment = types
  .model({
    charge_id: types.optional(types.string, ''),
    cardName: types.optional(types.string, ''),
    brand: types.optional(types.string, ''),
    last4: types.optional(types.string, ''),
    img: types.optional(types.string, 'unknown'),
    cardNumComplete: types.optional(types.boolean, false),
    cardExpComplete: types.optional(types.boolean, false),
    cardCVCComplete: types.optional(types.boolean, false),
    paymentError: types.optional(types.boolean, false)
  })
  .views(self => ({
    get creditCardReady() {
      return (
        self.cardNumComplete &&
        self.cardExpComplete &&
        self.cardCVCComplete &&
        self.cardName !== ''
      );
    },

    getCardIcon(brand) {
      switch (brand) {
        case 'visa':
          return visa;
        case 'mastercard':
          return mastercard;
        case 'discover':
          return discover;
        case 'american express':
          return amex;
        default:
          return amex;
      }
    }
  }))
  .actions(self => ({
    createPaymentModel(options) {
      self.charge_id = options.id;
      self.brand = options.card.brand;
      self.last4 = options.card.last4;
      self.cardName = options.card.name;
      self.creditCardComplete = true;
      self.cardNumComplete = true;
      self.cardExpComplete = true;
      self.cardCVCComplete = true;
      self.setImg(options.card.brand.toLowerCase());
    },

    createOrderLookUpPaymentModel(options) {
      self.brand = options.card_brand;
      self.last4 = options.card_last_4;
      self.creditCardComplete = true;
      self.setImg(options.card_brand.toLowerCase());
    },

    resetPayment() {
      self.charge_id = '';
      self.brand = '';
      self.last4 = '';
      self.cardName = '';
      self.creditCardComplete = false;
      self.cardNumComplete = false;
      self.cardExpComplete = false;
      self.cardCVCComplete = false;
      self.img = 'unknown';
    },

    setname(name) {
      self.cardName = name;
    },

    setImg(brand) {
      self.img = brand;
    },

    setCardNum(status) {
      self.cardNumComplete = status;
    },

    setcardExp(status) {
      self.cardExpComplete = status;
    },

    setcardCVC(status) {
      self.cardCVCComplete = status;
    }
  }));

export default Payment;
