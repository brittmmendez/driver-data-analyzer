import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Cart from '../static/images/svg/Cart.svg'

@inject('shop')
@observer
class CartQuantIndic extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const { shop } = this.props;
    return (
      <div className="shopping-cart">
        <span>
          <img src={Cart} alt="cart" className="cart-icon" />
        </span>
        {shop.cart.itemCount > 0 && (
          <div className="cart-quant-indicator">
            <div>
              <span>{shop.cart.itemCount}</span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default CartQuantIndic;