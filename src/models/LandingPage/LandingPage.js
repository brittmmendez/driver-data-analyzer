// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
import { types } from 'mobx-state-tree';
import Spotlight from './Spotlight';
import SpotlightStat from './SpotlightStat';
import FAQCallout from './FAQCallout';
import SpotlightSolution from './SpotlightSolution';
import ProductBenefitGroup from './ProductBenefitGroup';
import CustomerSupport from './CustomerSupport';
import ProductGroupingGroup from './ProductGroupingGroup';

const LandingPage = types.model({
  spotlight: types.optional(Spotlight, {}),
  spotlightStat: types.optional(SpotlightStat, {}),
  spotlightSolution: types.optional(SpotlightSolution, {}),
  faqCallout: types.optional(FAQCallout, {}),
  productBenefitGroup: types.optional(ProductBenefitGroup, {}),
  productGroupingGroup: types.optional(ProductGroupingGroup, {}),
  customerSupport: types.optional(CustomerSupport, {}),
});
export default LandingPage;
