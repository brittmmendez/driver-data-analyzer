import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import FormikSignup from './FormikSignup';
import SignupThankYou from './SignupThankYou'

@inject('shop')
@observer
class Signup extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: { crmSignup },
    } = this.props;
    return (
      <div>
        {crmSignup.signupFormSuccess ? (
          <SignupThankYou />
        ) : (
            <div className="signup">
              <section className="section component">
                <div className=" columns content">
                  <div className="column is-6 has-text-left">
                    <div className="sign-up-msg has-text-white">
                      <h1 className="section-title has-text-white">
                        {crmSignup.signupHeadline}
                      </h1>
                      <p className="has-text-left has-text-white">
                        {crmSignup.signupDescription}
                      </p>
                    </div>
                  </div>
                  <div className="column signup-column is-6 has-text-left">
                    <FormikSignup />
                    <p className="has-text-left sub-text">
                      Sign me up to receive an email notification when the product
                    is ready for purchase. Click to read P&G{' '}
                      <a
                        href="https://www.pg.com/en_US/terms_conditions/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms and Conditions
                    </a>{' '}
                      and{' '}
                      <a
                        href="https://www.pg.com/privacy/english/privacy_statement.shtml"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy Policy
                    </a>
                      .{' '}
                    </p>
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
