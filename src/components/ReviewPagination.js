import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Pagination from "react-js-pagination";

@inject('shop')
@observer
export default class ReviewPagination extends Component {
  static propTypes = {
    reviews: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types,
    product: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types,
    activePage: PropTypes.number.isRequired, // eslint-disable-line react/forbid-prop-types,
    itemsCountPerPage: PropTypes.number.isRequired, // eslint-disable-line react/forbid-prop-types,
    startSlice: PropTypes.number.isRequired, // eslint-disable-line react/forbid-prop-types,
    endSlice: PropTypes.number.isRequired, // eslint-disable-line react/forbid-prop-types,
    handlePageChange: PropTypes.func.isRequired, // eslint-disable-line react/forbid-prop-types,
    handleItemsCountChange: PropTypes.func.isRequired, // eslint-disable-line react/forbid-prop-types,
  };

  render() {
    const {
      reviews,
      product,
      activePage,
      itemsCountPerPage,
      startSlice,
      endSlice,
      handlePageChange,
      handleItemsCountChange,
    } = this.props;

    return (
      <div>
        <div className="columns has-text-left total-reviews is-mobile">
          <div className="column has-text-left">
            <span>{startSlice + 1}-{endSlice} of {product ? product.filterReviews().length : reviews.length} reviews</span>
          </div>
          <div className="column is-hidden-mobile">
            <div className="is-hidden-mobile">
              <Pagination
                prevPageText='< Previous'
                nextPageText='Next >'
                hideFirstLastPages
                itemClass="page-link"
                itemClassPrev="item-class-prev"
                itemClassNext="item-class-next"
                activePage={activePage}
                itemsCountPerPage={itemsCountPerPage}
                totalItemsCount={product && product.filteredRevsLength}
                pageRangeDisplayed={5}
                onChange={e => handlePageChange(e)}
              />
            </div>
          </div>

          <div className="column has-text-right reviews-per-page">
            <div>
              <span className="is-hidden-mobile">Reviews Per Page: </span>
              <span className="is-hidden-tablet">View:</span>
              <span
                role="button"
                tabIndex="0"
                onClick={() => handleItemsCountChange(10)}
                onKeyPress={() => handleItemsCountChange(10)}>
                <a className={itemsCountPerPage === 10 ? "active" : ""}> 10 </a>
              </span> |
                <span
                role="button"
                tabIndex="0"
                onClick={() => handleItemsCountChange(20)}
                onKeyPress={() => handleItemsCountChange(20)}>
                <a className={itemsCountPerPage === 20 ? "active" : ""}> 20 </a>
              </span> |
                <span role="button"
                tabIndex="0"
                onClick={() => handleItemsCountChange(product.filteredRevsLength)}
                onKeyPress={() => handleItemsCountChange(product.filteredRevsLength)}>
                <a className={itemsCountPerPage !== 10 && itemsCountPerPage !== 20 ? "active is-hidden-touch" : "is-hidden-touch"}> View All </a>
                <a className={itemsCountPerPage !== 10 && itemsCountPerPage !== 20 ? "active is-hidden-desktop" : "is-hidden-desktop"}> All </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
