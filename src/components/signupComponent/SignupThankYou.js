import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('shop')
@observer
class SignupThankYou extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: { crmSignup }
    } = this.props;
    return (
      <div className="signup thank-you">
        <section className="section component">
          <div className=" columns content">
            <div className="column is-6 has-text-left">
              <div className="">
                <h1 className="section-title">
                  {crmSignup.signupThankYouHeadline}
                </h1>
              </div>
            </div>
            <div className="column signup-column is-6 has-text-left">
              <p className="has-text-left thank-you-msg">
                {crmSignup.signupThankYouDescription}
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default SignupThankYou;
