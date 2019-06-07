import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import StarRatings from 'react-star-ratings';

@inject('shop')
@observer
export default class StarRating extends Component {
  static propTypes = {
    count: PropTypes.number,
    number: PropTypes.number.isRequired,
    hideCount: PropTypes.bool,
    // product: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    handleFilterChange: PropTypes.func.isRequired, // eslint-disable-line react/forbid-prop-types
    color: PropTypes.string.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  // handleFilterChange = (selectedOption) => {
  //   const { product, handleStarFilterChange } = this.props;
  //   product.updateReviewFilter(selectedOption);

  //   handleStarFilterChange(selectedOption)
  // }

  render() {
    const { number, count, hideCount, handleFilterChange, color } = this.props;

    return (
      <div
        role="link"
        className="star-rating-filter"
        tabIndex="0"
        onClick={() => handleFilterChange(number)}
        onKeyPress={() => handleFilterChange(number)}
      >
        <span className="star-count-grouping">
          <StarRatings
            rating={number}
            starDimension="16px"
            starSpacing="1.5px"
            starEmptyColor="white"
            starRatedColor={color || "rgb(0,44,115)"}
          />
          {!hideCount && (
            <span>{'  '}({count})</span>
          )}
        </span>
      </div>
    );
  }
}

StarRating.defaultProps = {
  count: 0,
  hideCount: false
};
