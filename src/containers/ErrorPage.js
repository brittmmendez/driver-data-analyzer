import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import { Image, Transformation } from 'cloudinary-react';
// import CustomerSupport from '../components/landingPage/CustomerSupport';
import CustomerSupportErrorPage from '../components/CustomerSupportErrorPage';

@inject('shop')
@observer
class ErrorPage extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    errorTitle: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    errorMsg: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    hideErrorMsg: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    errorType: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    refreshBtn: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    match: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  constructor(props) {
    super(props);
    this.state = {
      errorTitle: "We're sorry, we couldn't find this page.",
      errorMsg:
        'This page has either been removed, renamed or is unavailable. We hope to resolve this issue soon! In the meantime, feel free to explore other parts of our site or contact our customer support.',
      hideErrorMsg: false,
      refreshBtn: false
    };
  }

  // componentWillMount() {
  //   const { match } = this.props;
  //   window.PGdataLayer.page = {
  //     title: 'Error',
  //     url: match.path
  //   }
  //   window.dataLayer.push({ 'event': 'virtualPageview' })
  // }

  componentDidMount() {
    const {
      errorTitle,
      errorMsg,
      hideErrorMsg,
      errorType,
      refreshBtn
    } = this.props;

    errorTitle && this.setState({ errorTitle });
    errorMsg && this.setState({ errorMsg });
    hideErrorMsg && this.setState({ hideErrorMsg });
    refreshBtn && this.setState({ refreshBtn });
    errorType && this.setState({ errorType });
  }

  getErrorImg(type) {
    const {
      shop: { contentful }
    } = this.props;
    switch (type) {
      case 'confirmation':
        return contentful.errorCantShowConf;
      case 'order':
        return contentful.errorCantPlaceOrder;
      case 'load':
        return contentful.errorCantLoad;
      case 'product':
        return contentful.errorCantFindProduct;
      default:
        return contentful.error404;
    }
  }

  reloadPage() {
    window.location.reload();
  }

  render() {
    const {
      errorTitle,
      errorMsg,
      hideErrorMsg,
      errorType,
      refreshBtn
    } = this.state;
    return (
      <div className="error-page">
        <div className="container content body has-text-centered">
          <img
            src={this.getErrorImg(errorType)}
            alt="error-img"
            className="error-img"
          />
          <h2 className="error-title"> {errorTitle} </h2>

          {!hideErrorMsg && <div className="error-msg"> {errorMsg} </div>}

          {!refreshBtn ? (
            <div className="columns error-btn-container">
              <div className="column">
                <Link to="/#top">
                  <button type="button" className="primary-btn error-btn">
                    {' '}
                    <span>Go to Homepage</span>
                  </button>
                </Link>
              </div>
              <div className="column">
                <Link to="/products-page#top">
                  <button
                    type="button"
                    aria-label="shop"
                    className="primary-btn error-btn"
                  >
                    {' '}
                    <span>Shop Products</span>
                  </button>
                </Link>
              </div>
              {/* <div className="column">
                <Link to="/faq#top">
                  <button type="button" className="primary-btn error-btn"> <span>Read Our FAQs</span></button>
                </Link>
              </div> */}
            </div>
          ) : (
            <button
              type="submit"
              className="refresh-btn"
              onClick={this.reloadPage}
            >
              {' '}
              Refresh page{' '}
            </button>
          )}
        </div>
        <CustomerSupportErrorPage />
      </div>
    );
  }
}

export default ErrorPage;
