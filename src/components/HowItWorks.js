import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Image, Transformation } from 'cloudinary-react';
import { HashLink as Link } from 'react-router-hash-link';

@inject('shop')
@observer
class HowItWorks extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: { howItWorks }
    } = this.props;
    return (
      <div className="how-it-works">
        <section className="section">
          <div className="container content">
            <div className="columns reverse-column-order">
              <div className="column has-text-left has-text-centered-mobile">
                <h1 className="how-it-works-title has-text-white">{howItWorks.title}</h1>
                <p className="how-it-works-description has-text-white">{howItWorks.body}</p>
                <Link to={howItWorks.btnUrl}>
                  <button type="button" aria-label="shop" className="primary-btn how-it-works-btn"> {howItWorks.btnText}</button>
                </Link>
              </div>
              <div className="column has-text-right has-text-centered-mobile">
                <Image
                  publicId={howItWorks.productMediaFile}
                  alt={howItWorks.productMediaText}
                  className="how-it-works-img"
                  type="fetch"
                >
                  <Transformation
                    quality="auto"
                    fetchFormat="auto"
                    dpr="auto"
                    responsive
                    crop="scale"
                    width="390"
                    height="241"
                  />
                </Image>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default HowItWorks;
