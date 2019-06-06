import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { HashLink as Link } from 'react-router-hash-link';
import PropTypes from 'prop-types';
// import Banner from './Banner';
import { Image, Transformation } from 'cloudinary-react';
import CartQuantIndic from './CartQuantIndic';
import Phone from '../static/images/svg/Phone.svg';

@inject('shop')
@observer
class NavBarCheckout extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: {
        contentful,
        landingPage: { customerSupport }
      }
    } = this.props;
    return (
      <div className="is-fixed-top">
        {/* <Banner /> */}
        <nav className="navbar nav-checkout" role="navigation">
          <div className="container">
            <div className="navbar-brand">
              <Link className="navbar-item mobile-main-logo" to="/#top">
                <Image
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
                    maxWidth="500"
                    height="218"
                  />
                </Image>
              </Link>
            </div>

            <div className="navbar-end pull-right">
              <a
                href={customerSupport.customerSupportCtaCallButtonUrl}
                className="navbar-item"
              >
                <img src={Phone} alt="phone" className="phone" />{customerSupport.customerSupportCtaCallButtonText}
              </a>
              <Link className="navbar-item event_view_cart my-cart-link" data-cy="my-cart" to="/my-cart#top">
                <span className="icon">
                  <CartQuantIndic />
                </span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default NavBarCheckout;
