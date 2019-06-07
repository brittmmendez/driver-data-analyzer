import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('shop')
@observer
export default class PurchaseFormErrorMsg extends Component {
  static propTypes = {
    getErrorCount: PropTypes.number.isRequired, // eslint-disable-line react/forbid-prop-types
    className: PropTypes.string.isRequired, // eslint-disable-line react/forbid-prop-types
    optionErrorMsg1: PropTypes.string.isRequired, // eslint-disable-line react/forbid-prop-types
    optionErrorMsg2: PropTypes.string.isRequired, // eslint-disable-line react/forbid-prop-types
    optionErrorMsg3: PropTypes.string.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      getErrorCount,
      className,
      optionErrorMsg1,
      optionErrorMsg2,
      optionErrorMsg3,
    } = this.props;
    return (
      <i className={`help is-danger error-msg ${className}`}>
        {getErrorCount > 1 ? (
          'Please complete all required categories'
        ) : (
            <span>
              {optionErrorMsg1}
              {optionErrorMsg2}
              {optionErrorMsg3}
            </span>
          )}
      </i>
    );
  }
}
