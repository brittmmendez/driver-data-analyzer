import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import visa from '../../static/images/creditCards/visa.png';
import mastercard from '../../static/images/creditCards/mastercard.png';
import discover from '../../static/images/creditCards/discover.png';
import amex from '../../static/images/creditCards/amex.png';

@inject('shop')
@observer
class PaymentCard extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line
  };

  getCardIcon(brand) {
    switch (brand) {
      case "Visa":
        return visa;
      case "MasterCard":
        return mastercard;
      case "Discover":
        return discover;
      case "American Express":
        return amex;
      default:
        return amex;
    }
  }

  render() {
    const { shop } = this.props;
    return (
      <div className="checkout-flow is-marginless">
        <img className="cardType" alt="visa" src={shop.payment.getCardIcon(shop.payment.img)} />
        {"  "}
        <span className="has-text-weight-bold">{shop.payment.brand.toUpperCase()}
          {" "}
          --
            {" "}
          ****-{shop.payment.last4}
        </span>
      </div>
    );
  }
}

export default PaymentCard;