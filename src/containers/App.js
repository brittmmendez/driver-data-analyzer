import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { CloudinaryContext } from 'cloudinary-react';
import { Cookies } from 'react-cookie';
import Routes from './Routes';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const cookies = new Cookies();

@inject('shop')
@observer
class App extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop,
      shop: { cloudinaryId }
    } = this.props;

    // setting email for klaviyo tracking
    const CRMoptIn = cookies.get('CRMoptIn');

    if (CRMoptIn) {
      if (CRMoptIn.email) {
        shop.user.setEmail(CRMoptIn.email)
      }
    }

    return (
      <Router>
        <div id="top">
          <CloudinaryContext cloudName={cloudinaryId}>
            <NavBar />
            <Routes />
            <Footer />
          </CloudinaryContext>
        </div>
      </Router>
    );
  }
}
export default App;
