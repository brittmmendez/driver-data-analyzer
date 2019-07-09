import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('shop')
@observer
class CustomerSupportErrorPage extends Component {
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
      <div className="customer-support-error-page has-text-left has-text-centered-mobile">
        <section className="section content container">
          <div className="customer-support-msg">
            <div className="support-msg">
              <div className="columns">
                <div className="column">
                  <h2 className="has-text-white">
                    {customerSupport.customerSupportTitle}
                  </h2>
                  <p className="has-text-white">
                    {customerSupport.customerSupportMessaging}
                  </p>
                </div>

                <div className="column has-text-right ">
                  <div className="desktop-view ">
                    <div className="">
                      <a
                        className="primary-btn button"
                        href={customerSupport.customerSupportCtaCallButtonUrl}
                      >
                        <span>
                          {
                            customerSupport.customerSupportCtaCallButtonMobileText
                          }
                        </span>
                      </a>
                    </div>
                    <div className="">
                      <a
                        className="primary-btn button"
                        href={customerSupport.customerSupportCtaEmailButtonUrl}
                      >
                        <span>
                          {
                            customerSupport.customerSupportCtaEmailButtonMobileText
                          }
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default CustomerSupportErrorPage;
