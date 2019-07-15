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
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
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
    const {
      shop: { crmSignup }
    } = this.props;
    if (!crmSignup.signupCompleted) {
      if (document.body.clientWidth > 709 && window.scrollY > 1000) {
        console.log('trigger reached');
        crmSignup.setSignupModal(true);
        document.removeEventListener('scroll', this.trackScrolling);
      }

      if (document.body.clientWidth <= 709 && window.scrollY > 2000) {
        console.log('trigger reached');
        crmSignup.setSignupModal(true);
        document.removeEventListener('scroll', this.trackScrolling);
      }
    }
  };

  render() {
    const {
      shop: { crmSignup }
    } = this.props;

    return (
      <div>
        <Helmet>
          <meta property="og:type" content="website" />
          <meta property="og:url" content={process.env.REACT_APP_URL} />
          <meta property="og:title" content="Mon Amie" />
          <meta property="og:description" content="Brand Description" />
          <meta
            property="og:image"
            content="http://res.cloudinary.com/alcmy/image/fetch/c_scale,dpr_auto,f_auto,q_auto,w_550/https://images.ctfassets.net/dx8s2zoelme1/5K5hbkXaqDNW17XouobaJA/a0a8ff9c48bbe8987e706674b665dc41/placeholder3.jpg"
          />
        </Helmet>
        <div className="landing-page">
          {crmSignup.signupFormSuccess && crmSignup.viaSignupModal && (
            <ThankYouModal />
          )}
          {crmSignup.signupFormError && <ErrorModal />}
          {crmSignup.signupModal && <SignupModal />}
          <SpotLight />
          <Benefits />
          <SpotlightStat />
          <ProductGrouping />
          {/* <CustomerSupport /> */}
          <Signup />
        </div>
      </div>
    );
  }
}

export default LandingPage;
