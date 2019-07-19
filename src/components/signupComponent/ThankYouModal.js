/* eslint-disable */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import X from '../../static/images/svg/X.svg';

@inject('shop')
@observer
class ThankYouModal extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: { crmSignup }
    } = this.props;
    return (
      <div className="thank-you-modal content">
        <div
          className={
            crmSignup.signupFormSuccess && crmSignup.viaSignupModal
              ? 'modal is-active'
              : 'modal'
          }
        >
          <div
            className="modal-background"
            type="button"
            onClick={() => crmSignup.setSignupFormSuccess(false)}
          />
          <div className="modal-card">
            <section className="modal-card-body">
              <p className="modal-card-title" />
              <span
                role="button"
                tabIndex="0"
                className="icon close-icon"
                onClick={() => crmSignup.setSignupFormSuccess(false)}
                onKeyPress={() => crmSignup.setSignupFormSuccess(false)}
              >
                <img src={X} alt="close-icon" className="close" />
              </span>
              {/* <img
                className="close"
                src={X}
                aria-label="close"
              /> */}
              <div>
                <h1 className="has-text-centered">
                  {crmSignup.signupThankYouHeadline}
                </h1>
                <p className="has-text-left form-msg">
                  {crmSignup.signupThankYouDescription}
                </p>
              </div>
              <div className="has-text-centered">
                <button
                  className="primary-btn"
                  onClick={() => crmSignup.setSignupFormSuccess(false)}
                  aria-label="close"
                >
                  <span>{crmSignup.closeBtnText}</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default ThankYouModal;
