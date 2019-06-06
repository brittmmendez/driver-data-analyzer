// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const ExchangePage = types.model({
  returnExchangeTitle: types.optional(types.string, ''),
  accepted: types.optional(types.boolean, false),
  returnExchangeDescription: types.optional(types.string, ''),
  exchangeSubtitle: types.optional(types.string, ''),
  exchangeDescription: types.optional(types.string, ''),
  returnSubtitle: types.optional(types.string, ''),
  returnDescription: types.optional(types.string, ''),
});

export default ExchangePage;
