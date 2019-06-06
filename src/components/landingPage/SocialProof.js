import React, { Component } from 'react';
import Slider from 'react-slick';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('shop')
@observer
class SocialProof extends Component {
  // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: {
        landingPage: { socialProofGroup }
      }
    } = this.props;

    const settings = {
      dots: true,
      dotsClass: 'slick-dots slick-thumb product-thumbs',
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    const ProofComponent = ({ proof, key }) => (
      <div key={key} className="columns">
        <div className="column has-text-left">
          <div className="social-msg">
            <h3 className="has-text-white">{proof.socialProofCopy}</h3>
            <p className="has-text-white has-text-weight-bold">
              {' '}
              {proof.socialProofUser}{' '}
            </p>
          </div>
        </div>
      </div>
    );

    return (
      <section
        className="section social-proof"
        style={{
          backgroundImage: `url(${socialProofGroup.socialProofBackgroundImage})`
        }}
      >
        <div className="content has-text-centered">
          <h1 className="has-text-centered title has-text-white">
            {socialProofGroup.socialProofGroupTitle}
          </h1>
          <Slider {...settings}>
            {socialProofGroup.socialProofs.map(proof => (
              <ProofComponent proof={proof} key={proof.socialProofUser} />
            ))}
          </Slider>
        </div>
      </section>
    );
  }
}

export default SocialProof;
