import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Line } from 'rc-progress';
import ProductStarRating from './ProductStarRating';
import StarRating from './StarRating';
import ReviewPagination from './ReviewPagination';
import ReviewSort from './ReviewSort';

@inject('shop')
@observer
class ProductCustomerReviews extends Component {
  static propTypes = {
    product: PropTypes.object.isRequired // eslint-disable-line  react/forbid-prop-types
  };

  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      itemsCountPerPage: 10,
      disabledBtn: false
    };
  }

  componentDidMount() {
    // resets sorted reviews
    const { product } = this.props;
    product.resetReviewSort();
    product.resetReviewFilter();
  }

  // changes page for pagination
  handlePageChange = pageNumber => {
    const { itemsCountPerPage } = this.state;
    const {
      product: { filteredRevsLength }
    } = this.props;

    if (pageNumber * itemsCountPerPage - filteredRevsLength < 0) {
      this.setState({
        activePage: pageNumber,
        disabledBtn: false
      });
    } else {
      this.setState({
        activePage: pageNumber,
        disabledBtn: true
      });
    }
  };

  // changes number of reviews on page for pagination
  handleItemsCountChange = countNumber => {
    const { product } = this.props;
    this.setState({
      activePage: 1,
      itemsCountPerPage: countNumber,
      disabledBtn: countNumber === product.filteredRevsLength
    });
  };

  handleFilterChange = selectedOption => {
    const { itemsCountPerPage } = this.state;
    const { product } = this.props;

    product.updateReviewFilter(selectedOption);

    if (itemsCountPerPage !== 10 && itemsCountPerPage !== 20) {
      this.setState({
        activePage: 1,
        itemsCountPerPage: product.filterReviews().length
      });
    } else {
      this.setState({
        activePage: 1
      });
    }
  };

  render() {
    const {
      product,
      product: { filteredRevsLength, filterReviews, reviews }
    } = this.props;

    // sets pagination
    const { activePage, itemsCountPerPage, disabledBtn } = this.state;
    const startSlice = activePage * itemsCountPerPage - itemsCountPerPage;
    let endSlice = activePage * itemsCountPerPage;

    if (endSlice > product.filterReviews().length) {
      endSlice = product.filterReviews().length;
    }

    const setReviews = filterReviews().slice(startSlice, endSlice);

    if (reviews.length > 0) {
      return (
        <div className="container content product-review">
          <div className="columns">
            <div className="column is-3 has-text-left has-text-centered-mobile">
              <h3 className="product-name">{product.name}</h3>
              {/* <div className="star-rating"> */}
              <div className="star-filter">
                {' '}
                {product.average_rating} out of 5 stars
              </div>
              <div
                role="link"
                className="star-rating-filter"
                tabIndex="0"
                onClick={() => this.handleFilterChange(0)}
                onKeyPress={() => this.handleFilterChange(0)}
              >
                <ProductStarRating
                  product={product}
                  showAll={false}
                  color="#1A699F"
                />
              </div>
            </div>
            <div className="column is-6 ratings-and-reviews">
              <div className="columns is-mobile has-text-left">
                <div className="column is-5 has-text-right">
                  <StarRating
                    product={product}
                    reviews={reviews}
                    handleFilterChange={this.handleFilterChange}
                    count={product.star5_rating}
                    number={5}
                    color="#1A699F"
                  />
                  <StarRating
                    product={product}
                    reviews={reviews}
                    handleFilterChange={this.handleFilterChange}
                    count={product.star4_rating}
                    number={4}
                    color="#1A699F"
                  />
                  <StarRating
                    product={product}
                    reviews={reviews}
                    handleFilterChange={this.handleFilterChange}
                    count={product.star3_rating}
                    number={3}
                    color="#1A699F"
                  />
                  <StarRating
                    product={product}
                    reviews={reviews}
                    handleFilterChange={this.handleFilterChange}
                    count={product.star2_rating}
                    number={2}
                    color="#1A699F"
                  />
                  <StarRating
                    product={product}
                    reviews={reviews}
                    handleFilterChange={this.handleFilterChange}
                    count={product.star1_rating}
                    number={1}
                    color="#1A699F"
                  />
                </div>
                <div className="column is-7 has-text-left">
                  <Line
                    percent={
                      (product.star5_rating / product.reviews.length) * 100
                    }
                    strokeWidth="5"
                    strokeColor="#1A699F"
                    trailWidth="5"
                    trailColor="#D2E4F0"
                    strokeLinecap="square"
                    onClick={() => this.handleFilterChange(5)}
                  />
                  <Line
                    percent={
                      (product.star4_rating / product.reviews.length) * 100
                    }
                    strokeWidth="5"
                    strokeColor="#1A699F"
                    trailWidth="5"
                    trailColor="#D2E4F0"
                    strokeLinecap="square"
                    onClick={() => this.handleFilterChange(4)}
                  />
                  <Line
                    percent={
                      (product.star3_rating / product.reviews.length) * 100
                    }
                    strokeWidth="5"
                    strokeColor="#1A699F"
                    trailWidth="5"
                    trailColor="#D2E4F0"
                    strokeLinecap="square"
                    onClick={() => this.handleFilterChange(3)}
                  />
                  <Line
                    percent={
                      (product.star2_rating / product.reviews.length) * 100
                    }
                    strokeWidth="5"
                    strokeColor="#1A699F"
                    trailWidth="5"
                    trailColor="#D2E4F0"
                    strokeLinecap="square"
                    onClick={() => this.handleFilterChange(2)}
                  />
                  <Line
                    percent={
                      (product.star1_rating / product.reviews.length) * 100
                    }
                    strokeWidth="5"
                    strokeColor="#1A699F"
                    trailWidth="5"
                    trailColor="#D2E4F0"
                    strokeLinecap="square"
                    onClick={() => this.handleFilterChange(1)}
                  />
                </div>
              </div>
            </div>
            <div className="column is-3 has-text-centered-mobile">
              <ReviewSort
                tabindex="0"
                product={product}
                handlePageChange={this.handlePageChange}
              />
            </div>
          </div>
          <div id="customer-reviews">
            <ReviewPagination
              reviews={setReviews}
              product={product}
              activePage={activePage}
              itemsCountPerPage={itemsCountPerPage}
              startSlice={startSlice}
              endSlice={endSlice}
              handlePageChange={this.handlePageChange}
              handleItemsCountChange={this.handleItemsCountChange}
              bottomNav={false}
              tabindex="0"
            />
          </div>

          <div className="review-list">
            {setReviews.map(review => (
              <div
                className="columns has-border-bottom review-body"
                key={review.name}
              >
                <div className="column is-3 has-text-left">
                  <div className="is-hidden-mobile">
                    <p className="sub-text">
                      {new Date(review.date_reviewed).toLocaleString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="has-text-weight-bold">{review.name}</p>
                    <p>{product.name}</p>
                  </div>
                  <div className="is-hidden-tablet columns is-mobile">
                    <div className="column">
                      <p className="has-text-weight-bold">{review.name}</p>
                      <p>{product.name}</p>
                    </div>
                    <p className="review-date has-text-right-mobile column">
                      {new Date(review.date_reviewed).toLocaleString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="column is-8 has-text-left is-paddingless-top">
                  <div>
                    <StarRating
                      product={product}
                      handleFilterChange={this.handleFilterChange}
                      hideCount
                      number={review.rating}
                      color="#1A699F"
                    />
                  </div>
                  <h4 className="review-title">{review.title}</h4>
                  <p>{review.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="is-hidden-mobile">
            <ReviewPagination
              reviews={setReviews}
              product={product}
              activePage={activePage}
              itemsCountPerPage={itemsCountPerPage}
              startSlice={startSlice}
              endSlice={endSlice}
              handlePageChange={this.handlePageChange}
              handleItemsCountChange={this.handleItemsCountChange}
              bottomNav
            />
          </div>
          {filteredRevsLength >= 10 && (
            <button
              onClick={() =>
                this.handleItemsCountChange(itemsCountPerPage + 10)
              }
              disabled={disabledBtn}
              className={
                disabledBtn
                  ? 'is-hidden-tablet disabled-btn load-more-reviews'
                  : 'is-hidden-tablet primary-btn load-more-reviews'
              }
              type="button"
            >
              {' '}
              <span>Load More</span>{' '}
            </button>
          )}
        </div>
      );
    }
    return (
      <div className="container product-review">
        <h3 className="product-name">{product.name}</h3>
        <p>
          {' '}
          <i> We currently have no reviews for this product. </i>
        </p>
      </div>
    );
  }
}

export default ProductCustomerReviews;
