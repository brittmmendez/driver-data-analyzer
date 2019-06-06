/* eslint-disable */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import PropTypes from 'prop-types';
import { Image, Transformation } from 'cloudinary-react';
// import FormikSearch from './FormikSearch';
// import Banner from './Banner';
import CartQuantIndic from './CartQuantIndic';
import NavBarCheckout from './NavBarCheckout';
import X from '../static/images/svg/X.svg';
import Hamburger from '../static/images/svg/Menu-Hamburger.svg';

@inject('shop')
@observer
class NavBar extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    location: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      isSearch: false,
      toggle: false
    };
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleOutsideClick);
  }

  handleOutsideClick = e => {
    const str = e.target.className;

    if (document.body.clientWidth > 1087) {
      if (!str.includes('sub-menu-link')) {
        this.closeToggle();
        return true;
      }
    }

    // only if mobile
    if (document.body.clientWidth <= 1087) {
      if (
        str.includes('mobile-menu-link') ||
        str.includes('arrow-down') ||
        str.includes('has-hover-border') ||
        str.includes('navbar-item') ||
        str.includes('navbar-item is-marginless-mobile border-bottom')
      ) {
        return true;
      }
      this.closeNav();
      return true;
    }
    return true;
  };

  // opens or closes burger for mobile
  toggleNav = () => {
    this.setState(prevState => ({
      isActive: !prevState.isActive
    }));
  };

  closeNav = () => {
    const { isActive } = this.state;

    isActive &&
      this.setState({
        isActive: false
      });

    this.closeToggle();
  };

  handleToggle = () => {
    const { toggle } = this.state;

    this.setState({
      toggle: !toggle
    });
  };

  closeToggle = () => {
    const { toggle } = this.state;

    toggle &&
      this.setState({
        toggle: false
      });
  };

  toggleSearch = () => {
    this.closeNav();

    this.setState(prevState => ({
      isSearch: !prevState.isSearch
    }));
  };

  render() {
    const {
      shop,
      shop: {
        landingPage: { spotlight },
        contentful },
      location: { pathname }
    } = this.props;
    const { isActive, toggle } = this.state;

    if (
      ['/checkout', '/shipping', '/billing', '/review-order'].find(
        path => path === pathname
      )
    ) {
      return <NavBarCheckout />;
    }
    return (
      <div
        className="is-fixed-top"
        onClick={() => this.closeToggle()}
        onKeyPress={() => this.closeToggle()}
      >
        {/* <Banner /> */}
        <nav className="navbar" role="navigation">
          <div className="container mobile">
            <div className="navbar-brand">
              <div
                role="button"
                className="navbar-burger burger is-marginless"
                data-target="navMenu"
                onClick={this.toggleNav}
                onKeyPress={this.toggleNav}
                tabIndex="0"
              >
                <img
                  src={Hamburger}
                  alt="mobile-menu"
                  className="mobile-burger"
                />
              </div>
              <span
                role="button"
                data-target="navMenu"
                onClick={this.toggleNav}
                onKeyPress={this.toggleNav}
                tabIndex="0"
                className="mobile-menu is-hidden-desktop"
              >
                MENU
                </span>
              <Link className="navbar-item mobile-main-logo" to="/#top">
                <Image
                  className="navBar-logo-img"
                  publicId={contentful.upliftLogo}
                  alt={contentful.upliftLogo}
                  type="fetch"
                >
                  <Transformation
                    responsive
                    crop="scale"
                  />
                </Image>
              </Link>
            </div>

            <div
              id="navMenu"
              className={isActive ? 'navbar-menu is-active' : 'navbar-menu'}
            >
              <div className="navbar-start">
                <span
                  role="button"
                  tabIndex="0"
                  className="icon close-btn pull-right is-hidden-desktop"
                  onClick={() => this.closeNav()}
                  onKeyPress={() => this.closeNav()}
                >
                  <img src={X} alt="close-icon" className="close-icon" />
                </span>

                <div className="is-hidden-desktop">
                  {/* <span
                    className=""
                    onClick={this.closeNav}
                    onKeyPress={this.closeNav}
                  >
                    <Link
                      className="navbar-item account-placeholder less-padding is-hidden-desktop"
                      to={shop.user.loggedIn ? '/account' : '/login'}
                    >
                      <i className="fas fa-user" /> Account
                    </Link>
                  </span> */}
                  <div className="account-placeholder navbar-item less-padding " />
                  <span
                    className=""
                    onClick={this.closeNav}
                    onKeyPress={this.closeNav}
                  >
                    <Link
                      className="navbar-item is-marginless-mobile event_view_product_detail_page"
                      to="/products-page/127#top"
                    >
                      <span className="has-hover-border"> SHOP</span>
                    </Link>
                  </span>

                  <span
                    className=""
                    onClick={this.closeNav}
                    onKeyPress={this.closeNav}
                  >
                    <Link
                      className="navbar-item is-marginless-mobile border-bottom"
                      to="/faq#top"
                    >
                      <span className="has-hover-border"> FAQs </span>
                    </Link>
                  </span>
                </div>


                <span
                  className="navbar-item is-hidden-touch"
                  onClick={this.closeNav}
                  onKeyPress={this.closeNav}
                >
                  <Link
                    className="has-hover-border event_view_product_detail_page"
                    to="/products-page/127#top"
                  >
                    SHOP
                    </Link>
                </span>

                <span
                  className="navbar-item is-hidden-touch"
                  onClick={this.closeNav}
                  onKeyPress={this.closeNav}
                >
                  <Link
                    className="has-hover-border"
                    to="/faq#top"
                  >
                    FAQs
                    </Link>
                </span>
              </div>
            </div>

            <div className="navbar-end pull-right">
              {/* <Link
                className="navbar-item is-hidden-touch"
                // to='/'
                to={shop.user.loggedIn ? '/account' : '/login'}
              >
                <span
                  onClick={this.closeNav}
                  onKeyPress={this.closeNav}
                >
                  <i className="fas fa-user" />
                </span>
              </Link> */}

              <span
                className="navbar-item event_view_cart"
                onClick={this.closeNav}
                onKeyPress={this.closeNav}
              >
                <Link data-cy="my-cart" to="/my-cart#top">
                  <CartQuantIndic />
                </Link>
              </span>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default withRouter(NavBar);
