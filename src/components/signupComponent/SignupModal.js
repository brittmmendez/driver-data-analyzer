/* eslint-disable */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import FormikSignup from './FormikSignup';
import X from '../../static/images/svg/X.svg';

@inject('shop')
@observer
class SignupModal extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: { crmSignup }
    } = this.props;
    return (
      <React.Fragment>
        <div className="content signup-modal">
          <div className={crmSignup.signupModal ? 'modal is-active' : 'modal'}>
            <div
              className="modal-background"
              type="button"
              onClick={() => crmSignup.setSignupModal(false)}
            />
            <div className="modal-card">
              <section className="modal-card-body">
                <span
                  role="button"
                  tabIndex="0"
                  className="icon close-icon"
                  onClick={() => crmSignup.setSignupModal(false)}
                  onKeyPress={() => crmSignup.setSignupModal(false)}
                >
                  <img src={X} alt="close-icon" className="close" />
                </span>
                {/* <img
                  className="close"
                  src={X}
                  aria-label="close"
                /> */}
                <div>
                  <h3 className="has-text-center">
                    {crmSignup.signupHeadline}
                  </h3>
                  {/* <p className="has-text-left has-text-white form-msg">
                    {crmSignup.signupDescription}
                  </p> */}
                </div>
                <FormikSignup viaModal />
              </section>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SignupModal;
