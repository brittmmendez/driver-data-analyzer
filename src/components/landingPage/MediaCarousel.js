import React, { Component } from 'react';
import Slider from 'react-slick';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { HashLink as Link } from 'react-router-hash-link';
import LazyLoad from 'react-lazyload';
import { Image, Transformation } from 'cloudinary-react';

@inject('shop')
@observer
class MediaCarousel extends Component {
  // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: {
        landingPage: { mediaCarousel, faqCallout }
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
      <div key={key}>
        <div className=" has-text-centered">
          <Image
            publicId={proof.socialProofMediaFile}
            alt={proof.socialProofMediaFile}
            className="social-img"
            type="fetch"
          >
            <Transformation
              quality="auto"
              dpr="auto"
              fetchFormat="auto"
              responsive
              crop="scale"
              width="550"
            />
          </Image>
          {/* <img src={proof.socialProofMediaFile}
            alt={proof.socialProofMediaTitle}
            className="social-img" /> */}
        </div>
      </div>
    );

    return (
      <section className="section media-carousel">
        {/* <div className="placeholder-left is-hidden-touch" />
        <div className="placeholder-right is-hidden-touch" /> */}
        <div className="content has-text-centered">
          <h1 className="has-text-centered title">
            {mediaCarousel.socialProofGroupTitle}
          </h1>
          <LazyLoad height={200}>
            <Slider {...settings}>
              {mediaCarousel.media.map((proof) => (
                <ProofComponent proof={proof} key={proof.socialProofMediaFile} />
              ))}
            </Slider>
          </LazyLoad>
          <div className="group-message">
            <Markdown source={mediaCarousel.socialProofGroupMessage} />
          </div>
          <Link
            className="primary-btn button"
            to={`${faqCallout.spotlightProductCtaButtonRelativeURL}#top`}
          >
            {faqCallout.spotlightProductCtaButtonText}
          </Link>
        </div>
      </section>
    );
  }
}

export default MediaCarousel;
