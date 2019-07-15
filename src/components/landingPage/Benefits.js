import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { HashLink as Link } from 'react-router-hash-link';
import { Image, Transformation } from 'cloudinary-react';
import LazyLoad from 'react-lazyload';

@inject('shop')
@observer
class Benefits extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: {
        landingPage: { productBenefitGroup }
      }
    } = this.props;
    return (
      <section className="section benefits">
        <div className="content has-text-centered">
          <h1 className="has-text-centered title">
            {' '}
            {productBenefitGroup.productBenefitGroupTitle}{' '}
          </h1>
          <LazyLoad height={200}>
            <div className="columns">
              {productBenefitGroup.benefits.map(benefit => (
                <div key={benefit.productBenefitMediaTitle} className="column">
                  <Image
                    publicId={benefit.productBenefitMediaFile}
                    alt={benefit.productBenefitMediaTitle}
                    type="fetch"
                  >
                    <Transformation
                      quality="auto"
                      fetchFormat="auto"
                      dpr="auto"
                      responsive
                      crop="scale"
                      height="100"
                    />
                  </Image>
                  <h3>{benefit.productBenefitTitle}</h3>
                  <h4 className="has-text-left">
                    {benefit.productBenefitCopy}
                  </h4>
                </div>
              ))}
            </div>
          </LazyLoad>
          {/* <Link
            className="button primary-btn cont-shopping"
            to={productBenefitGroup.ctaURL}
          >
            <span>{productBenefitGroup.ctaText}</span>
          </Link> */}
        </div>
      </section>
    );
  }
}

export default Benefits;
