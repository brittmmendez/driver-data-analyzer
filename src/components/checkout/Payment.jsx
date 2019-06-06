/* eslint-disable */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { CardNumberElement, CardExpiryElement, CardCVCElement, injectStripe } from 'react-stripe-elements';
import { Cookies } from 'react-cookie';
import ReactTooltip from 'react-tooltip'
import visa from '../../static/images/creditCards/visa.png';
import mastercard from '../../static/images/creditCards/mastercard.png';
import discover from '../../static/images/creditCards/discover.png';
import amex from '../../static/images/creditCards/amex.png';

const cookies = new Cookies();

const createOptions = (fontSize, padding) => { // eslint-disable-line arrow-body-style
  return {
    style: {
      base: {
        fontSize,
        color: '#40465F',
        letterSpacing: '0.025em',
        fontWeight: 'bold',
        fontFamily: 'Mukta, sans-serif',
        '::placeholder': {
          color: '#40465F',
          fontWeight: 'bold'
        },
        padding,
        // margin: '10px 0 20px 0;'
      },
      invalid: {
        color: '#40465F',
        border: '#5E5E5E'
      },
    },
  };
};

@inject('shop')
@observer
class Payment extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line
    fontSize: PropTypes.string.isRequired, // eslint-disable-line
  };

  constructor(props) {
    super(props);
    this.state = {
      cardNameError: false,
      cardNumError: '',
      cardExpError: '',
      cardCVCError: '',
    };
  }

  componentDidMount() {
    const { shop } = this.props;
    shop.payment.resetPayment()
  }

  confirmCardName = name => {
    const { ErrorFirstName } = this.state;
    const { shop } = this.props;
    let { cardName } = shop.payment

    if (typeof name === 'string') {
      cardName = name;
    }
    if (cardName.length > 0) {
      this.setState({ cardNameError: false });
    } else {
      this.setState({ cardNameError: true });
    }
    return !ErrorFirstName;
  };

  handleNameChange(event, confirmCardName) {
    const { shop } = this.props;
    shop.payment.setname(event.target.value)
    this.checkAndSubmit()
    if (confirmCardName) {
      confirmCardName(event.target.value);
    }
  }

  handleCardNumChange(event) {
    if (event.error) {
      this.setState({
        cardNumError: event.error.message
      })
    } else {
      this.setState({
        cardNumError: ''
      })
    }

    const { shop } = this.props;
    shop.payment.setCardNum(event.complete)
    shop.payment.setImg(event.brand)
    this.checkAndSubmit()
  }

  handleExpireChange(event) {
    if (event.error) {
      this.setState({
        cardExpError: event.error.message
      })
    } else {
      this.setState({
        cardExpError: ''
      })
    }

    const { shop } = this.props;
    shop.payment.setcardExp(event.complete)
    this.checkAndSubmit()
  }

  handleCVCchange(event) {
    if (event.error) {
      this.setState({
        cardCVCError: event.error.message
      })
    } else {
      this.setState({
        cardCVCError: ''
      })
    }

    const { shop } = this.props;
    shop.payment.setcardCVC(event.complete)
    this.checkAndSubmit()
  }

  checkAndSubmit() {
    const { shop } = this.props;
    if (shop.payment.creditCardReady) {
      this.submit()
    }
  }

  async submit() {
    const { shop } = this.props;
    const name = shop.payment.cardName;
    const { token } = await this.props.stripe.createToken({ // eslint-disable-line
      name,
      "address_city": shop.checkout.billingInfo.city,
      "address_country": shop.checkout.billingInfo.country,
      "address_line1": shop.checkout.billingInfo.address1,
      "address_line2": shop.checkout.billingInfo.address2,
      "address_state": shop.checkout.billingInfo.state_or_province,
      "address_zip": shop.checkout.billingInfo.postal_code
    });
    shop.payment.createPaymentModel(token);
    cookies.set('stripeToken', { token }, { path: '/' });
  }
  /* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for, react/jsx-boolean-value, react/destructuring-assignment */

  render() {
    const { state } = this
    const { shop } = this.props;
    return (
      <div id="billing" className="payment">
        <div className="columns">
          <div className="column">
            <p className="has-text-weight-bold">Payment Method</p>
          </div>
          {shop.payment.paymentError &&
            <div className="column">
              <p className="error error-message has-text-right-tablet">
                Unfortunately, the credit card provided was declined. Please try again with a different credit card.
            </p>
            </div>}
        </div>
        <div className="checkout">
          <form>
            <div className="field">
              <label className="label" htmlFor="paymentName">
                Name on Credit Card
                <div className="control has-icons-right">
                  <input
                    id="paymentName"
                    className={
                      state.cardNameError ? 'input is-danger' : 'input'
                    }
                    type="text"
                    value={shop.payment.cardName}
                    onChange={e =>
                      this.handleNameChange(e, this.confirmCardName)
                    }
                    onBlur={this.confirmCardName}
                    required
                  />
                  {state.cardNameError && (
                    <span className="icon is-small is-right">
                      {/* <i className="fas fa-exclamation-triangle" /> */}
                    </span>
                  )}
                </div>
                {state.cardNameError && (
                  <p className="error is-danger">This field is required</p>
                )}
              </label>
            </div>

            <div className="field">
              <label className="label" htmlFor="cardNumber">
                Credit Card Number
                {shop.payment.img !== "unknown" ? (
                  <img className="cardType" alt="card" src={shop.payment.getCardIcon(shop.payment.img)} />
                ) : (
                    <span>
                      <img className="cardType" alt="visa" src={visa} />
                      <img className="cardType" alt="mastercard" src={mastercard} />
                      <img className="cardType" alt="discover" src={discover} />
                      <img className="cardType" alt="american express" src={amex} />
                    </span>
                  )}
                <CardNumberElement id="cardNumberElement"
                  placeholder=''
                  onChange={e => this.handleCardNumChange(e)}
                  {...createOptions(this.props.fontSize)} />
                <p className="error is-danger">{state.cardNumError}</p>
              </label>
            </div>
            <div className="field">
              <label className="label" htmlFor="cardExpiry">
                Card Expiration Date
                <CardExpiryElement id="cardExpiryElement"
                  onChange={e => this.handleExpireChange(e)}
                  {...createOptions(this.props.fontSize)} />
                <p className="error is-danger">{state.cardExpError}</p>
              </label>
            </div>
            <div className="field">
              <label className="label" htmlFor="cardCVC">
                Security Code
                {" "}
                <span data-tip="For Visa, MasterCard and Discover, this is the 3 digits on the back of your card. <br><br> For American Express, this is the 4 digits on the front of your card.">
                  <i className="fa fa-question-circle" />
                </span>
                <ReactTooltip place="right" type="light" effect="solid" border={true} multiline={true} className="tool-tip" />
              </label>
              <CardCVCElement id="cardCVCElement"
                placeholder=''
                onChange={e => this.handleCVCchange(e)}
                {...createOptions(this.props.fontSize)} />
              <p className="error is-danger">{state.cardCVCError}</p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default injectStripe(Payment);
