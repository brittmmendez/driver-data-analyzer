import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('shop')
@observer
class CustomerSupportBox extends Component {
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
      <div className="customer-support-box container content">
        <div className="support-msg">
          <h3 className="has-text-left-mobile">
            {customerSupport.customerSupportTitle}
          </h3>
          <p className="has-text-left support-description">
            {customerSupport.customerSupportMessaging}
          </p>
          <div>
            <a
              className="primary-btn button"
              href={customerSupport.customerSupportCtaCallButtonUrl}
            >
              <span>
                {customerSupport.customerSupportCtaCallButtonMobileText}
              </span>
            </a>
          </div>
          <div>
            <a
              className="primary-btn button"
              href={customerSupport.customerSupportCtaEmailButtonUrl}
            >
              <span>
                {customerSupport.customerSupportCtaEmailButtonMobileText}
              </span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default CustomerSupportBox;
