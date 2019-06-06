// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
import { types } from 'mobx-state-tree';
import BrandSpotlight from './BrandSpotlight';
import BrandTeam from './BrandTeam';
import ParentCompany from './ParentCompany';

const AboutPage = types.model({
  brandSpotlight: types.optional(BrandSpotlight, {}),
  brandTeam: types.optional(BrandTeam, {}),
  parentCompany: types.optional(ParentCompany, {}),
});
export default AboutPage;
