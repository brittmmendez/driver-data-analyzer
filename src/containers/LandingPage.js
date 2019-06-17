import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Helmet } from 'react-helmet';
import { Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import SpotLight from '../components/landingPage/Spotlight';
import SpotlightStat from '../components/landingPage/SpotlightStat';
import Benefits from '../components/landingPage/Benefits';
import CustomerSupport from '../components/landingPage/CustomerSupport';
import ProductGrouping from '../components/landingPage/ProductGrouping';
import Signup from '../components/signupComponent/Signup';
import SignupModal from '../components/signupComponent/SignupModal';
import ThankYouModal from '../components/signupComponent/ThankYouModal';
import ErrorModal from '../components/signupComponent/ErrorModal';

const cookies = new Cookies();

@inject('shop')
@observer
class LandingPage extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  componentDidMount() {
    const CRMsignup = cookies.get('CRMsignup');
    if (!CRMsignup) {
      document.addEventListener('scroll', this.trackScrolling);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
  }

  trackScrolling = () => {
    const { shop: { crmSignup } } = this.props
    if (!crmSignup.signupCompleted) {
      if (document.body.clientWidth > 709 && window.scrollY > 1000) {
        console.log('trigger reached');
        crmSignup.setSignupModal(true)
        document.removeEventListener('scroll', this.trackScrolling);
      }

      if (document.body.clientWidth <= 709 && window.scrollY > 2000) {
        console.log('trigger reached');
        crmSignup.setSignupModal(true)
        document.removeEventListener('scroll', this.trackScrolling);
      }
    }
  };

  render() {
    return (
      <div>
        <Helmet>
          <meta property="og:type" content="website" />
          <meta property="og:url" content={process.env.REACT_APP_URL} />
          <meta property="og:title" content="Uplift" />
          <meta
            property="og:description"
            content="Uplift, the first bladder support to provide comfortable, invisible protection, so you can work out harder, longer, drier."
          />
          <meta property='og:image' content="http://res.cloudinary.com/alchemy-jdb/image/fetch/c_scale,dpr_auto,f_auto,q_auto,w_550/https://images.ctfassets.net/sv54axkydx8f/DtpxuvruCpbhhU35qVtzQ/3d24fdcc36fe6af1f63b36a0b624dab8/Spotlight.png" />
        </Helmet>
        <div className="landing-page">
          <ThankYouModal />
          <ErrorModal />
          <SignupModal />
          <SpotLight />
          <Benefits />
          <SpotlightStat />
          <ProductGrouping />
          <CustomerSupport />
          <Signup />
        </div>
      </div>
    );
  }
}

export default LandingPage;
