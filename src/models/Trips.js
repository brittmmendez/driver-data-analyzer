// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';

const Trips = types
  .model({
    start_time: types.optional(types.string, ''),
    stop_time: types.optional(types.string, ''),
    distance: types.optional(types.number, 0),
  })
  .views(self => ({
    get convertTime() {
      const startHr = self.start_time.split(":")[0]
      const startMin = self.start_time.split(":")[1]
      const stopHr = self.stop_time.split(":")[0]
      const stopMin = self.stop_time.split(":")[1]
      const TotalMinutes = ((stopHr - startHr) * 60) + (stopMin - startMin)
      return TotalMinutes
    }
  }));

export default Trips;
