import React, { Component } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Cookies } from 'react-cookie';
import Markdown from 'react-markdown';
import EmptyCart from '../components/EmptyCart';
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';
import LoadingView from '../components/LoadingView';

const cookies = new Cookies();

@inject('shop')
@observer
class MyCart extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    match: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  // componentWillMount() {
  //   const { match } = this.props;
  //   window.PGdataLayer.page = {
  //     title: 'Cart',
  //     url: match.path
  //   }
  //   window.dataLayer.push({ 'event': 'virtualPageview' })
  // }

  render() {
    const {
      shop: { cart, consentCopy },
      history,
      location
    } = this.props;

    if (cart.itemCount > 0) {
      return (
        <div className="cart">
          <div className="container">
            <div className="consent-msg">
              <Markdown source={consentCopy.consentCopy} />
              <br />
              <Markdown source={consentCopy.consentProductsPage} />
            </div>
          </div>
          <section className="section">
            <div className="container content">
              <div className="columns">
                <div className="column is-8">
                  <h3 className="my-cart" data-cy="item-count">
                    My Cart: ({cart.itemCount}) {cart.itemCount > 1 ? "Items" : "Item"}
                  </h3>
                  {cart.items.map(item => (
                    <CartItem key={item.id} item={item} />
                  ))}
                  <Link
                    className="secondary-btn button cont-shopping event_continue_shopping"
                    to="/products-page#top"
                  >
                    Continue Shopping
                  </Link>
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
        </div >
      );
    }

    if (cart.itemCount === 0 && cookies.get('cart')) {
      return <LoadingView />
    }

    if (cart.itemCount === 0 && cart.creatingCart) {
      return <LoadingView />
    }
    return <EmptyCart />;

  }
}

export default MyCart;
