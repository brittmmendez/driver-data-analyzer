import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { HashLink as Link } from 'react-router-hash-link';
import PropTypes from 'prop-types';
import OrderConfirmationItem from '../components/OrderConfirmationItem';
import LoadingView from '../components/LoadingView';
import PaymentCard from '../components/checkout/PaymentCard';
import ErrorPage from './ErrorPage';
import Print from '../static/images/svg/Printer.svg'

@inject('shop')
@observer
class OrderConfirmation extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    match: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    history: PropTypes.object // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    history: {},
  };

  componentWillMount() {
    const { match } = this.props;
    window.PGdataLayer.page = {
      title: 'Order Confirmation',
      url: match.path
    }
    window.dataLayer.push({ 'event': 'virtualPageview' })
  }

  componentWillUnmount() {
    const {
      shop,
      shop: { checkout }
    } = this.props;

    checkout.orderConfirmation.clearOrderSummary();
    shop.payment.resetPayment();
  }

  handleClick = () => {
    window.print();
  };

  // GA track
  trackPurchaseGA() {
    const {
      shop: {
        checkout: { orderConfirmation }
      }
    } = this.props;
    const { items } = orderConfirmation;
    if (window && window.PGdataLayer) {
      let transaction = {};
      // add transaction details
      transaction.transactionId = orderConfirmation.order_id;
      transaction.transactionAffiliation = 'Uplift';
      transaction.transactionTotal = orderConfirmation.total;
      transaction.transactionTax = orderConfirmation.tax;
      transaction.transactionShipping = orderConfirmation.shipping_handling;

      // add products to transaction
      transaction.transactionProducts = [];
      items.map(i => (
        transaction.transactionProducts.push({
          'id': i.id,
          'sku': i.sku,
          'name': i.name,
          'category': 27,
          'price': i.price,
          'quantity': i.quantity
        })
      ))
      transaction.event = 'BCtransactionComplete';
      console.log(transaction);
      window.dataLayer.push(transaction);
    }
  }

  render() {
    const {
      history,
      shop: {
        checkout: { orderConfirmation },
        payment
      }
    } = this.props;

    if (!orderConfirmation.securedConfirmation) {
      history.push('/order-lookup');
    }

    if (orderConfirmation.orderSummaryError) {
      return <ErrorPage
        errorTitle="Thank you, your order has been placed!"
        errorMsg="Look out for your order confirmation and details in your email inbox, or feel free to explore our site."
        errorType="confirmation" />
    }

    if (
      orderConfirmation.items.length < 0 &&
      orderConfirmation.securedConfirmation
    ) {
      return (
        <LoadingView />
      )
    }

    if (
      orderConfirmation.items.length > 0 &&
      orderConfirmation.securedConfirmation
    ) {
      this.trackPurchaseGA()

      window.scrollTo(0, 0)
      return (
        <div className="order-confirmation content">
          <div className="has-text-centered">
            <h2>
              Thank you, your order has been placed.
            </h2>
            <div className="confirmation-msg">
              <h3 className="msg">
                Your order #{orderConfirmation.order_id} will arrive in up to 10
                business days.
              </h3>
              A confirmation email has been sent to{' '}
              {orderConfirmation.shipping_email}
            </div>
          </div>
          <div className="columns order-details">
            <h3 className="column has-text-left">
              Order Details
            </h3>
            <div className="column has-text-right print-option">
              <span
                onClick={this.handleClick}
                onKeyPress={this.handleClick}
                tabIndex="0"
                role="link"
              >
                <a>Print This Page{" "}
                  <img src={Print} alt="print-icon" className="" />
                </a>
              </span>
            </div>
          </div>
          <div className="columns has-text-left">
            <div className="column is-5">
              <div className="order-detail-title has-text-weight-bold"> Shipping Info </div>
              {orderConfirmation.shipping_first_name}{' '}
              {orderConfirmation.shipping_last_name}
              <br />
              {orderConfirmation.shipping_address1}
              <br />
              {orderConfirmation.shipping_address2 && (
                <div>
                  {orderConfirmation.shipping_address2}
                  <br />
                </div>
              )}
              <p>
                {orderConfirmation.shipping_city}{' '}
                {orderConfirmation.shipping_state_or_province}{' '}
                {orderConfirmation.shipping_postal_code}
              </p>
            </div>
            <div className="column is-4">
              <div className="order-detail-title has-text-weight-bold"> Payment Method </div>
              {payment.creditCardComplete && <PaymentCard />}
            </div>
            <div className="column has-text-left">
              <div className="order-detail-title has-text-weight-bold"> Billing Address </div>
              {orderConfirmation.billing_first_name}{' '}
              {orderConfirmation.billing_last_name}
              <br />
              {orderConfirmation.billing_address1}
              <br />
              {orderConfirmation.billing_address2 && (
                <div>
                  {orderConfirmation.billing_address2}
                  <br />
                </div>
              )}
              <p>
                {orderConfirmation.billing_city}{' '}
                {orderConfirmation.billing_state_or_province}{' '}
                {orderConfirmation.billing_postal_code}
              </p>
            </div>
          </div>
          {orderConfirmation.items.map(item => (
            <OrderConfirmationItem
              key={item.id}
              item={item}
              className="order-confirmation-item"
            />
          ))}
          <div className="column">
            <div className="columns is-mobile confirmation-summary">
              <div className="column is-paddingless is-8">
                Subtotal ({orderConfirmation.itemCount}{' '}
                {orderConfirmation.itemCount > 1 ? 'Items' : 'Item'})
              </div>
              <div className="column is-4 is-paddingless has-text-right">
                ${orderConfirmation.sub_total.toFixed(2)}
              </div>
            </div>
            <div className="columns is-mobile">
              <div className="column is-paddingless is-8">
                Shipping & Handling
              </div>
              <div className="column is-4 is-paddingless has-text-right">
                ${orderConfirmation.shipping_handling.toFixed(2)}
              </div>
            </div>
            <div className="columns is-mobile">
              <div className="column is-paddingless is-8">Tax</div>
              <div className="column is-4 is-paddingless has-text-right">
                ${orderConfirmation.tax.toFixed(2)}
              </div>
            </div>
            {orderConfirmation.promo_amount ? (
              <div>
                <div className="columns is-mobile">
                  <div className="column is-paddingless is-8">
                    Promo Code Discounts
                  </div>
                  <div className="column is-4 is-paddingless has-text-right">
                    -$
                    {orderConfirmation.promo_amount.toFixed(2)}
                  </div>
                </div>
                <div className="columns is-mobile promo">
                  <div className="column">
                    <div className="">
                      <p>{orderConfirmation.promo_code}</p>
                      {orderConfirmation.promo_name}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
                ''
              )}
            <div className="columns is-mobile has-text-weight-bold total">
              <div className="column is-paddingless is-8">Total</div>
              <div className="column is-4 is-paddingless has-text-right">
                ${orderConfirmation.total.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="mobile-view">
            <Link className="button secondary-btn cont-shopping event_continue_shopping" to="/products-page#top">
              Continue Shopping
            </Link>
          </div>
        </div>
      );
    }
    return <LoadingView />;
  }
}

export default OrderConfirmation;
