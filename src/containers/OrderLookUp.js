import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import CustomerSupportBox from '../components/CustomerSupportBox';
import OrderLookUpForm from '../components/OrderLookUpForm';
import OrderConfirmation from './OrderConfirmation';

@inject('shop')
@observer
class OrderLookUp extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    match: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  // componentWillMount() {
  //   const { match } = this.props;
  //   window.PGdataLayer.page = {
  //     title: 'Order Lookup',
  //     url: match.path
  //   }
  //   window.dataLayer.push({ 'event': 'virtualPageview' })
  // }

  render() {
    const { shop, match } = this.props;
    if (!shop.checkout.orderConfirmation.securedConfirmation) {
      return (
        <div className="order-lookup container content">
          <div className="columns">
            <div className="column">
              <div className="order-lookup-page">
                <OrderLookUpForm />
              </div>
            </div>
            <div className="column support-column">
              <section className="section">
                <CustomerSupportBox />
              </section>
            </div>
          </div>
        </div>
      );
    }
    return <OrderConfirmation match={match} />;
  }
}

export default OrderLookUp;
