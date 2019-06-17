import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import MDSpinner from 'react-md-spinner';

@inject('shop')
@observer
class LoadingView extends Component {
  render() {
    return (
      <div className="global-loader has-text-centered is-vcentered">
        <MDSpinner
          size={100}
          color1="#D3D3D3"
          color2="#A9A9A9"
          color3="#808080"
          color4="#696969"
          duration={2000}
        />
      </div>
    );
  }
}

export default LoadingView;
