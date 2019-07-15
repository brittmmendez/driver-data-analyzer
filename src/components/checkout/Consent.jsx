import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { Link } from 'react-router-dom';
import X from '../../static/images/svg/X.svg';
import CheckmarkInCircle from '../../static/images/svg/CheckmarkInCircle.svg';

@inject('shop')
@observer
export default class Consent extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    location: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  constructor(props) {
    super(props);
    this.state = {
      modalClass: false,
      firstName: '',
      option1: false,
      lastName: '',
      ErrorFirstName: false,
      ErrorLastName: false
    };
  }

  handleModalToggle = () => {
    const { modalClass } = this.state;
    const {
      shop: { checkout }
    } = this.props;

    // if modal class is closed track in Klaviyo that it is now open and user started consent
    if (
      !modalClass &&
      !checkout.checkoutStepTracker.consentComplete &&
      window._learnq
    ) {
      window._learnq.push(['track', 'Consent Form Opened']);
    }

    this.setState({
      modalClass: modalClass === 'is-active' ? '' : 'is-active'
    });
  };

  startKlaviyoTracker = () => {
    const {
      shop: { checkout }
    } = this.props;

    // track in Klaviyo that user finished payment and it now on consent page
    if (!checkout.checkoutStepTracker.consentComplete && window._learnq) {
      window._learnq.push([
        'identify',
        {
          $email: checkout.shippingInfo.email
        }
      ]);
    }
  };

  handleFirstClick = event => {
    this.setState({
      option1: event.target.checked
    });
  };

  handleFirstNameChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    this.confirmFirstName(event.target.value);
  };

  handleLastNameChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    this.confirmLastName(event.target.value);
  };

  confirmFirstName = name => {
    const { ErrorFirstName } = this.state;
    let { firstName } = this.state;
    const {
      shop: {
        checkout: { shippingInfo }
      }
    } = this.props;

    if (typeof name === 'string') {
      firstName = name;
    }

    if (
      firstName.toLowerCase() !== shippingInfo.first_name.toLowerCase() &&
      firstName !== ''
    ) {
      this.setState({
        ErrorFirstName: 'First name must match shipping information.'
      });
    } else if (firstName.length > 0) {
      this.setState({ ErrorFirstName: false });
    } else {
      this.setState({ ErrorFirstName: 'We need your info here.' });
    }
    return !ErrorFirstName;
  };

  confirmLastName = name => {
    const { ErrorLastName } = this.state;
    let { lastName } = this.state;
    const {
      shop: {
        checkout: { shippingInfo }
      }
    } = this.props;

    if (typeof name === 'string') {
      lastName = name;
    }

    if (
      lastName.toLowerCase() !== shippingInfo.last_name.toLowerCase() &&
      lastName !== ''
    ) {
      this.setState({
        ErrorLastName: 'Last name must match shipping information.'
      });
    } else if (lastName.length > 0) {
      this.setState({ ErrorLastName: false });
    } else {
      this.setState({ ErrorLastName: 'We need your info here.' });
    }

    return !ErrorLastName;
  };

  async handleSubmit() {
    const { history } = this.props;
    const { shop } = this.props;
    const { firstName, lastName } = this.state;
    if (this.validateForm()) {
      const consentComplete = await shop.checkout.checkoutStepTracker.setConsentComplete(
        firstName,
        lastName,
        shop.checkout.shippingInfo.email,
        shop.consentCopy.consentLegalNumber,
        shop.consentCopy.consentFormSubHeader,
        shop.consentCopy.consentFormBody
      );
      if (consentComplete) {
        // track in Klaviyo that user finished consent form
        window._learnq.push(['track', 'Consent Form Completed']);

        history.push(`${consentComplete}`);
      }
    }
  }

  formErrors() {
    this.confirmFirstName();
    this.confirmLastName();
  }

  validateForm() {
    return this.confirmFirstName() && this.confirmLastName();
  }

  render() {
    const {
      shop: { checkout, consentCopy },
      location
    } = this.props;
    const {
      modalClass,
      ErrorFirstName,
      firstName,
      option1,
      lastName,
      ErrorLastName
    } = this.state;
    if (location.pathname === '/terms-and-conditions') {
      this.startKlaviyoTracker();
      return (
        <div className="consent checkout-steps">
          <p className="has-text-weight-bold">Terms and Conditions</p>
          <p style={{ marginBottom: '0px' }}>
            {' '}
            Please read and accept the Terms and Conditions before placing your
            order.
          </p>
          <button
            type="button"
            aria-label="consent-form"
            className="primary-btn open-terms-btn"
            onClick={() => this.handleModalToggle()}
          >
            <span>Read Terms & Conditions</span>
          </button>

          <div className={`modal ${modalClass}`}>
            <div
              className="modal-background"
              role="button"
              tabIndex="0"
              onClick={() => this.handleModalToggle()}
              onKeyPress={() => this.handleModalToggle()}
            />

            <div className="modal-card">
              <section className="modal-card-body has-text-centered">
                <div>
                  <span
                    role="button"
                    tabIndex="0"
                    className="icon pull-right"
                    onClick={() => this.handleModalToggle()}
                    onKeyPress={() => this.handleModalToggle()}
                  >
                    <img src={X} alt="close-icon" className="close-icon" />
                  </span>

                  <div className="consent-body has-text-left">
                    <div className="columns is-mobile">
                      <div className="column">
                        <h2 className="is-marginless">
                          {consentCopy.consentFormTitle}
                        </h2>
                      </div>
                      <div className="column has-text-right">
                        <p className="has-text-weight-bold">
                          {consentCopy.consentLegalNumber}
                        </p>
                      </div>
                    </div>

                    <Markdown source={consentCopy.consentFormSubHeader} />

                    <Markdown
                      className="consent-directions"
                      source={consentCopy.consentFormBody}
                    />
                    <br />
                    <Markdown
                      className="consent-directions"
                      source={consentCopy.checkoutConsentFormDescription}
                    />

                    <div className="has-text-left">
                      <form className="consent-form">
                        <div className="control">
                          <div className="columns is-marginless is-mobile">
                            <label className="checkbox" htmlFor="option1">
                              <input
                                name="option1"
                                type="checkbox"
                                checked={option1}
                                className="checkbox"
                                onChange={this.handleFirstClick}
                              />
                            </label>
                            <div className="column">
                              <div className="has-text-left sub-text checkbox-text">
                                {consentCopy.consetnAgreeOption}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="columns name-form">
                          <div className="column">
                            <div className="field">
                              <label className="label" htmlFor="firstName">
                                First Name
                                <div className="control has-icons-right">
                                  <input
                                    id="firstName"
                                    className={
                                      ErrorFirstName
                                        ? 'input is-danger'
                                        : 'input'
                                    }
                                    type="text"
                                    value={firstName}
                                    onChange={e =>
                                      this.handleFirstNameChange(e)
                                    }
                                    onBlur={this.confirmFirstName}
                                    required
                                  />
                                </div>
                                {ErrorFirstName && (
                                  <p className="error is-danger">
                                    {ErrorFirstName}
                                  </p>
                                )}
                              </label>
                            </div>
                          </div>
                          <div className="column">
                            <div className="field">
                              <label className="label" htmlFor="lastName">
                                Last Name
                                <div className="control has-icons-right">
                                  <input
                                    id="lastName"
                                    className={
                                      ErrorLastName
                                        ? 'input is-danger'
                                        : 'input'
                                    }
                                    type="text"
                                    value={lastName}
                                    onChange={e => this.handleLastNameChange(e)}
                                    onBlur={this.confirmLastName}
                                    required
                                  />
                                </div>
                                {ErrorLastName && (
                                  <p className="error is-danger">
                                    {ErrorLastName}
                                  </p>
                                )}
                              </label>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <button
                    type="submit"
                    aria-label="consent-form"
                    className={
                      ErrorFirstName ||
                      ErrorLastName ||
                      firstName === '' ||
                      lastName === '' ||
                      !option1
                        ? 'button disabled-btn terms-btn'
                        : 'button primary-btn terms-btn'
                    }
                    disabled={firstName === '' || lastName === '' || !option1}
                    onClick={() => this.handleSubmit()}
                  >
                    <span>Save & Continue</span>
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="columns is-mobile checkout-steps">
        <div className="column is-8">
          <p className="has-text-weight-bold">Terms and Conditions</p>
          {checkout.checkoutStepTracker.consentComplete && (
            <div className="consent-complete">
              <div className="circle-icon">
                <img src={CheckmarkInCircle} alt="circle-icon" />
              </div>
              <div className="circle-icon-text">
                You have accepted the terms and conditions.
              </div>
            </div>
          )}
        </div>
        <div className="column is-4 has-text-right">
          {checkout.checkoutStepTracker.consentComplete && (
            <Link to="/terms-and-conditions">Edit</Link>
          )}
        </div>
      </div>
    );
  }
}
