import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { HashLink as Link } from 'react-router-hash-link';
import MDSpinner from "react-md-spinner";
import OrderConfirmationItem from '../OrderConfirmationItem';

@inject('shop')
@observer
export default class ShippingMethod extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types,
    cart: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types,
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types,
    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types,
  };

  componentWillUpdate(prevProps) {
    const currentLocation = prevProps.location.pathname
    if (currentLocation === '/review-order') {
      window.PGdataLayer.page = {
        title: 'Review Order',
        url: currentLocation
      }
      window.dataLayer.push({ 'event': 'virtualPageview' })
    }
  }

  handleCheckoutNow() {
    const {
      shop: { checkout },
      history
    } = this.props;
    history.push('/checkout');
    checkout.checkoutStepTracker.resetTracker();
  }

  async handlePlaceOrder() {
    const {
      shop,
      shop: { checkout },
      history } = this.props;

    checkout.checkoutStepTracker.setSubmitting(true)

    const process = await shop.placeOrder();
    if (process.status) {
      history.push(`/order-confirmation`);
      checkout.checkoutStepTracker.setSubmitting(false)
    } else {
      checkout.checkoutStepTracker.setSubmitting(false)
      process.issue === 'payment' && history.replace(`/billing`);
    }
  }


  render() {
    const {
      location,
      cart,
      shop: { checkout },
    } = this.props;
    if (location.pathname === '/review-order') {
      return (
        <div className="checkout-steps review-order">
          <div className="columns is-mobile">
            <div className="column is-8">
              <p className="has-text-weight-bold is-marginless">Review Your Order</p>
            </div>
            <div className="column is-4 has-text-right">
              <Link to="/my-cart#top">
                Edit Cart
              </Link>
            </div>
          </div>
          <div className="order-review-items">
            {cart.items.map(item => (
              <OrderConfirmationItem
                key={item.id}
                item={item}
                className="order-review-item"
              />
            ))}
          </div>
          <div className="has-text-centered-mobile">
            <button
              type="button"
              className={checkout.checkoutStepTracker.submitting ? "button submitting primary-btn review-place-order-cta" : "button primary-btn review-place-order-cta"}
              onClick={e => this.handlePlaceOrder(e)}
              disabled={location.pathname !== '/review-order'}
            >
              {checkout.checkoutStepTracker.submitting ?
                <span>Placing Order <MDSpinner size={15} singleColor="#ffffff" duration={2000} /></span>
                :
                <span>Place Order</span>
              }
            </button>
          </div>
        </div>

      );
    }
    return (
      <div className="columns is-mobile checkout-steps">
        <div className="column">
          <p className="has-text-weight-bold">Review Your Order</p>
          <p> You can review your order before placing it.</p>
        </div>
      </div>
    )

  }
}
