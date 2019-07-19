// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
import { types, flow, getParent } from 'mobx-state-tree';
import { createClient } from 'contentful';

const client = createClient({
  space: 'dx8s2zoelme1',
  environment: 'master',
  accessToken: 'KCQnkUO_GlTpBvcDKwGpI-QRWwCZXQ7hXji2VUG9Zpw',
  // This will have Contentful resolve image asset urls in the entry call, instead of requiring a seperate API call.
  resolveLinks: true
});

const Contentful = types
  .model({
    imagePlaceholder: types.optional(types.string, ''),
    upliftLogo: types.optional(types.string, ''),
    error404: types.optional(types.string, ''),
    errorCantFindProduct: types.optional(types.string, ''),
    errorCantLoad: types.optional(types.string, ''),
    errorCantPlaceOrder: types.optional(types.string, ''),
    errorCantShowConf: types.optional(types.string, ''),
    emptyCartImg: types.optional(types.string, ''),
    pdpBackgroundLinesLeft: types.optional(types.string, ''),
    pdpBackgroundLinesRight: types.optional(types.string, '')
  })
  .actions(self => ({
    getContent() {
      self.getLandingPageContent();
      self.getPDPdetailsGroup();
      self.getImgs();
      self.getConsetCopy();
      self.getUpliftLogo();
      // self.getAboutPageContent();
      // self.getOurStorySpotlight();
    },

    getLandingPageContent() {
      self.getSpotlightEntry();
      self.getSpotlightStatEntry();
      self.getSpotlightSolution();
      self.getBenefitsEntry();
      self.getFAQCallout();
      self.getProductGroupingEntry();
      self.getSupportEntry();
      self.getSignup();
    },

    getImgs: flow(function* getImgs() {
      const error404 = yield client.getEntry('lmmO7TeFdjaZXZHKrJWKD');
      const errorCantFindProduct = yield client.getEntry(
        '4Hcb6U1LwXGqvMERyGmwK8'
      );
      const errorCantLoad = yield client.getEntry('6mBh1Yw2CIGx5lbglCVr8V');
      const errorCantPlaceOrder = yield client.getEntry(
        '4RpzMdcQeeolnoP7TSFxyH'
      );
      const errorCantShowConf = yield client.getEntry('6w7CDyK5lx5GcZg2sagZo0');
      const emptyCartImg = yield client.getEntry('7Fq13EEpl1GHDswStlKi1u');
      const pdpBackgroundLinesLeft = yield client.getEntry(
        '4caCJzKtaX4e4PRx5VwpqA'
      );
      const pdpBackgroundLinesRight = yield client.getEntry(
        '7M4FmAm0j6C7rPHbHR27ns'
      );

      // eslint-disable-next-line
      self.error404 = `https:${error404.fields.image.fields.file.url}`;
      // eslint-disable-next-line
      self.errorCantFindProduct = `https:${
        errorCantFindProduct.fields.image.fields.file.url
      }`;
      // eslint-disable-next-line
      self.errorCantLoad = `https:${
        errorCantLoad.fields.image.fields.file.url
      }`;
      // eslint-disable-next-line
      self.errorCantPlaceOrder = `https:${
        errorCantPlaceOrder.fields.image.fields.file.url
      }`;
      // eslint-disable-next-line
      self.errorCantShowConf = `https:${
        errorCantShowConf.fields.image.fields.file.url
      }`;
      // eslint-disable-next-line
      self.emptyCartImg = `https:${emptyCartImg.fields.image.fields.file.url}`;
      // eslint-disable-next-line
      self.pdpBackgroundLinesLeft = `https:${
        pdpBackgroundLinesLeft.fields.image.fields.file.url
      }`;
      // eslint-disable-next-line
      self.pdpBackgroundLinesRight = `https:${
        pdpBackgroundLinesRight.fields.image.fields.file.url
      }`;
    }),

    getUpliftLogo: flow(function* getUpliftLogo() {
      const logo = yield client.getEntry('6oSCAj0KP3wnrSs6aYkBv4');
      // eslint-disable-next-line
      self.upliftLogo = `https:${logo.fields.image.fields.file.url}`;
    }),

    getProductGroupingEntry: flow(function* getProductGroupingEntry() {
      const group = yield client.getEntries({
        content_type: 'productGroupingGroup'
      });

      getParent(self, 1).landingPage.productGroupingGroup.setProductGroups(
        group
      );
    }),

    getSpotlightEntry: flow(function* getSpotlightEntry() {
      const spotlight = yield client.getEntry('4Ln3wJQacoEcqSqMI4EOu4');

      getParent(self, 1).landingPage.spotlight.setSpotlight(spotlight);
    }),

    getSpotlightStatEntry: flow(function* getSpotlightStatEntry() {
      const spotlight = yield client.getEntry('61AVM4AwYyYDbGR8EuGYLS');

      getParent(self, 1).landingPage.spotlightStat.setSpotlight(spotlight);
    }),

    getSpotlightSolution: flow(function* getSpotlightSolution() {
      const spotlight = yield client.getEntry('1QrUBOahikrNUuOrUFuFXD');

      getParent(self, 1).landingPage.spotlightSolution.setSpotlight(spotlight);
    }),

    getFAQCallout: flow(function* getFAQCallout() {
      const spotlight = yield client.getEntry('5imVMmGYxTbgPnYiA1KC83');

      getParent(self, 1).landingPage.faqCallout.setSpotlight(spotlight);
    }),

    getBenefitsEntry: flow(function* getBenefitsEntry() {
      const benefit = yield client.getEntries({
        content_type: 'productBenefitGroup'
      });
      getParent(self, 1).landingPage.productBenefitGroup.setBenefits(benefit);
    }),

    getSupportEntry: flow(function* getSupportEntry() {
      const support = yield client.getEntries({
        content_type: 'customerSupport'
      });
      getParent(self, 1).landingPage.customerSupport.setCustomerSupport(
        support
      );
    }),

    getSignup: flow(function* getSignup() {
      const signup = yield client.getEntry('1HN0SBHwPbb2TCataeQre1');

      getParent(self, 1).crmSignup.setSignup(signup);
    }),

    getFAQEntryGroup: flow(function* getFAQEntryGroup() {
      const FAQEntryGroup = yield client.getEntries({
        content_type: 'faqEntryGroup',
        include: 2
      });
      getParent(self, 1).setFAQgroup(FAQEntryGroup);
    }),

    getAboutPageContent() {
      self.getBrandSpotlight();
      self.getBrandTeam();
      self.getParentCompany();
    },

    getBrandSpotlight: flow(function* getBrandSpotlight() {
      const brandSpotlight = yield client.getEntries({
        content_type: 'aboutUsTagline'
      });
      getParent(self, 1).aboutPage.brandSpotlight.setBrandSpotlight(
        brandSpotlight
      );
    }),

    getBrandTeam: flow(function* getBrandTeam() {
      const brandTeam = yield client.getEntries({
        content_type: 'aboutUsSummary'
      });
      getParent(self, 1).aboutPage.brandTeam.setBrandTeam(brandTeam);
    }),

    getParentCompany: flow(function* getParentCompany() {
      const parentCompany = yield client.getEntries({
        content_type: 'aboutUsDetailedInfo'
      });
      getParent(self, 1).aboutPage.parentCompany.setParentCompany(
        parentCompany
      );
    }),

    getPDPdetailsGroup: flow(function* getPDPdetailsGroup() {
      const productDetailsGroup = yield client.getEntries({
        content_type: 'productDetailsGroup'
      });
      getParent(self, 1).products.setProductDetailsArray(productDetailsGroup);
    }),

    getExchangePageContent: flow(function* getExchangePageContent() {
      const returnExchangeGroup = yield client.getEntries({
        content_type: 'returnExchangeGroup'
      });
      getParent(self, 1).setReturnExchangeGroup(
        returnExchangeGroup.items[0].fields
      );
    }),

    getConsetCopy: flow(function* getConsetCopy() {
      const consentCopy = yield client.getEntry('4y35gGLXkwmM3kIaye1fMo');
      getParent(self, 1).setconsentCopy(consentCopy.fields);
    })
  }));

export default Contentful;
