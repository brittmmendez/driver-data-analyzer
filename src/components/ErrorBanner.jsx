import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import Error from '../static/images/svg/Error.svg'
import X from '../static/images/svg/X.svg'

@inject('shop')
@observer
class ErrorBanner extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  reloadPage() {
    window.location.reload()
  }


  resetErrors = () => {
    const { shop } = this.props;
    shop.cart.resetAddToCartError()
    shop.checkout.resetErrors()
  }



  render() {

    return (
      <section className="error-banner">
        <div className="container">
          <span
            role="button"
            tabIndex="0"
            className="icon close-btn"
            data-cy="open-modal"
            onClick={this.resetErrors}
            onKeyPress={this.resetErrors}
          >
            <img src={X} alt="close-icon" className="close-icon" />
          </span>
          <div className="columns is-mobile">
            <div className="column is-1 has-text-right">
              <p className="warining-icon"><img src={Error} alt="close-icon" /></p>
            </div>
            <div className="column">
              <p className="error-msg"> Hmm, we got temporarily disconnected and we couldn’t complete your request. Please refresh the page and try again.
              <br />
                <span
                  className="refresh"
                  role="button"
                  tabIndex="0"
                  onClick={this.reloadPage}
                  onKeyPress={this.reloadPage}
                >
                  Refresh Page
            </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default ErrorBanner;