import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import FooterCheckout from './FooterCheckout';

@inject('shop')
@observer
class Footer extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    location: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      location: { pathname },
      shop: {
        contentful,
        cart,
        landingPage: { customerSupport }
      }
    } = this.props;

    if (
      [
        '/checkout',
        '/shipping',
        '/billing',
        '/billing',
        '/terms-and-conditions',
        '/review-order'
      ].find(path => path === pathname)
    ) {
      return <FooterCheckout pathname={pathname} />;
    }

    return (
      <footer
        className={
          pathname === '/products-page/119' ||
            (pathname === '/my-cart' && cart.itemCount)
            ? 'footer extra-margin-bottom'
            : 'footer'
        }
      >
        <div className="container">
          <div className="columns content">
            <div className="column is-4">
              <div className="column">
                <Link to="/#top">
                  <img
                    className="footer-logo-img"
                    src={contentful.upliftLogo}
                    alt="Uplift-logo"
                  />
                </Link>
              </div>
            </div>
            <div className="column">
              <div className="columns">
                <div className="column">
                  <p className="footer-header topic is-hidden-mobile">Shop</p>
                  <p>
                    <Link
                      to="/products-page/119#top"
                      className="event_view_product_detail_page"
                    >
                      {' '}
                      Product Name{' '}
                    </Link>
                  </p>
                </div>
                <div className="column">
                  <p className="footer-header topic is-hidden-mobile">
                    Help & FAQs
                  </p>
                  <p>
                    <Link to="/exchanges-returns#top">
                      {' '}
                      Returns & Exchanges{' '}
                    </Link>
                  </p>
                  <p>
                    <Link to="/faq#top"> FAQs </Link>
                  </p>
                </div>
                <div className="column">
                  <p className="footer-header topic is-hidden-mobile">
                    Customer Support
                  </p>
                  <p>
                    <a href={customerSupport.customerSupportCtaCallButtonUrl}>
                      {customerSupport.customerSupportCtaCallButtonText}
                    </a>
                  </p>
                  <p>
                    <a href={customerSupport.customerSupportCtaEmailButtonUrl}>
                      {customerSupport.customerSupportCtaEmailButtonText}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container info-center">
          <a
            href="https://www.pg.com/en_US/terms_conditions/"
            target="_blank"
            rel="noopener noreferrer"
            className="info"
          >
            Terms & Conditions
          </a>
          <a
            href="https://www.pg.com/privacy/english/privacy_statement.shtml"
            target="_blank"
            rel="noopener noreferrer"
            className="info"
          >
            Privacy
          </a>
          <p className="is-hidden-tablet mobile-padding" />
          <a
            className="info"
            href="https://info.evidon.com/pub_info/8875?v=1&nt=0&nw=false"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="//c.betrad.com/pub/icon1.png" alt="Ad Choices Icon" />{' '}
            AdChoices
          </a>
          <Link to="/site-map#top" className="info">
            {' '}
            Site Map
          </Link>
          <p className="is-hidden-tablet mobile-padding" />
          <span className="info">
            <i className="far fa-copyright" /> 2019 Procter & Gamble
          </span>
        </div>
      </footer>
    );
  }
}

export default withRouter(Footer);
