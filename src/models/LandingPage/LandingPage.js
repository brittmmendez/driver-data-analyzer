// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
import { types } from 'mobx-state-tree';
import Spotlight from './Spotlight';
import SpotlightStat from './SpotlightStat';
import MediaCarousel from './MediaCarousel';
import FAQCallout from './FAQCallout';
import SpotlightSolution from './SpotlightSolution';
import EngagementGroup from './EngagementGroup';
import ProductBenefitGroup from './ProductBenefitGroup';
import SocialProofGroup from './SocialProofGroup';
import CustomerSupport from './CustomerSupport';

const LandingPage = types.model({
  spotlight: types.optional(Spotlight, {}),
  spotlightStat: types.optional(SpotlightStat, {}),
  mediaCarousel: types.optional(MediaCarousel, {}),
  spotlightSolution: types.optional(SpotlightSolution, {}),
  faqCallout: types.optional(FAQCallout, {}),
  engagementGroup: types.optional(EngagementGroup, {}),
  productBenefitGroup: types.optional(ProductBenefitGroup, {}),
  socialProofGroup: types.optional(SocialProofGroup, {}),
  customerSupport: types.optional(CustomerSupport, {}),
});
export default LandingPage;
