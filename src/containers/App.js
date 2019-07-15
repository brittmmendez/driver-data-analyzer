import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { CloudinaryContext } from 'cloudinary-react';
import Routes from './Routes';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

@inject('shop')
@observer
class App extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: { cloudinaryId }
    } = this.props;
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
