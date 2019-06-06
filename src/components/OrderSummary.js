import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import MDSpinner from "react-md-spinner";
import FormikPromo from './FormikPromo';

@inject('shop')
@observer
class OrderSummary extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    history: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  getClass() {
    const {
      shop: { checkout },
      location
    } = this.props;

    if (location.pathname !== '/review-order' || !checkout.checkoutStepTracker.trackerComplete) {
      return "button disabled-btn disabled-order-cta place-order-cta event_buy_now_checkout_complete"
    }

    if (checkout.checkoutStepTracker.submitting) {
      return "button submitting primary-btn place-order-cta"
    }
    return "button primary-btn place-order-cta event_buy_now_checkout_complete"
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
      process.issue === 'payment' && history.replace("/billing");
    }
  }

  render() {
    const {
      shop: { cart, checkout },
      location
    } = this.props;

    return (
      <div>
        <div className="content">
          <h3 className="header"> Order Summary </h3>
          <div className="columns is-mobile">
            <div className="column">
              <div className="columns is-mobile">
                <div className="column is-8">
                  Subtotal ({cart.itemCount}{' '}
                  {cart.itemCount > 1 ? 'Items' : 'Item'})
                </div>
                <div className="column is-4 has-text-right">
                  ${cart.orderSummarySubTotal}
                </div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-8">Shipping & Handling</div>
                <div className="column is-4 has-text-right">
                  {cart.getShipping}
                </div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-8">Estimated Tax</div>
                <div className="column is-4 has-text-right">{cart.getTax}</div>
              </div>
              <div className="columns is-mobile">
                <div className="column is-8">Promo Code Discounts</div>
                <div className="column is-4 has-text-right">
                  {cart.coupon.getDiscount}
                </div>
              </div>
              <div className="columns is-mobile total">
                <div className="column is-8">Total</div>
                <div className="column is-4 has-text-right">
                  ${cart.orderSummaryTotal}
                </div>
              </div>
            </div>
          </div>
          <p className="has-text-left tax-and-shipping-msg"> {cart.getOrderSummaryMsg} </p>
          <FormikPromo />
          <div
            className={location.pathname === '/checkout' ||
              location.pathname === '/shipping' ||
              location.pathname === '/billing' ||
              location.pathname === '/terms-and-conditions' ? "has-text-centered checkout-div hide-div" : "has-text-centered checkout-div"}
          >
            <div className="columns is-mobile">
              <div className="column is-6 mobile-total  has-text-left">Estimated Total:</div>
              <div className="column is-6 mobile-total has-text-right has-text-weight-bold">
                ${cart.orderSummaryTotal}
              </div>
            </div>
            <button
              type="button"
              className="button primary-btn checkout-cta"
              onClick={e => this.handleCheckoutNow(e)}
            >
              Checkout Now
            </button>
            <button
              type="button"
              className={this.getClass()}
              onClick={e => this.handlePlaceOrder(e)}
              disabled={location.pathname !== '/review-order' || !checkout.checkoutStepTracker.trackerComplete}
            >
              {checkout.checkoutStepTracker.submitting ?
                <span>Placing Order <MDSpinner size={15} singleColor="#ffffff" duration={2000} /></span>
                :
                <span>Place Order</span>
              }
            </button>
            {location.pathname !== '/my-cart' &&
              <p className="sub-text is-hidden-tablet"> By placing this order, you agree to our
              <a
                  href="https://www.pg.com/privacy/english/privacy_statement.shtml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="info"
                >Privacy Policy</a>
                <br />
                and
              <a
                  href="https://www.pg.com/en_US/terms_conditions/"
                  target="_blank"
                  rel="noopener noreferrer"
                >Terms and Conditions</a>
              </p>}
          </div>
          {/* <p className="has-text-left is-marginless">Or Checkout With</p>
          <div className="has-text-centered">
            <Link className="button paypal-cta" to="/products-page">
              PayPal
            </Link>
          </div> */}
          {location.pathname !== '/my-cart' &&
            <p className="sub-text is-hidden-mobile terms-conditions-desktop"> By placing this order, you agree to our
          <a
                href="https://www.pg.com/privacy/english/privacy_statement.shtml"
                target="_blank"
                rel="noopener noreferrer"
                className="info"
              >Privacy Policy</a>
              and
            <a
                href="https://www.pg.com/en_US/terms_conditions/"
                target="_blank"
                rel="noopener noreferrer"
              >Terms and Conditions</a>
            </p>}
        </div>
      </div>
    );
  }
}

export default OrderSummary;