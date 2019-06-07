import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import MDSpinner from "react-md-spinner";

@inject('shop')
@observer
class LoadingView extends Component {
  render() {

    return (
      <div className="global-loader has-text-centered is-vcentered">
        <MDSpinner size={100}
          color1="#A95AA3"
          color2="#614495"
          color3="#40465F"
          color4="#4FC5F2"
          duration={2000} />
      </div>
    )
  }
}

export default LoadingView;
