import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import BrandSpotlight from '../components/aboutUs/BrandSpotlight';
import BrandTeam from '../components/aboutUs/BrandTeam';
import ParantCompany from '../components/aboutUs/ParantCompany';
import LoadingView from '../components/LoadingView';

@inject('shop')
@observer
class About extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  // componentDidMount() {
  //   const { shop } = this.props;

  //   if (shop.aboutPage.brandTeam.teamMember.length === 0) {
  //     shop.contentful.getAboutPageContent();
  //   }

  // }

  render() {
    const { shop } = this.props;
    return shop.aboutPage.brandTeam.teamMember.length === 0 ? (
      <LoadingView />
    ) : (
      <div className="about-page">
        <div className="container content">
          <BrandSpotlight />
          <BrandTeam />
          <ParantCompany />
        </div>
      </div>
    );
  }
}

export default About;
