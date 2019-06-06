import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Cookies } from 'react-cookie';
import OrderSummary from '../components/OrderSummary';
import EmptyCart from '../components/EmptyCart';
import LoadingView from '../components/LoadingView';
import ErrorBanner from '../components/ErrorBanner';
import ErrorPage from './ErrorPage';
import {
  ShippingInfo,
  ShippingMethod,
  BillingAddress,
  Consent,
  ReviewOrder
} from '../components/checkout/index';

const cookies = new Cookies();

@inject('shop')
@observer
class Checkout extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    location: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  componentDidMount() {
    const {
      shop: { checkout }
    } = this.props;

    checkout.getCheckoutSummary();
  }

  render() {
    const {
      shop,
      shop: { cart, checkout },
      history,
      location
    } = this.props;

    if (shop.placingOrderError) {
      return <ErrorPage
        errorTitle="We’re so sorry, we couldn’t place your order."
        errorMsg="We got temporarily disconnected, but don’t worry, we saved your information. Please refresh the page to place your order again."
        errorType="order"
        refreshBtn />
    }

    if (cart.itemCount > 0) {
      return (
        <div className="checkout-flow">
          {checkout.checkoutError && <ErrorBanner />}
          <section className="section">
            <div className="container">
              <div className="columns">
                <div className="column is-8">
                  <div className="content">
                    <h3>Checkout</h3>
                    <ShippingInfo history={history} location={location} />
                    <ShippingMethod history={history} location={location} />
                    <BillingAddress history={history} location={location} />
                    <Consent history={history} location={location} />
                    <ReviewOrder
                      history={history}
                      location={location}
                      cart={cart}
                    />
                  </div>
                </div>
                <div className="column is-4">
                  <div className="sticky">
                    <div className="section order-summary less-padding">
                      <OrderSummary history={history} location={location} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      );
    }
    if (cart.itemCount === 0 && cookies.get('cart')) {
      return <LoadingView />;
    }

    return <EmptyCart />;
  }
}

export default Checkout;
