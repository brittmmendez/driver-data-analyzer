import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('shop')
@observer
class OOSnotifyMeSignup extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    handleSignupSuccess: PropTypes.func.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      ErrorEmail: false,
    };
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

  handleSubmit = (event) => {
    event.preventDefault();

    const { state_or_province: state } = this.state;

    this.formErrors();

    if (this.validateForm() && state !== '') {
      this.submitNotifyMeInfo()
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
    const { shop, handleSignupSuccess } = this.props;
    // submit notify me call to klaviyo 
    // const res = await shop.checkout.addShippingInfo(this.state);

    handleSignupSuccess()
    // if success, close toggle
    // if (res) {
    // handleSuccess
    // }
  }

  formErrors() {
    this.confirmEmail();
  }

  validateForm() {
    return (
      this.confirmEmail()
    );
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
                <p className="error is-danger">We need your information here.</p>
              )}
              {state.ErrorEmail && state.email !== '' && (
                <p className="error is-danger">
                  Hmm, this doesn’t seem right. Enter the right information here.
                    </p>
              )}
            </label>
          </div>

          <div className="field has-text-centered-mobile">
            <button
              className={
                state.ErrorEmail || state.email === ''
                  ? "button disabled-btn notify-me-cta" : "button primary-btn notify-me-cta"
              }
              type="submit"
              disabled={
                state.ErrorEmail || state.email === ''
              }
            >
              NOTIFY ME
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default OOSnotifyMeSignup;
