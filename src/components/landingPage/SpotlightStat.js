import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Image, Transformation } from 'cloudinary-react';
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
        <div
          className="spotlight-stat"
          // style={{
          //   backgroundImage: `url(${spotlightStat.spotlightProductMediaFile})`
          // }}
        >
          <section className="section">
            <div className="content">
              <div className="has-text-center">
                <div className="columns">
                  <div className="column-is-6 img">
                    <Image
                      publicId={spotlightStat.spotlightProductMediaFile}
                      //alt={benefit.productBenefitMediaTitle}
                      type="fetch"
                    >
                      <Transformation
                        quality="auto"
                        fetchFormat="auto"
                        dpr="auto"
                        responsive
                        crop="scale"
                        width="325"
                      />
                    </Image>
                  </div>
                  <div className="column-is-6">
                    <div className="spotlight-msg">
                      <h3>{spotlightStat.spotlightProductTitle}</h3>
                      <p className="has-text-left">
                        {spotlightStat.spotlightProductMessaging}
                      </p>
                    </div>
                  </div>
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
