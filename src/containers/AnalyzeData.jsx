import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import FileUpload from '../components/FileUpload'
import DataFilter from '../components/DataFilter'

@inject('shop')
@observer
class AnalyzeData extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const { shop } = this.props
    return (
      <section className="section  has-text-centered">
        <div className="container">
          <div className="content">
            {!shop.drivers.length ?
              <FileUpload shop={shop} />
              :
              <DataFilter />
            }
          </div>
        </div>
      </section >
    );
  }
}
export default AnalyzeData;
