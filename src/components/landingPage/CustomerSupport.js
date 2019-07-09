import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('shop')
@observer
class CustomerSupport extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: {
        landingPage: { customerSupport }
      }
    } = this.props;
    return (
      <div className="customer-support has-text-centered">
        <section className="section content">
          <div className="customer-support">
            <div className="support-msg">
              <h2 className="has-text-centered-mobile">
                {customerSupport.customerSupportTitle}
              </h2>
              <p className="support-description">
                {customerSupport.customerSupportMessaging}
              </p>
              <div className="desktop-view">
                {/* <a
                  className="primary-btn button"
                  href={customerSupport.customerSupportCtaCallButtonUrl}
                >
                  <span>{customerSupport.customerSupportCtaCallButtonText}</span>
                </a> */}

                <a
                  className="primary-btn button"
                  href={customerSupport.customerSupportCtaEmailButtonUrl}
                >
                  <span>
                    {customerSupport.customerSupportCtaEmailButtonText}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default CustomerSupport;
