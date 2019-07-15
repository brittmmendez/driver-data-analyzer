/* eslint-disable */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('shop')
@observer
class ErrorModal extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const { shop: { crmSignup } } = this.props;
    return (
      <div className="error-modal content">
        <div className={crmSignup.signupFormError ? 'modal is-active' : 'modal'}>
          <div
            className="modal-background"
            type="button"
            onClick={() => crmSignup.setSignupFormError(false)}
          />
          <div className="modal-card">
            <section className="modal-card-body">
              <p className="modal-card-title" />
              <div>
                <h1 className="has-text-left">
                  Oh no, we unfortunately got disconnected!
                </h1>
                <p className="has-text-left form-msg">
                  We're sorry, but it looks like we're unable to complete your
                  request at this time. Please wait a few minutes and try again.
                </p>
              </div>
              <div className="has-text-centered">
                <button
                  className="primary-btn"
                  onClick={() => crmSignup.setSignupFormError(false)}
                  aria-label="close"
                >
                  <span>CLOSE</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorModal;
