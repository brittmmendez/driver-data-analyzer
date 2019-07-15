import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import FormikSignup from './FormikSignup';
import SignupThankYou from './SignupThankYou';

@inject('shop')
@observer
class Signup extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: { crmSignup }
    } = this.props;
    return (
      <div>
        {crmSignup.signupFormSuccess ? (
          <SignupThankYou />
        ) : (
          <div className="signup">
            <section className="section component">
              <div className="content">
                <div className="has-text-center">
                  <div className="sign-up-msg">
                    <h3 className="section-title has-text-center">
                      {crmSignup.signupHeadline}
                    </h3>
                    <p className="has-text-left">
                      {crmSignup.signupDescription}
                    </p>
                  </div>
                </div>
                <div className="signup-column has-text-left">
                  <FormikSignup />
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    );
  }
}

export default Signup;
