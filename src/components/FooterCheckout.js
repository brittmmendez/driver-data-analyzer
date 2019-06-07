import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { HashLink as Link } from 'react-router-hash-link';
import PropTypes from 'prop-types';
import { Image, Transformation } from 'cloudinary-react';

@inject('shop')
@observer
class FooterCheckout extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    pathname: PropTypes.string.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: {
        contentful,
        landingPage: { customerSupport }
      },
      pathname
    } = this.props;
    return (
      <div className="checkout">
        <footer className={pathname === "/review-order" ? "footer extra-margin-bottom" : "footer"}>
          <Image
            publicId={contentful.footerImgDesktop}
            alt={contentful.footerImgDesktop}
            className="footer-img is-hidden-mobile"
            type="fetch"
          >
            <Transformation
              quality="auto"
              dpr="auto"
              fetchFormat="auto"
              responsive
              crop="scale"
            />
          </Image>
          <Image
            publicId={contentful.footerImgMobile}
            alt={contentful.footerImgMobile}
            className="footer-img is-hidden-tablet"
            type="fetch"
          >
            <Transformation
              quality="auto"
              dpr="auto"
              fetchFormat="auto"
              responsive
              crop="scale"
            />
          </Image>
          <div className="container">
            <div className="columns content">
              <div className="column is-4 is-hidden-mobile">
                <div className="columns">
                  <div className="column">
                    <Link className="footer-logo-img is-hidden-mobile" to="/#top">
                      <Image
                        className="footer-logo-img"
                        publicId={contentful.upliftLogo}
                        alt={contentful.upliftLogo}
                        type="fetch"
                      >
                        <Transformation
                          quality="auto"
                          dpr="auto"
                          fetchFormat="auto"
                          responsive
                          crop="scale"
                        />
                      </Image>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="column is-8">
                <div className="columns">
                  <div className="column is-4 is-hidden-mobile" />

                  <div className="column is-4 is-hidden-mobile" />

                  <div className="column is-4">
                    <p className="footer-header topic"> Customer Support </p>
                    <p>
                      <a href={customerSupport.customerSupportCtaCallButtonUrl}>
                        {customerSupport.customerSupportCtaCallButtonText}
                      </a>
                    </p>
                    <p>
                      <a
                        href={customerSupport.customerSupportCtaEmailButtonUrl}
                      >
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
            <a className="info" href="https://info.evidon.com/pub_info/8875?v=1&nt=0&nw=false" target="_blank" rel="noopener noreferrer">
              <img src="//c.betrad.com/pub/icon1.png" alt="Ad Choices Icon" />  AdChoices
          </a>
            <Link to='/site-map#top' className="info"> Site Map</Link>
            <p className="is-hidden-tablet mobile-padding" />
            <span className="info">
              <i className="far fa-copyright" /> 2019 Procter & Gamble
          </span>
          </div>
        </footer>
      </div>
    );
  }
}

export default FooterCheckout;
