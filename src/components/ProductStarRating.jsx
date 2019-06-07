import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { HashLink as Link } from 'react-router-hash-link';
import StarRatings from 'react-star-ratings';

@inject('shop')
@observer
export default class ProductStarRating extends Component {
  static propTypes = {
    product: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    showAll: PropTypes.bool.isRequired,
    color: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ])
  };

  static defaultProps = {
    color: false,
  };

  render() {
    const { product, showAll, color } = this.props;

    if (product.reviews.length > 0) {
      return (
        <div className="ratings-and-reviews">
          <span className="star-count-grouping">
            <StarRatings
              rating={product.average_rating}
              starDimension="16px"
              starSpacing="1.5px"
              starRatedColor={color || "rgb(0,44,115)"}
              starEmptyColor="white"
            />
            {'  '}({product.reviews.length}){'  '}
          </span>
          {showAll && (
            <Link
              className=""
              smooth
              to={`/products-page/${product.id}#customer-reviews`}
            >
              View All
            </Link>
          )}
        </div>
      );
    }
    return <u className="is-marginless" />;
  }
}
