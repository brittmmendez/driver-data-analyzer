import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import MDSpinner from "react-md-spinner";

@inject('shop')
@observer
class OrderLookUpForm extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  constructor(props) {
    super(props);
    this.state = {
      orderNumber: '',
      email: '',
      ErrorOrderNumber: false,
      ErrorEmail: false,
      submitting: false
    };
  }

  handleChange = (event, confirmerFunction) => {
    this.setState({
      [event.target.id]: event.target.value
    });

    if (confirmerFunction) {
      confirmerFunction(event.target.value);
    }
  };

  handleSubmit = event => {
    event.preventDefault();

    this.formErrors();
    if (this.validateForm()) {
      this.submitOrderLookup()
    }
  };

  confirmNotEmpty = string => {
    if (string.length > 0) {
      this.setState({ ErrorEmail: false });
    } else {
      this.setState({ ErrorEmail: true });
    }
  };

  confirmOrderNum = num => {
    const { ErrorOrderNumber } = this.state;
    let { orderNumber } = this.state;

    if (typeof num === 'string') {
      orderNumber = num;
    }

    if (orderNumber.length > 0) {
      this.setState({ ErrorOrderNumber: false });
    } else {
      this.setState({ ErrorOrderNumber: true });
    }
    return !ErrorOrderNumber;
  };

  confirmEmail = () => {
    const {
      state: { email, ErrorEmail }
    } = this;
    const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (email.length > 0) {
      if (email.match(emailRegEx) !== null) {
        this.setState({
          ErrorEmail: false
        });
      } else {
        this.setState({
          ErrorEmail: true
        });
      }
    } else {
      this.setState({ ErrorEmail: true });
    }
    return !ErrorEmail;
  };

  formErrors() {
    this.confirmOrderNum();
    this.confirmEmail();
  }

  validateForm() {
    return this.confirmOrderNum() && this.confirmEmail();
  }

  async submitOrderLookup() {
    const { shop } = this.props;
    this.setState({
      submitting: true
    })

    const orderId = await shop.checkout.orderConfirmation.orderLookup(this.state);
    if (orderId) {
      this.setState({
        submitting: false
      })
    } else {
      this.setState({
        submitting: false
      })
    }
  }

  render() {
    const { state } = this;
    const { shop } = this.props;
    return (
      <div className="order-lookup-form">
        <h2 className="order-lookup-title"> Order Lookup </h2>
        <p>
          Enter your order number and the email address that you used to place
          your order.
        </p>
        {shop.checkout.orderConfirmation.orderLookUpError && (
          <p className="error">
            We can’t find the order with that order number and email address. Please try again or contact our customer support team for help.
          </p>
        )}
        <div className="checkout">
          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <label className="label" htmlFor="order_number">
                Order Number
                <div className="control has-icons-right">
                  <input
                    id="orderNumber"
                    className={
                      state.ErrorOrderNumber ? 'input is-danger' : 'input'
                    }
                    type="text"
                    value={state.orderNumber}
                    onChange={e => this.handleChange(e, this.confirmOrderNum)}
                    onBlur={this.confirmOrderNum}
                    required
                  />
                  {state.ErrorOrderNumber && (
                    <span className="icon is-small is-right">
                      {/* <i className="fas fa-exclamation-triangle" /> */}
                    </span>
                  )}
                </div>
                {state.ErrorOrderNumber && (
                  <p className="error">This field is required</p>
                )}
              </label>
            </div>

            <div className="field">
              <label className="label" htmlFor="email">
                Email Address
                <div className="control has-icons-right">
                  <input
                    id="email"
                    className={state.ErrorEmail ? 'input is-danger' : 'input'}
                    type="email"
                    defaultValue={state.email}
                    onChange={e => this.handleChange(e, this.confirmNotEmpty)}
                    onBlur={this.confirmEmail}
                    required
                  />
                  {state.ErrorEmail && (
                    <span className="icon is-small is-right">
                      {/* <i className="fas fa-exclamation-triangle" /> */}
                    </span>
                  )}
                </div>
                {state.ErrorEmail && state.email === '' && (
                  <p className="error">This field is required</p>
                )}
                {state.ErrorEmail && state.email !== '' && (
                  <p className="error">
                    Please enter a valid email address
                  </p>
                )}
              </label>
            </div>

            <div className="field has-text-centered-mobile">
              <button className="primary-btn button" type="submit">
                {state.submitting ?
                  <span>Looking Up Order <MDSpinner size={15} singleColor="#ffffff" duration={2000} /></span>
                  :
                  <span>Lookup Order</span>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default OrderLookUpForm;
