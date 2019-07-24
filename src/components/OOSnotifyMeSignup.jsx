import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

@inject('shop')
@observer
class OOSnotifyMeSignup extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    handleSignupSuccess: PropTypes.func.isRequired, // eslint-disable-line react/forbid-prop-types
    optionValueName1: PropTypes.string.isRequired, // eslint-disable-line react/forbid-prop-types
    optionValueName2: PropTypes.string.isRequired, // eslint-disable-line react/forbid-prop-types
    optionValueName3: PropTypes.string.isRequired, // eslint-disable-line react/forbid-prop-types
    product: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      ErrorEmail: false
    };
  }

  setKlaviyoTrigger() {
    const { email } = this.state
    const {
      optionValueName1,
      optionValueName2,
      optionValueName3,
      product } = this.props

    if (window._learnq) {

      window._learnq.push(['identify', {
        '$email': email,
      }]);
      const info = {
        ProductName: product.name,
        ProductID: product.id,
        ImageURL: product.thumbnail_url,
        URL: window.location.href,
        Brand: 'WeAreBB',
        Price: product.price,
        Options: [
          optionValueName1,
          optionValueName2,
          optionValueName3,
        ]
      };

      window._learnq.push(['track', 'Notify Me When in Stock ', info]);
    }
  }


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

  handleSubmit = event => {
    event.preventDefault();

    const { state_or_province: state } = this.state;

    this.formErrors();

    if (this.validateForm() && state !== '') {
      this.submitNotifyMeInfo();
    }
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

  async submitNotifyMeInfo() {
    const { shop, shop: { crmSignup }, handleSignupSuccess } = this.props;
    const { email } = this.state

    // submit notify me call to klaviyo
    const url = `${shop.apiUrl}/emailSignup`;
    const data = { email };

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${shop.user.guestToken}`
        }
      });

      const content = await response;
      if (content.status === 200) {
        // Go into mobx state tree and set form completed to true
        crmSignup.setSignupFormSuccess(true);
        cookies.set(
          'CRMoptIn',
          {
            CRMoptIn: true,
            email
          },
          { path: '/' }
        );

      } else {
        console.log('error')
      }

    } catch (err) {
      // Go into mobx state tree and set form error to true
      console.log('error')
    }

    this.setKlaviyoTrigger()
    this.trackOOSnotificationGA()

    handleSignupSuccess();
  }

  // GA track
  trackOOSnotificationGA() {
    console.log('tracking ga');
    const { location,
      product,
      optionValueName1,
      optionValueName2,
      optionValueName3 } = this.props;
    const { email } = this.state

    window.PGdataLayer.page = {
      title: 'Signed up for OOS notification',
      url: location.pathname
    }
    window.dataLayer.push({
      event: 'customEvent',
      GAeventCategory: 'event_bin_action',
      GAeventAction: 'event_out_of_stock',
      GAeventNonInteraction: false,
      GAeventLabel: `${product.id}`,
      GAeventValue: {
        optionValueName1,
        optionValueName2,
        optionValueName3,
        email
      },
    })
  }

  formErrors() {
    this.confirmEmail();
  }

  validateForm() {
    return this.confirmEmail();
  }

  render() {
    const { state } = this;

    return (
      <div className="checkout">
        <form onSubmit={this.handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="email">
              <div className="control has-icons-right">
                <input
                  id="email"
                  className={state.ErrorEmail ? 'input is-danger' : 'input'}
                  type="email"
                  placeholder="Email"
                  defaultValue={state.email}
                  onChange={this.handleChange}
                  onBlur={this.confirmEmail}
                  required
                />
              </div>
              {state.ErrorEmail && state.email === '' && (
                <p className="error is-danger">
                  We need your information here.
                </p>
              )}
              {state.ErrorEmail && state.email !== '' && (
                <p className="error is-danger">
                  Hmm, this doesn’t seem right. Enter the right information
                  here.
                </p>
              )}
            </label>
          </div>

          <div className="field has-text-centered-mobile">
            <button
              className={
                state.ErrorEmail || state.email === ''
                  ? 'button disabled-btn-oos-modal notify-me-cta'
                  : 'button primary-btn notify-me-cta'
              }
              type="submit"
              disabled={state.ErrorEmail || state.email === ''}
            >
              <span>NOTIFY ME</span>
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default OOSnotifyMeSignup;
