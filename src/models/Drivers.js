// // MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';
import Trips from './Trips';

const Drivers = types
  .model({
    name: types.optional(types.string, ''),
    trips: types.optional(types.array(Trips), []),
  })
  .views(self => ({
    get totalTrips() {
      return self.trips.length
    },

    get totalDistance() {
      let miles = 0;
      self.trips.forEach(trip => {
        miles += trip.distance;
      })
      return Math.round(miles)
    },

    get totalTime() {
      let time = 0

      self.trips.forEach(trip => {
        time += trip.convertTime
      })

      return time
    },

    get avgMPH() {
      return self.totalDistance / (self.totalTime / 60) || 0
    },
  }));

export default Drivers;
