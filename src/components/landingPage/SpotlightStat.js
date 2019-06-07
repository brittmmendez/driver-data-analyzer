import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
// import { Image, Transformation } from 'cloudinary-react';
import LazyLoad from 'react-lazyload';

@inject('shop')
@observer
class SpotlightStat extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: {
        landingPage: { spotlightStat }
      }
    } = this.props;
    return (
      <LazyLoad height={200}>
        <div className="spotlight-stat" style={{ backgroundImage: `url(${spotlightStat.spotlightProductMediaFile})` }}>
          <section className="section">
            <div className="columns reverse-column-order content">
              <div className="column" />
              <div className="column has-text-left">
                <div className="spotlight-msg">
                  <h1>{spotlightStat.spotlightProductTitle}</h1>
                  <p className="has-text-left">
                    {spotlightStat.spotlightProductMessaging}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </LazyLoad>
    );
  }
}

export default SpotlightStat;
