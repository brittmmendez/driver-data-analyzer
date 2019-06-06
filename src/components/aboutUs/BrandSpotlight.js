import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Image, Transformation } from 'cloudinary-react';

@inject('shop')
@observer
class BrandSpotlight extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: {
        aboutPage: { brandSpotlight }
      }
    } = this.props;
    return (
      <div className="brand-spotlight">
        <div className="columns">
          <div className="column has-text-left">
            <p className="about-title">{brandSpotlight.title}</p>
            <p className="section-title">
              {brandSpotlight.subTitle}
            </p>

            <p>
              {brandSpotlight.body}
            </p>
          </div>
          <div className="column has-text-right has-text-centered-mobile">
            <Image
              publicId={brandSpotlight.spotlightProductMediaFile}
              alt={brandSpotlight.spotlightProductMediaText}
              className="spotlight-img"
              type="fetch"
            >
              <Transformation quality="auto" fetchFormat="auto" dpr="auto"
                responsive crop="scale"
                width="390"
                height="241" />
            </Image>
          </div>
        </div>
      </div>
    );
  }
}

export default BrandSpotlight;
