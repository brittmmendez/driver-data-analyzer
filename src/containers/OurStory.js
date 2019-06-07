import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import OurStorySpotlight from '../components/ourStory/OurStorySpotlight';
import LoadingView from '../components/LoadingView';

@inject('shop')
@observer
class OurStory extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const { shop } = this.props;
    return shop.ourStorySpotlight.title === '' ? (
      <LoadingView />
    ) : (
      <div className="about-page">
        <div className="container content">
          <OurStorySpotlight />
        </div>
      </div>
    );
  }
}

export default OurStory;
