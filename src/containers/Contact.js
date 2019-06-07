import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import CustomerSupport from '../components/landingPage/CustomerSupport';
import Signup from '../components/signupComponent/Signup';

@inject('shop')
@observer
class Contact extends Component {
  render() {
    return (
      <div className="landing-page has-text-centered">
        <CustomerSupport />
        <Signup />
      </div>
    );
  }
}

export default Contact;
