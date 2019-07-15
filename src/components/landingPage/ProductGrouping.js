import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Image, Transformation } from 'cloudinary-react';
import LazyLoad from 'react-lazyload';
import { HashLink as Link } from 'react-router-hash-link';

@inject('shop')
@observer
class ProductGrouping extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: {
        landingPage: { productGroupingGroup }
      }
    } = this.props;
    const product1 = productGroupingGroup.productGroups[0];
    const product2 = productGroupingGroup.productGroups[1];
    const product3 = productGroupingGroup.productGroups[2];

    return (
      productGroupingGroup.productGroups.length && (
        <div className="content has-text-centered">
          {/* <h2 className="extra-padding-bottom">
            {' '}
            {productGroupingGroup.productGroupingGroupTitle}
          </h2> */}
          <section className="section product-grouping">
            <div className="columns double-img">
              <div className="column">
                <div>
                  <LazyLoad height={200}>
                    <Image
                      publicId={product1.productGroupMediaFile}
                      alt={product1.productGroupMediaTitle}
                      className="product-img"
                      type="fetch"
                    >
                      <Transformation
                        quality="auto"
                        dpr="auto"
                        fetchFormat="auto"
                        responsive
                        height="440"
                      />
                    </Image>
                  </LazyLoad>
                </div>
                <Link
                  className="primary-btn button"
                  to={product1.productGroupRelativeUrl}
                >
                  <span> {product1.productGroupTitle} </span>
                </Link>
              </div>
              <div className="column">
                <div>
                  <LazyLoad height={200}>
                    <Image
                      publicId={product2.productGroupMediaFile}
                      alt={product2.productGroupMediaTitle}
                      className="product-img"
                      type="fetch"
                    >
                      <Transformation
                        quality="auto"
                        dpr="auto"
                        fetchFormat="auto"
                        responsive
                        height="440"
                      />
                    </Image>
                  </LazyLoad>
                </div>
                <Link
                  className="primary-btn button"
                  to={product2.productGroupRelativeUrl}
                >
                  <span> {product2.productGroupTitle} </span>
                </Link>
              </div>
            </div>
            <div className="column">
              <div className="single-img">
                <LazyLoad height={200}>
                  <Image
                    publicId={product3.productGroupMediaFile}
                    alt={product3.productGroupMediaTitle}
                    className="full-width-product-img"
                    type="fetch"
                  >
                    <Transformation
                      quality="auto"
                      dpr="auto"
                      fetchFormat="auto"
                      responsive
                      height="364"
                      crop="scale"
                    />
                  </Image>
                </LazyLoad>
              </div>
              <Link
                className="primary-btn button"
                to={product3.productGroupRelativeUrl}
              >
                <span> {product3.productGroupTitle} </span>
              </Link>
            </div>
          </section>
        </div>
      )
    );
  }
}

export default ProductGrouping;
