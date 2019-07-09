import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

@inject('shop')
@observer
class ShopProductsBtn extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  handleClick = () => {
    const { shop: { products } } = this.props;

    products.resetProductList();
  }

  render() {
    return (
      <div>
        <Link to="/products-page">
          <button type="button" className="button primary-btn" to="/products-page" onClick={this.handleClick}>
            <span>Shop Products</span>
          </button>
        </Link>
      </div>
    );
  }
}

export default ShopProductsBtn;
