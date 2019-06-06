import React, { Component } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
// import ProductGrouping from './landingPage/ProductGrouping';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
// import { Image, Transformation } from 'cloudinary-react';

@inject('shop')
@observer
class EmptyCart extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: {
        contentful
      }
    } = this.props;
    return (
      <div className="empty-cart" style={{ backgroundImage: `url(${contentful.emptyCartImg})` }}>
        <section className="section">
          <div className="container has-text-centered">
            <div className="content">
              <h1 className="has-text-white">Looks like there’s room for some products!</h1>
              <p className="has-text-white">
                Add a product (or two!) to your cart to start the checkout process.
        </p>
              <Link to="/products-page/127#top">
                <button type="button" aria-label="shop" className="primary-btn shop-btn"> Shop Uplift</button>
              </Link>
            </div>
          </div>
          {/* <ProductGrouping /> */}
        </section>
      </div>
    );
  }
}

export default EmptyCart;
