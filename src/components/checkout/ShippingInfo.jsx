import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Cookies } from 'react-cookie';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import statesEnums from '../enum/States';

@inject('shop')
@observer
class ShippingInfo extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    location: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  constructor(props) {
    super(props);
    const {
      shop: {
        checkout: { shippingInfo }
      }
    } = this.props;
    this.state = {
      first_name: shippingInfo.first_name || '',
      last_name: shippingInfo.last_name || '',
      address1: shippingInfo.address1 || '',
      address2: shippingInfo.address2 || '',
      city: shippingInfo.city || '',
      state_or_province: shippingInfo.state_or_province || '',
      state_or_province_code: shippingInfo.state_or_province_code || '',
      postal_code: shippingInfo.postal_code || '',
      phone: shippingInfo.phone || '',
      email: shippingInfo.email || '',
      prefilled: false,
      ErrorFirstName: false,
      ErrorLastName: false,
      ErrorEmail: false,
      ErrorStreetAddress: false,
      ErrorCityAddress: false,
      ErrorStateAddress: false,
      ErrorZipAddress: false,
      ErrorPhone: false
    };
  }

  // componentWillMount() {
  //   const { location } = this.props;
  //   window.PGdataLayer.page = {
  //     title: 'Shipping Info',
  //     url: location.pathname
  //   }
  //   window.dataLayer.push({ 'event': 'virtualPageview' })
  // }

  componentDidMount() {
    const {
      shop: { checkout }
    } = this.props;

    checkout.getCheckoutSummary();
  }

  prepopulateForm = shippingInfo => {
    this.setState({
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
    });
  };

  handleChange = (event, confirmerFunction) => {
    if (event.target.id === 'phone') {
      let phone = event.target.value;
      phone = phone.replace(/(\d{3})-?(\d{3})-?(\d{4})/, '$1-$2-$3');

      this.setState({
        [event.target.id]: phone
      });
    } else {
      this.setState({
        [event.target.id]: event.target.value
      });
      if (confirmerFunction) {
        confirmerFunction(event.target.value);
      }
    }
  };

  handleStateChange = (event, confirmStateAddress) => {
    this.setState({
      state_or_province: event.label,
      state_or_province_code: event.value,
    });
    confirmStateAddress(event.label, event.value);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { state_or_province: state } = this.state;

    this.formErrors();

    if (this.validateForm() && state !== '') {
      this.submitShippingInfo()
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

  confirmPhone = () => {
    const {
      state: { phone, ErrorPhone }
    } = this;
    const phoneRegEx = /^\d{3}-\d{3}-\d{4}$/;

    if (phone.length > 0) {
      if (phone.match(phoneRegEx) !== null) {
        this.setState({ ErrorPhone: false });
      } else {
        this.setState({ ErrorPhone: true });
      }
    } else {
      this.setState({
        ErrorPhone: false
      });
    }

    return !ErrorPhone;
  };

  confirmStreetAddress = streetAddress => {
    const { ErrorStreetAddress } = this.state;
    let { address1: street } = this.state;

    if (typeof streetAddress === 'string') {
      street = streetAddress;
    }

    if (street.replace(/\s/g, '').length > 0) {
      this.setState({ ErrorStreetAddress: false });
    } else {
      this.setState({ ErrorStreetAddress: true });
    }

    return !ErrorStreetAddress;
  };

  confirmCityAddress = (cityAddress) => {
    const { ErrorCityAddress } = this.state;
    let { city } = this.state;

    if (typeof cityAddress === 'string') {
      city = cityAddress;
    }

    // checks for letters
    // const cityRegEx = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
    if (city.replace(/\s/g, '').length > 0) {
      // if (city.length > 0 && city.match(cityRegEx) !== null) {
      this.setState({ ErrorCityAddress: false });
    } else {
      this.setState({ ErrorCityAddress: true });
    }

    return !ErrorCityAddress;
  };

  confirmStateAddress = (prov) => {
    const { ErrorStateAddress } = this.state;
    let { state_or_province: state } = this.state;

    if (typeof prov === 'string') {
      state = prov;
    }

    if (state.replace(/\s/g, '').length > 0) {
      this.setState({ ErrorStateAddress: false });
    } else {
      this.setState({ ErrorStateAddress: true });
    }
    return !ErrorStateAddress;
  };

  confirmZipAddress = () => {
    const {
      state: { postal_code: zip, ErrorZipAddress }
    } = this;
    // must be five digits - four digits
    const zipRegEx = /^\d{5}(?:[-\s]\d{4})?$/;

    if (zip.replace(/\s/g, '').length > 0 && zip.match(zipRegEx) !== null) {
      this.setState({ ErrorZipAddress: false });
    } else {
      this.setState({ ErrorZipAddress: true });
    }

    return !ErrorZipAddress;
  };

  async submitShippingInfo() {
    const { history, shop } = this.props;

    const shipping = await shop.checkout.addShippingInfo(this.state);
    if (shipping) {
      const nextStep = shop.checkout.checkoutStepTracker.setShippingInfoComplete();
      history.push(`${nextStep}`);
    }
  }

  formErrors() {
    this.confirmFirstName();
    this.confirmLastName();
    this.confirmEmail();
    this.confirmPhone();
    this.confirmStreetAddress();
    this.confirmCityAddress();
    this.confirmStateAddress();
    this.confirmZipAddress();
  }

  validateForm() {
    return (
      this.confirmFirstName() &&
      this.confirmLastName() &&
      this.confirmEmail() &&
      this.confirmPhone() &&
      this.confirmStreetAddress() &&
      this.confirmCityAddress() &&
      this.confirmStateAddress() &&
      this.confirmZipAddress()
    );
  }

  render() {
    const {
      shop: { checkout },
      location
    } = this.props;
    const { state } = this;

    // creating a cookie to see if consignmentId is set
    const cookies = new Cookies();

    let index = -1;
    // if consignmentId is set, check to seee if MST info is set to state
    if (cookies.get('consignmentId')) {
      // if consignmentID, and if shippingInfo has a firstname set, then the state should have all shipping data
      index = statesEnums.findIndex(
        stateEnumn =>
          stateEnumn.label === checkout.shippingInfo.state_or_province
      );
      if (checkout.shippingInfo.first_name && !state.prefilled) {
        // if not, populate it
        this.prepopulateForm(checkout.shippingInfo);
        this.setState({
          prefilled: true
        });
        index = statesEnums.findIndex(
          stateEnumn =>
            stateEnumn.label === checkout.shippingInfo.state_or_province
        );
      }
    }

    if (location.pathname === '/checkout') {
      return (
        <div className="checkout-steps">
          <div className="columns">
            <div className="column">
              <p className="has-text-weight-bold">Shipping Info</p>
            </div>
            {(state.ErrorFirstName ||
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
          <div className="checkout">
            <form onSubmit={this.handleSubmit}>
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
                      defaultValue={state.last_name}
                      onChange={e => this.handleChange(e, this.confirmLastName)}
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
                <label className="label" htmlFor="email">
                  Email Address
                  <div className="control has-icons-right">
                    <input
                      id="email"
                      className={state.ErrorEmail ? 'input is-danger' : 'input'}
                      type="email"
                      defaultValue={state.email}
                      onChange={this.handleChange}
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
                    <p className="error is-danger">We need your information here.</p>
                  )}
                  {state.ErrorEmail && state.email !== '' && (
                    <p className="error is-danger">
                      Hmm, this doesn’t seem right. Enter the right information here.
                    </p>
                  )}
                </label>
              </div>

              <div className="field">
                <label className="label" htmlFor="phone">
                  Phone Number
                  {state.ErrorPhone && (
                    <p className="error is-danger">
                      Hmm, this doesn’t seem right. Enter the right information here.
                    </p>
                  )}
                  <div className="control has-icons-right short">
                    <input
                      id="phone"
                      className={`short input 
                                  ${state.ErrorPhone ? ' is-danger' : ''}
                                `}
                      type="tel"
                      placeholder="Optional"
                      defaultValue={state.phone}
                      onChange={this.handleChange}
                      onBlur={this.confirmPhone}
                    />
                    {state.ErrorPhone && (
                      <span className="icon is-small is-right">
                        {/* <i className="fas fa-exclamation-triangle" /> */}
                      </span>
                    )}
                  </div>
                  {state.ErrorPhone && state.phone !== '' && (
                    <p className="error is-danger">
                      Please enter a valid ten digit phone number
                    </p>
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
                      defaultValue={state.address1}
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
                      defaultValue={state.address2}
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
                      defaultValue={state.city}
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
                    // theme={(theme) => ({
                    //   ...theme,
                    //   borderRadius: 0,
                    //   colors: {
                    //     // ...theme.czolors,
                    //     primary25: '#DEEBFF',
                    //     // primary: '#002C73',
                    //   }
                    // })}
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
                      defaultValue={state.postal_code}
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

              <div className="field has-text-centered-mobile">
                <button
                  className={
                    state.ErrorFirstName ||
                      state.ErrorLastName ||
                      state.ErrorEmail ||
                      state.ErrorStreetAddress ||
                      state.ErrorCityAddress ||
                      state.ErrorStateAddress ||
                      state.state_or_province === '' ||
                      state.ErrorZipAddress ||
                      state.ErrorPhone
                      ? "button disabled-btn disabled-cta" : "button primary-btn cta"
                  }
                  type="submit"
                  disabled={
                    state.ErrorFirstName ||
                    state.ErrorLastName ||
                    state.ErrorEmail ||
                    state.ErrorStreetAddress ||
                    state.ErrorCityAddress ||
                    state.ErrorStateAddress ||
                    state.state_or_province === '' ||
                    state.ErrorZipAddress ||
                    state.ErrorPhone
                  }
                >
                  Save and Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }

    const {
      shop: {
        checkout: { shippingInfo }
      }
    } = this.props;
    return (
      <div className="columns is-mobile checkout-steps">
        <div className="column is-8">
          <p className="has-text-weight-bold">Shipping Info</p>
          {shippingInfo.first_name} {shippingInfo.last_name}
          <br />
          {shippingInfo.address1}
          <br />
          {shippingInfo.address2 && (
            <div>
              {shippingInfo.address2}
              <br />
            </div>
          )}
          <p>
            {shippingInfo.city} {shippingInfo.state_or_province}{' '}
            {shippingInfo.postal_code}
          </p>
          {shippingInfo.email} <br />
          <p> {shippingInfo.phone} </p>
        </div>
        <div className="column is-4 has-text-right">
          <Link to="/checkout">
            Edit
          </Link>
        </div>
      </div>
    );
  }
}

export default ShippingInfo;
