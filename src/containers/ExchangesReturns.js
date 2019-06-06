import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import CustomerSupportBox from '../components/CustomerSupportBox';
import LoadingView from '../components/LoadingView';

@inject('shop')
@observer
class ExchangesReturns extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    match: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  componentWillMount() {
    const { match } = this.props;
    window.PGdataLayer.page = {
      title: 'Returns and Exchanges',
      url: match.path
    }
    window.dataLayer.push({ 'event': 'virtualPageview' })
  }

  componentDidMount() {
    const { shop } = this.props;

    if (shop.exchangePage.returnExchangeTitle === "") {
      shop.contentful.getExchangePageContent();
    }
  }

  render() {
    const { shop: { exchangePage } } = this.props;
    return (
      exchangePage.returnExchangeTitle === '' ?
        <LoadingView />
        :
        <div className=" exchange-page container content">
          <div className="columns">
            <div className="column">
              {exchangePage.accepted ?
                <section className="section">
                  <h2>{exchangePage.returnExchangeTitle}</h2>
                  <p><Markdown source={exchangePage.returnExchangeDescription} /></p>
                  <h3 className="section-title">{exchangePage.returnSubtitle}</h3>
                  <Markdown source={exchangePage.returnDescription} />
                  <h3 className="section-title">{exchangePage.exchangeSubtitle}</h3>
                  <Markdown source={exchangePage.exchangeDescription} />
                </section>
                :
                <div className="exchange-page">
                  <h2 className="exchange-title">{exchangePage.returnExchangeTitle}</h2>
                  <Markdown source={exchangePage.returnExchangeDescription} />
                </div>}
            </div>
            <div className="column support-column">
              <section className="section">
                <CustomerSupportBox />
              </section>
            </div>
          </div>
        </div>
    );
  }
}

export default ExchangesReturns;
