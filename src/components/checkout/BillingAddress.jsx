import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Elements, StripeProvider } from 'react-stripe-elements';
import { Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Payment from './Payment';
import PaymentCard from './PaymentCard';
import statesEnums from '../enum/States';

const cookies = new Cookies();
let setting = cookies.get('sameAsBilling');
cookies.get('sameAsBilling');
@inject('shop')
@observer
class ShippingInfo extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line
    history: PropTypes.object.isRequired, // eslint-disable-line
    location: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      address1: '',
      address2: '',
      city: '',
      state_or_province: '',
      state_or_province_code: '',
      postal_code: '',
      phone: '',
      email: '',
      sameAsBilling: '',
      prefilled: false,
      ErrorFirstName: false,
      ErrorLastName: false,
      ErrorStreetAddress: false,
      ErrorCityAddress: false,
      ErrorStateAddress: false,
      ErrorZipAddress: false,
      ErrorBilling: false
    };
    this.myRef = React.createRef()   // Create a ref object 
  }

  componentDidMount() {
    const {
      shop: { checkout, payment }
    } = this.props;
    setting = cookies.get('sameAsBilling');
    checkout.getCheckoutSummary();
    const paymentType = cookies.get('stripeToken');
    if (paymentType) {
      payment.createPaymentModel(paymentType.token);
    }
    if (setting && setting.sameAsBilling === 'no') {
      this.setState({
        sameAsBilling: false
      });
    } else {
      this.setState({
        sameAsBilling: true
      });
      checkout.billingInfo.setStreet(checkout.shippingInfo.address1);
      checkout.billingInfo.setCity(checkout.shippingInfo.city);
      checkout.billingInfo.setState(checkout.shippingInfo.state_or_province);
      checkout.billingInfo.setZip(checkout.shippingInfo.postal_code);
    }
  }

  // componentWillUpdate(prevProps) {
  //   const currentLocation = prevProps.location.pathname
  //   if (currentLocation === '/billing') {
  //     window.PGdataLayer.page = {
  //       title: 'Billing Info',
  //       url: currentLocation
  //     }
  //     window.dataLayer.push({ 'event': 'virtualPageview' })
  //   }
  // }

  handleChange = (event, confirmerFunction) => {
    this.setState({
      [event.target.id]: event.target.value
    });
    if (confirmerFunction) {
      confirmerFunction(event.target.value);
    }
  };

  handleCheckBox = () => {
    const { sameAsBilling } = this.state;
    if (!sameAsBilling) {
      this.setState({
        sameAsBilling: true
      });
    } else {
      this.setState({
        sameAsBilling: false
      });
    }
  };

  handleStateChange = (event, confirmStateAddress) => {
    this.setState({
      state_or_province: event.label,
      state_or_province_code: event.value
    });
    confirmStateAddress(event.label, event.value);
  };

  handleSubmit = event => {
    const { sameAsBilling, state_or_province: state } = this.state;
    const {
      shop: { checkout: { shippingInfo } }
    } = this.props;

    event.preventDefault();

    if (sameAsBilling) {
      this.submitBillingInfo({
        first_name: shippingInfo.first_name,
        last_name: shippingInfo.last_name,
        address1: shippingInfo.address1,
        address2: shippingInfo.address2,
        city: shippingInfo.city,
        state_or_province: shippingInfo.state_or_province,
        state_or_province_code: shippingInfo.state_or_province_code,
        postal_code: shippingInfo.postal_code,
        phone: shippingInfo.phone,
        email: shippingInfo.email
      })
      // else validate entries
    } else {
      this.formErrors();
      if (this.validateForm() && state !== '') {
        this.submitBillingInfo(this.state)
      }
    }
  };

  confirmFirstName = name => {
    const { ErrorFirstName } = this.state;
    let { first_name: firstName } = this.state;
    if (typeof name === 'string') {
      firstName = name;
    }
    if (firstName.replace(/\s/g, '').length > 0) {
      this.setState({ ErrorFirstName: false });
    } else {
      this.setState({ ErrorFirstName: true });
    }
    return !ErrorFirstName;
  };

  confirmLastName = name => {
    const { ErrorLastName } = this.state;
    let { last_name: lastName } = this.state;

    if (typeof name === 'string') {
      lastName = name;
    }

    if (lastName.replace(/\s/g, '').length > 0) {
      this.setState({ ErrorLastName: false });
    } else {
      this.setState({ ErrorLastName: true });
    }
    return !ErrorLastName;
  };

  confirmStreetAddress = streetAddress => {
    const { ErrorStreetAddress } = this.state;
    let { address1: street } = this.state;
    const {
      shop: {
        checkout: { billingInfo }
      }
    } = this.props;

    if (typeof streetAddress === 'string') {
      street = streetAddress;
    }

    if (street.replace(/\s/g, '').length > 0) {
      this.setState({ ErrorStreetAddress: false });
      billingInfo.setStreet(street);
    } else {
      this.setState({ ErrorStreetAddress: true });
    }

    return !ErrorStreetAddress;
  };

  confirmCityAddress = cityAddress => {
    const { ErrorCityAddress } = this.state;
    let { city } = this.state;
    const {
      shop: {
        checkout: { billingInfo }
      }
    } = this.props;

    if (typeof cityAddress === 'string') {
      city = cityAddress;
    }

    if (city.replace(/\s/g, '').length > 0) {
      this.setState({ ErrorCityAddress: false });
      billingInfo.setCity(city);
    } else {
      this.setState({ ErrorCityAddress: true });
    }

    return !ErrorCityAddress;
  };

  confirmStateAddress = prov => {
    const { ErrorStateAddress } = this.state;
    let { state_or_province: state } = this.state;
    const {
      shop: {
        checkout: { billingInfo }
      }
    } = this.props;

    if (typeof prov === 'string') {
      state = prov;
    }

    // checks for letters
    const cityRegEx = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
    if (state.length > 0 && state.match(cityRegEx) !== null) {
      this.setState({ ErrorStateAddress: false });
      billingInfo.setState(state);
    } else {
      this.setState({ ErrorStateAddress: true });
    }
    return !ErrorStateAddress;
  };

  prepopulateForm = billingInfo => {
    this.setState({
      first_name: billingInfo.first_name,
      last_name: billingInfo.last_name,
      address1: billingInfo.address1,
      address2: billingInfo.address2,
      city: billingInfo.city,
      state_or_province: billingInfo.state_or_province,
      state_or_province_code: billingInfo.state_or_province_code,
      postal_code: billingInfo.postal_code
    });
  };

  confirmZipAddress = () => {
    const {
      state: { postal_code: zip, ErrorZipAddress }
    } = this;
    const {
      shop: {
        checkout: { billingInfo }
      }
    } = this.props;

    // must be five digits - four digits
    const zipRegEx = /^\d{5}(?:[-\s]\d{4})?$/;

    if (zip.replace(/\s/g, '').length > 0 && zip.match(zipRegEx) !== null) {
      this.setState({ ErrorZipAddress: false });
      billingInfo.setZip(zip);
    } else {
      this.setState({ ErrorZipAddress: true });
    }

    return !ErrorZipAddress;
  };

  async submitBillingInfo(info) {
    const { sameAsBilling } = this.state;
    const {
      history,
      shop: { checkout }
    } = this.props;

    const billingInfo = await checkout.addBillingInfo(info)
    if (billingInfo) {
      cookies.set('sameAsBilling', { sameAsBilling }, { path: '/' });
      const nextStep = checkout.checkoutStepTracker.setPaymentInfoComplete();
      history.push(`${nextStep}`);
    }

  }

  formErrors() {
    this.confirmFirstName();
    this.confirmLastName();
    this.confirmStreetAddress();
    this.confirmCityAddress();
    this.confirmStateAddress();
    this.confirmZipAddress();
  }

  validateForm() {
    return (
      this.confirmFirstName() &&
      this.confirmLastName() &&
      this.confirmStreetAddress() &&
      this.confirmCityAddress() &&
      this.confirmStateAddress() &&
      this.confirmZipAddress()
    );
  }

  render() {
    const {
      shop,
      shop: { checkout },
      location
    } = this.props;

    const { props, state } = this;
    const {
      checkout: { checkoutStepTracker },
      checkout: { billingInfo },
      payment
    } = props.shop;

    let index = -1;
    // if notSameAsBilling is set, check to seee if MST info is set to state
    if (
      cookies.get('sameAsBilling') &&
      cookies.get('sameAsBilling').sameAsBilling === 'no'
    ) {
      index = statesEnums.findIndex(
        stateEnumn =>
          stateEnumn.label === checkout.billingInfo.state_or_province
      );
      // if MST has firstName, and if shippingInfo has a firstname set, then the state should have all shipping data
      if (billingInfo.first_name && !state.prefilled) {
        // populate it
        this.prepopulateForm(checkout.billingInfo);
        this.setState({
          prefilled: true
        });
        index = statesEnums.findIndex(
          stateEnumn =>
            stateEnumn.label === checkout.billingInfo.state_or_province
        );
      }
    }

    if (location.pathname === '/billing') {

      if (payment.paymentError) {
        window.scrollTo(0, 500)
      }
      return (
        <div className="checkout-steps">
          <StripeProvider apiKey={shop.stripeAPIkey}>
            <Elements>
              <Payment fontSize="17" />
            </Elements>
          </StripeProvider>
          <div className="columns">
            <div className="column">
              <p className="has-text-weight-bold"> Billing Address </p>
            </div>
            {(!state.sameAsBilling && state.ErrorFirstName ||
              state.ErrorLastName ||
              state.ErrorEmail ||
              state.ErrorStreetAddress ||
              state.ErrorCityAddress ||
              state.ErrorStateAddress ||
              state.ErrorZipAddress ||
              state.ErrorPhone) && (
                <div className="column">
                  <p className="error error-message has-text-right-tablet">
                    Please complete the highlighted areas below.
                  </p>
                </div>
              )}
          </div>
          <label className="checkbox is-flex" htmlFor="sameAsBilling">
            <input
              type="checkbox"
              className="checkbox"
              value="sameAsBilling"
              id="sameAsBilling"
              checked={state.sameAsBilling}
              onChange={this.handleCheckBox}
            />
            Billing address same as shipping
          </label>

          <div className="checkout">
            {!state.sameAsBilling && (
              <form className="billing-form">
                <div className="field">
                  <label className="label" htmlFor="first_name">
                    First Name
                    <div className="control has-icons-right">
                      <input
                        id="first_name"
                        className={
                          state.ErrorFirstName ? 'input is-danger' : 'input'
                        }
                        type="text"
                        value={state.first_name}
                        onChange={e =>
                          this.handleChange(e, this.confirmFirstName)
                        }
                        onBlur={this.confirmFirstName}
                        required
                      />
                      {state.ErrorFirstName && (
                        <span className="icon is-small is-right">
                          {/* <i className="fas fa-exclamation-triangle" /> */}
                        </span>
                      )}
                    </div>
                    {state.ErrorFirstName && (
                      <p className="error is-danger">We need your information here.</p>
                    )}
                  </label>
                </div>

                <div className="field">
                  <label className="label" htmlFor="last_name">
                    Last Name
                    <div className="control has-icons-right">
                      <input
                        id="last_name"
                        className={
                          state.ErrorLastName ? 'input is-danger' : 'input'
                        }
                        type="text"
                        value={state.last_name}
                        onChange={e =>
                          this.handleChange(e, this.confirmLastName)
                        }
                        onBlur={this.confirmLastName}
                        required
                      />
                      {state.ErrorLastName && (
                        <span className="icon is-small is-right">
                          {/* <i className="fas fa-exclamation-triangle" /> */}
                        </span>
                      )}
                    </div>
                    {state.ErrorLastName && (
                      <p className="error is-danger">We need your information here.</p>
                    )}
                  </label>
                </div>

                <div className="field">
                  <label className="label" htmlFor="address1">
                    Address
                    <div className="control has-icons-right">
                      <input
                        id="address1"
                        className={`input ${
                          state.ErrorStreetAddress ? 'is-danger' : ''
                          }`}
                        type="text"
                        value={state.address1}
                        onChange={e =>
                          this.handleChange(e, this.confirmStreetAddress)
                        }
                        onBlur={this.confirmStreetAddress}
                        required
                      />
                      {state.ErrorStreetAddress && (
                        <span className="icon is-small is-right">
                          {/* <i className="fas fa-exclamation-triangle" /> */}
                        </span>
                      )}
                    </div>
                    {state.ErrorStreetAddress && (
                      <p className="error is-danger">We need your information here.</p>
                    )}
                  </label>
                </div>
                <div className="field">
                  <label className="label" htmlFor="address2">
                    Apt Number
                    <div className="control has-icons-right short">
                      <input
                        id="address2"
                        className="input short"
                        type="text"
                        placeholder="Optional"
                        value={state.address2}
                        onChange={this.handleChange}
                      />
                    </div>
                  </label>
                </div>
                <div className="field">
                  <label className="label" htmlFor="city">
                    City
                    <div className="control has-icons-right short">
                      <input
                        id="city"
                        className={`input short ${
                          state.ErrorCityAddress ? 'is-danger' : ''
                          }`}
                        type="text"
                        value={state.city}
                        onChange={e =>
                          this.handleChange(e, this.confirmCityAddress)
                        }
                        onBlur={this.confirmCityAddress}
                        required
                      />
                      {state.ErrorCityAddress && (
                        <span className="icon is-small is-right">
                          {/* <i className="fas fa-exclamation-triangle" /> */}
                        </span>
                      )}
                    </div>
                    {state.ErrorCityAddress && (
                      <p className="error is-danger">We need your information here.</p>
                    )}
                  </label>
                </div>
                <div className="field">
                  <span className="label">
                    State
                    <div className="control has-icons-right short">
                      <Select
                        id="state_or_province"
                        className={`select-state-input short  ${
                          state.ErrorStateAddress ? 'is-danger' : ''
                          }`}
                        options={statesEnums}
                        onChange={e =>
                          this.handleStateChange(e, this.confirmStateAddress)
                        }
                        type="text"
                        defaultValue={statesEnums[index]}
                        isSearchable
                        required
                      />
                      {state.ErrorStateAddress && (
                        <span className="icon is-small is-right">
                          {/* <i className="fas fa-exclamation-triangle" /> */}
                        </span>
                      )}
                    </div>
                  </span>
                  {state.ErrorStateAddress && (
                    <p className="error is-danger">We need your information here.</p>
                  )}
                </div>
                <div className="field">
                  <label className="label" htmlFor="postal_code">
                    ZIP
                    <div className="control has-icons-right short">
                      <input
                        id="postal_code"
                        className={`input short ${
                          state.ErrorZipAddress ? 'is-danger' : ''
                          }`}
                        type="tel"
                        value={state.postal_code}
                        onChange={this.handleChange}
                        onBlur={this.confirmZipAddress}
                        required
                      />
                      {state.ErrorZipAddress && (
                        <span className="icon is-small is-right">
                          {/* <i className="fas fa-exclamation-triangle" /> */}
                        </span>
                      )}
                      {state.ErrorZipAddress && state.postal_code === '' && (
                        <p className="error is-danger">We need your information here.</p>
                      )}
                      {state.ErrorZipAddress && state.postal_code !== '' && (
                        <p className="error is-danger">
                          Hmm, this doesn’t seem right. Enter the right information here.
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              </form>
            )}
            <div className="field has-text-centered-mobile">
              <button
                className={
                  (!payment.creditCardReady ||
                    (!state.sameAsBilling &&
                      (state.ErrorFirstName ||
                        state.ErrorLastName ||
                        state.ErrorEmail ||
                        state.ErrorStreetAddress ||
                        state.ErrorCityAddress ||
                        state.ErrorStateAddress ||
                        state.state_or_province === '' ||
                        state.ErrorZipAddress ||
                        state.ErrorPhone)))
                    ? "button disabled-btn disabled-cta" : "button primary-btn cta"
                }
                type="submit"
                onClick={this.handleSubmit}
                disabled={
                  !payment.creditCardReady ||
                  (!state.sameAsBilling &&
                    (state.ErrorFirstName ||
                      state.ErrorLastName ||
                      state.ErrorEmail ||
                      state.ErrorStreetAddress ||
                      state.ErrorCityAddress ||
                      state.ErrorStateAddress ||
                      state.state_or_province === '' ||
                      state.ErrorZipAddress ||
                      state.ErrorPhone))
                }
              >
                Save and Continue
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="columns is-mobile checkout-steps">
        <div className="column is-8">
          <p className="has-text-weight-bold">Payment Method</p>
          {checkoutStepTracker.paymentInfoComplete && (
            <div>
              <PaymentCard />
              <div className="billing-step has-text-weight-bold">
                Billing Address
              </div>
              {billingInfo.first_name} {billingInfo.last_name}
              <br />
              {billingInfo.address1}
              <br />
              {billingInfo.address2 && (
                <div>
                  {billingInfo.address2}
                  <br />
                </div>
              )}
              <p>
                {billingInfo.city} {billingInfo.state_or_province}{' '}
                {billingInfo.postal_code}
              </p>
            </div>
          )}
        </div>
        <div className="column is-4 has-text-right">
          {checkoutStepTracker.paymentInfoComplete && (
            <Link to="/billing">
              Edit
            </Link>
          )}
        </div>
      </div>
    );
  }
}

export default ShippingInfo;
