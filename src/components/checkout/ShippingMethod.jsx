import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

@inject('shop')
@observer
export default class ShippingMethod extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    location: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  constructor(props) {
    super(props);

    this.state = {
      // set shipping to first option in array
      shipping: 'shipping1'
    };
  }

  // componentWillUpdate(prevProps) {
  //   const currentLocation = prevProps.location.pathname
  //   if (currentLocation === '/shipping') {
  //     window.PGdataLayer.page = {
  //       title: 'Shipping Method',
  //       url: currentLocation
  //     }
  //     window.dataLayer.push({ 'event': 'virtualPageview' })
  //   }
  // }

  // change shipping selection but shipping is free so no need to do.
  // handleChange = (event) => {
  //   this.setState({
  //     [event.target.id]: event.target.value,
  //   });
  // submit to bigC
  // this.props.shop.cart.shipping.setShippingOption();
  // }

  handleSubmit = () => {
    this.submitShippingOption();
  };

  async submitShippingOption() {
    const { history } = this.props;
    const { shop } = this.props;
    const shippingOptionInfo = await shop.shipping.setShippingOption(
      shop.shipping.shipping_rates[0].id
    );
    if (shippingOptionInfo) {
      const nextStep = shop.checkout.checkoutStepTracker.setShippingOptionComplete();
      history.push(`${nextStep}`);
    }
  }

  render() {
    const { state, handleChange, handleSubmit, props } = this;
    const { shipping, checkout } = props.shop;
    const { location } = this.props;
    if (location.pathname === '/shipping') {
      return (
        <div className="shipping checkout-steps">
          <p className="has-text-weight-bold">Shipping Method</p>
          {shipping.shipping_rates.length ? (
            <div>
              <div className="control">
                <div className="columns is-mobile">
                  <div className="column is-1 shipping-option has-text-right">
                    <div className="radio-container">
                      <input
                        className="radio-option"
                        type="radio"
                        value="shipping1"
                        id="shipping"
                        onChange={handleChange}
                        readOnly
                        checked={state.shipping === 'shipping1'}
                      />
                      <span className="circle" />
                    </div>
                  </div>
                  <div className="column has-text-left">
                    <span className="has-text-weight-bold">
                      ${shipping.shipping_rates[0].cost.toFixed(2)} --{' '}
                      {shipping.shipping_rates[0].description}
                    </span>
                    <br />
                    Up to 10 days
                  </div>
                </div>
              </div>
              <div className="has-text-centered-mobile">
                <button
                  type="submit"
                  className="button primary-btn continue-cta"
                  onClick={handleSubmit}
                >
                  <span>Save and Continue</span>
                </button>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      );
    }
    return (
      <div className="columns is-mobile checkout-steps">
        <div className="column is-8">
          <p className="has-text-weight-bold">Shipping Method</p>
          {checkout.checkoutStepTracker.shippingOptionComplete && (
            <div>
              {shipping.shipping_rates.length !== 0 && (
                <div>
                  <span className="has-text-weight-bold">
                    ${shipping.shipping_rates[0].cost.toFixed(2)} --{' '}
                    {shipping.shipping_rates[0].description}
                  </span>
                  <br />
                  Up to 10 days
                </div>
              )}
            </div>
          )}
        </div>
        <div className="column is-4 has-text-right">
          {checkout.checkoutStepTracker.shippingOptionComplete && (
            <Link to="/shipping">Edit</Link>
          )}
        </div>
      </div>
    );
  }
}
