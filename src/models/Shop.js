// MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types, flow } from 'mobx-state-tree';
import fuzzysearch from 'fuzzysearch';
import { Cookies } from 'react-cookie';
import User from './User';
import Checkout from './Checkout';
import Products from './Products';
import Cart from './Cart';
import Shipping from './Shipping';
import ExchangePage from './ExchangePage';
import ConsentCopy from './ConsentCopy';
import Payment from './Payment';
import Contentful from './Contentful';
import LandingPage from './LandingPage/LandingPage';
import AboutPage from './AboutPage/AboutPage';
import FAQEntryGroup from './FAQpage/FAQEntryGroup';
import HowItWorks from './HowItWorks';
import CRMsignup from './CRMsignup'


const cookies = new Cookies();

const Shop = types
  .model({
    contentful: types.optional(Contentful, {}),
    appError: types.optional(types.boolean, false),
    placingOrderError: types.optional(types.boolean, false),
    landingPage: types.optional(LandingPage, {}),
    FAQEntryGroup: types.optional(FAQEntryGroup, {}),
    aboutPage: types.optional(AboutPage, {}),
    exchangePage: types.optional(ExchangePage, {}),
    user: types.optional(User, {}),
    checkout: types.optional(Checkout, {}),
    payment: types.optional(Payment, {}),
    products: types.optional(Products, { data: [] }),
    consentCopy: types.optional(ConsentCopy, {}),
    imagePlaceholder: types.optional(types.string, ''),
    howItWorks: types.optional(HowItWorks, {}),
    searchProducts: types.optional(Products, { data: [] }),
    shipping: types.optional(Shipping, { shipping_rates: [] }),
    cart: types.optional(Cart, {}),
    crmSignup: types.optional(CRMsignup, {}),
    apiUrl: process.env.REACT_APP_API_URL,
    cloudinaryId: process.env.REACT_APP_CLOUDINARYID,
    stripeAPIkey: process.env.REACT_APP_STRIPE_APIKEY,
  })
  .actions(self => ({

    setFAQgroup(faqEntryGroup) {
      self.FAQEntryGroup.title =
        faqEntryGroup.items[0].fields.faqEntryGroupTitle;
      self.FAQEntryGroup.FAQEntry = faqEntryGroup.items[0].fields.faqEntry.map(
        entry => ({
          entryTitle: entry.fields.entryTitle,
          FAQqa: entry.fields.faqQuestionAnswer.map(QnA => ({
            FAQQuestion: QnA.fields.faqQuestion,
            FAQAnswer: QnA.fields.faqAnswer
          }))
        })
      );
    },

    setconsentCopy(consentCopy) {
      self.consentCopy.title = consentCopy.title
      self.consentCopy.consentCopy = consentCopy.consentCopy
      self.consentCopy.consentProductsPage = consentCopy.consentProductsPage
      self.consentCopy.checkoutConsentFormDescription = consentCopy.checkoutConsentFormDescription
      self.consentCopy.consentFormTitle = consentCopy.consentFormTitle
      self.consentCopy.consentLegalNumber = consentCopy.legalNumber
      self.consentCopy.consentFormSubHeader = consentCopy.consentFormSubHeader
      self.consentCopy.consentFormBody = consentCopy.consentFormBody
      self.consentCopy.consetnAgreeOption = consentCopy.consetnAgreeOption
    },

    // initial fetch from BigC
    getProducts: flow(function* getProducts() {
      if (self.products.productCount === 0) {
        try {
          const response = yield fetch(`${self.apiUrl}/products/category/27`);
          const json = yield response.json();
          self.products.data = json;
        } catch (err) {
          self.products.loadingProductsError = true
          console.log(err);
        }
      }
      self.checkCookies();
      return true;
    }),

    setReturnExchangeGroup(returnExchangeGroup) {
      self.exchangePage.returnExchangeTitle =
        returnExchangeGroup.returnsExchanges;
      self.exchangePage.accepted = returnExchangeGroup.returnExchangeAccepted;
      self.exchangePage.returnExchangeDescription =
        returnExchangeGroup.returnPolicy.fields.returnExchangeDescription;
      self.exchangePage.exchangeSubtitle =
        returnExchangeGroup.returnPolicy.fields.exchangeSubtitle;
      self.exchangePage.exchangeDescription =
        returnExchangeGroup.returnPolicy.fields.exchangeDescription;
      self.exchangePage.returnSubtitle =
        returnExchangeGroup.returnPolicy.fields.returnSubtitle;
      self.exchangePage.returnDescription =
        returnExchangeGroup.returnPolicy.fields.returnDescription;
    },

    // Check for cart cookie
    checkCookies() {
      const cartCookie = cookies.get('cart');
      const userCookie = cookies.get('user');
      // if there is a cart cookie
      if (cartCookie) {
        // get the cart from BigC and add items in cart back to line items
        self.cart.getBigCcart(cartCookie.id);
        self.checkout.setCheckoutId(cartCookie.id);
      } else {
        self.cart.clearCart();
      }
      if (userCookie) {
        self.user.id = parseInt(userCookie.id, 10);
        self.user.token = userCookie.token;
        self.user.loggedIn = true;
      }
    },

    // might not need this since true shipping options come back in consignment post req.
    getShipping: flow(function* getShipping() {
      const response = yield fetch(`${self.apiUrl}/information/shipping`);
      const json = yield response.json();
      self.shipping.shipping_rates = json;
      if (self.shipping.shipping_rates.length) {
        self.cart.setShipping(self.shipping.shipping_rates[0].rate);
      }
    }),

    placeOrder: flow(function* placeOrder() {
      try {
        // process payment
        const response = yield fetch(`${self.apiUrl}/charge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            token: self.payment.charge_id,
            amount: self.cart.cart_amount,
            currency: 'usd',
            description: 'Uplift'
          })
        });
        let json = response;
        json = yield json.json();

        if (json.captured) {
          // if thats a success -> process order
          // store transactionID in MST so that we can pass it into initial GetOrderSummary call for BigC
          self.payment.charge_id = json.id;
          self.payment.paymentError = false;
          self.checkout.orderConfirmation.securedConfirmation = true;
          return self.processBigCOrder();
        }
      } catch (err) {
        console.log(err);
        self.payment.paymentError = true;
        return { status: false, issue: "payment" }
      }
      return { status: true };
    }),

    processBigCOrder: flow(function* processBigCorder() {
      try {
        // (CORS) error run in terminal:
        // open /Applications/Google\ Chrome.app --args --disable-web-security --user-data-dir
        const response = yield fetch(
          `${self.apiUrl}/checkouts/${self.cart.id}/orders`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            }
          }
        );
        let json = response;
        json = yield json.json();
        // clears cart if request is successful
        self.cart.deleteBigCcart(self.cart.id);
        // return the orderId to the handlePlaceOrder function
        self.checkout.orderConfirmation.securedConfirmation = true;
        self.checkout.orderConfirmation.getOrderSummary(json.order_id);
        self.placingOrderError = false
        return { status: true };
      } catch (err) {
        console.log(err);
        self.placingOrderError = true
        return { status: false, issue: "BigC" };
      }
    }),

    productSearch(searchTerm) {
      const productsFound = self.products.data.filter(p =>
        fuzzysearch(searchTerm.toLowerCase(), p.name.toLowerCase())
      );
      return productsFound;
    },

    // MobX State Tree Lifecycle methods
    afterCreate() {
      self.load();
    },

    load() {
      self.getProducts();
      self.contentful.getContent();
      self.checkout.checkoutStepTracker.setTracker();
    },

    reload() {
      self.load();
    }
  }));
export default Shop;
