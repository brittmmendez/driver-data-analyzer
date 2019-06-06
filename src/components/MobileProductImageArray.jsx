import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Slider from 'react-slick';
import { Image, Transformation } from 'cloudinary-react';

@inject('shop')
@observer
export default class MobileProductImageArray extends Component {
  static propTypes = {
    product: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    resetSlider: PropTypes.bool.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  componentWillUpdate(prevProps) {
    const { resetSlider, product } = this.props;
    if (resetSlider !== prevProps.resetSlider && product.images.length > 1) {
      this.slider.slickGoTo(0);
    }
  }

  render() {
    const { product } = this.props;

    if (product.images.slice().length > 0) {
      const images = product.images.slice();

      const settings = {
        dots: true,
        dotsClass: 'slick-dots slick-thumb',
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      };

      if (images && images.length > 0) {
        return (
          <div className="mobile-product-image-array">
            <Slider
              {...settings}
              ref={slider => {
                this.slider = slider;
              }}
            >
              {images.map(productImage => (
                <div key={productImage.id}>
                  <figure className="image img-centered mobile-product-feature-image">
                    <Image
                      publicId={productImage.zoom_url}
                      alt={product.name}
                      type="fetch"
                    >
                      <Transformation
                        quality="auto"
                        fetchFormat="auto"
                        dpr="auto"
                        responsive
                        crop="fill"
                        width="591"
                        height="591"
                      />
                    </Image>
                  </figure>
                </div>
              ))}
            </Slider>
          </div>
        );
      }
    }

    return (
      <div className="product-image-array">
        <div>
          <figure className="image img-centered product-feature-image">
            <Image
              publicId={product.thumbnail_url}
              alt="Product images not found"
              type="fetch"
            >
              <Transformation
                quality="auto"
                fetchFormat="auto"
                dpr="auto"
                responsive
                crop="scale"
                maxWidth="591"
              />
            </Image>
          </figure>
        </div>
      </div>
    );
  }
}
