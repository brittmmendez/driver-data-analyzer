import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Signup from '../components/signupComponent/Signup';
import QnA from '../components/faq/QnA';
import QnAMobile from '../components/faq/QnAMobile';
import CustomerSupportBox from '../components/CustomerSupportBox';

@inject('shop')
@observer
class FAQs extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    match: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  componentWillMount() {
    const { match } = this.props;
    window.PGdataLayer.page = {
      title: 'FAQs',
      url: match.path
    }
    window.dataLayer.push({ 'event': 'virtualPageview' })
  }

  componentDidMount() {
    const { shop } = this.props;
    shop.contentful.getFAQEntryGroup();
  }

  render() {
    return (
      <div className="faq-page">
        <div className="container content">
          <div className="columns">
            <div className="column">
              <div className="is-hidden-mobile">
                <QnA />
              </div>
              <div className="is-hidden-tablet">
                <QnAMobile />
              </div>
            </div>
            <div className="column support-column">
              <section className="section">
                <CustomerSupportBox />
              </section>
            </div>
          </div>
        </div>

        <Signup />

      </div>
    );
  }
}

export default FAQs;
