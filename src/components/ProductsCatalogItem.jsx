import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { HashLink as Link } from 'react-router-hash-link';
import PropTypes from 'prop-types';
import { Image, Transformation } from 'cloudinary-react';
import StarRatings from 'react-star-ratings';

@inject('shop')
@observer
class ProductsCatalogItem extends Component {
  static propTypes = {
    product: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const { product } = this.props;
    return (
      <div className="product-catalog-item column is-one-third-desktop is-one-third-tablet is-half-mobile event_view_product_detail_page">
        <div className="box">
          <Link
            data-cy="catalog-item"
            key={product.id}
            to={`/products-page/${product.id}#top`}
          >
            <Image
              className="product-image"
              publicId={product.thumbnail_url}
              alt={product.name}
              type="fetch"
            >
              <Transformation
                quality="auto"
                fetchFormat="auto"
                dpr="auto"
                responsive
                width="226"
                // height="205"
                crop="crop"
              />
            </Image>
            <div className="has-text-left">
              <div className="product-options">
                {product.options.length > 0 ? (
                  <span>
                    <span className="is-hidden-mobile">
                      More Options Available
                    </span>
                    <span className="is-hidden-tablet">More Options</span>
                  </span>
                ) : (
                  <br />
                )}
              </div>

              <h4 className="product-name is-marginless">{product.name}</h4>

              <div className="columns product-details">
                <div className="pricing column">
                  {product.sale_price === 0 ? (
                    <p className="">${product.price.toFixed(2)}</p>
                  ) : (
                    <div>
                      <s>${product.price.toFixed(2)}</s>
                      <span className="has-text-weight-bold">
                        {'  '}${product.sale_price.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
                {/* <div className="star-rating is-7 column">
                  <StarRatings
                    rating={product.average_rating || 0}
                    starDimension="14px"
                    starSpacing="1.25px"
                    starRatedColor="#4FC5F2"
                    starEmptyColor="white"
                  />{' '}
                  ({product.reviews.length})
                </div> */}
              </div>
              <div className="stock-indicator">
                {product.inventory_level > 1 &&
                  product.inventory_level < product.inventory_warning_level && (
                    <span className="error">Low Stock</span>
                  )}
                {product.inventory_level < 1 && (
                  <span className="error">Sold Out</span>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

export default ProductsCatalogItem;
