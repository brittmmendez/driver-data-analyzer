// MobX-State-Tree uses reassignment to self. Disable that rule for model files
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { types } from 'mobx-state-tree';
import Drivers from './Drivers';

const Shop = types
  .model({
    drivers: types.optional(types.array(Drivers), []),
  })
  .actions(self => ({
    analyzeData(contentArray) {
      contentArray.forEach(content => {

        const action = content.split(' ')
        const driver = self.drivers.find(d => d.name === action[1])

        // if the action is a Driver and Driver isn't already created -> create Driver
        if (action[0] === "Driver" && !driver) {
          self.addDriver(action)
        }

        // if the action is a Trip -> validate and create the Trip
        if (action[0] === "Trip") {
          // if minimum 5mph speed met add it to the cart
          this.validateTrip(action) && self.addTrip(driver, action)
        }

      })
    },

    addDriver(action) {
      self.drivers.push({
        name: action[1]
      })
    },

    addTrip(driver, action) {
      // if driver found push this trip into their trips array
      const trip = {
        start_time: action[2],
        stop_time: action[3],
        distance: parseFloat(action[4])
      }

      if (driver) {
        driver.trips.push(trip)
      } else {
        // if driver not found - create the driver and then add the trip
        self.drivers.push({
          name: action[1],
          trips: [trip]
        })
      }
    },

    validateTrip(action) {
      // if trip speed is between 5mph and 100mph return true
      const startHr = action[2].split(":")[0]
      const startMin = action[2].split(":")[1]
      const stopHr = action[3].split(":")[0]
      const stopMin = action[3].split(":")[1]
      const TotalMinutes = ((stopHr - startHr) * 60) + (stopMin - startMin)
      const totalDuration = action[4]
      const mph = totalDuration / (TotalMinutes / 60)
      return mph >= 5 && mph <= 100
    }
  }));
export default Shop;
