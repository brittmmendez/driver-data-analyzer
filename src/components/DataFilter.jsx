import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('shop')
@observer
class DataFilter extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      name: '',
    };
  }

  handleClick(name) {
    const { isActive } = this.state
    this.setState({
      isActive: !isActive,
      name
    })
  }

  render() {
    const { shop } = this.props
    const { isActive, name } = this.state

    const sortedDrivers = shop.drivers.sort((a, b) => b.totalDistance - a.totalDistance)
    return (
      <div className="has-text-left">
        <table className="table">
          <thead>
            <tr>
              <th><abbr title="Position">#</abbr></th>
              <th>Name</th>
              <th>Total Trips</th>
              <th>Total Distance</th>
              <th>Total Time</th>
              <th>Avg Speed</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th><abbr title="Position">#</abbr></th>
              <th>Name</th>
              <th>Total Trips</th>
              <th>Total Distance</th>
              <th>Total Time</th>
              <th>Avg Speed</th>
            </tr>
          </tfoot>
          <tbody>
            {sortedDrivers.map((driver, idx) =>
              <tr>
                <th>{idx + 1}</th>
                <td>
                  <a
                    onClick={() => this.handleClick(driver.name)}>
                    {driver.name}
                  </a>
                </td>
                <td>{driver.totalTrips}</td>
                <td>{driver.totalDistance}</td>
                <td>{driver.totalTime}</td>
                <td>{Math.round(driver.avgMPH)}</td>


                <div className={`modal ${isActive && driver.name === name && "is-active"}`}>
                  <div className="modal-background" onClick={() => this.handleClick()} />
                  <div className="modal-card">
                    <header className="modal-card-head">
                      <p className="modal-card-title">{driver.name}</p>
                      <button className="delete" aria-label="close" onClick={() => this.handleClick()} />
                    </header>
                    <section className="modal-card-body">
                      <table className="table">
                        <thead>
                          <tr>
                            <th><abbr title="Position">#</abbr></th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Distance</th>
                            <th>Duration</th>
                          </tr>
                        </thead>
                        {driver.trips.map((trip, i) =>
                          <tbody>
                            <td>{i + 1}</td>
                            <td>{trip.start_time}</td>
                            <td>{trip.stop_time}</td>
                            <td>{trip.distance} miles</td>
                            <td>{trip.convertTime} min</td>
                          </tbody>
                        )}
                      </table>
                    </section>
                  </div>
                </div>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default DataFilter;
