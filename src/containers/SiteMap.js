import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { HashLink as Link } from 'react-router-hash-link';
import CustomerSupportBox from '../components/CustomerSupportBox';

@inject('shop')
@observer
class SiteMap extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    match: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  componentWillMount() {
    const { match } = this.props;
    window.PGdataLayer.page = {
      title: 'Site Map',
      url: match.path
    }
    window.dataLayer.push({ 'event': 'virtualPageview' })
  }

  render() {
    const {
      shop: {
        landingPage: { customerSupport }
      }
    } = this.props;
    return (
      <div className="site-map-page">
        <div className="container content body">
          <h2 className="site-map-title"> Site Map</h2>
          <div className="columns main-column-padding-left is-multiline is-mobile">
            <div className="column is-3-desktop is-6-tablet is-12-mobile">
              <h3 className="section-title"> Shop</h3>
              <div className="columns">
                <div className="column no-padding-left-mobile">
                  <ul>
                    <li> <Link to="/products-page/127#top" className="event_view_product_detail_page">Uplift Bladder Support</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="column is-3-desktop is-6-tablet is-12-mobile">
              <h3 className="section-title"> Help & FAQs</h3>
              <div className="columns">
                <div className="column no-padding-left-mobile">
                  <ul>
                    <li> <Link to="/exchanges-returns#top">Returns and exchanges</Link></li>
                    <li> <Link to="/faq#top">FAQs</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="column  is-3-desktop is-6-tablet is-12-mobile">
              <h3 className="section-title"> Customer Support</h3>
              <ul className="less-margin-left">
                <li>
                  <a href={customerSupport.customerSupportCtaCallButtonUrl}>
                    {customerSupport.customerSupportCtaCallButtonText}
                  </a>
                </li>
                <li>
                  <a
                    href={customerSupport.customerSupportCtaEmailButtonUrl}
                  >
                    {customerSupport.customerSupportCtaEmailButtonText}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="is-hidden-tablet">
            <section className="section">
              <CustomerSupportBox />
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default SiteMap;
