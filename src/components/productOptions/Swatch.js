import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('shop')
@observer
class Swatch extends Component {
  static propTypes = {
    formErrorMsg: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    option: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    getIndex: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    checkInStock: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    optionValueName: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    handleOnChange: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      formErrorMsg,
      option,
      getIndex,
      checkInStock,
      optionValueName,
      handleOnChange
    } = this.props;
    return (
      <div className={option.display_name}>
        {formErrorMsg ? (
          <span>
            <b>{option.display_name}:</b>{' '}
            <i className="help is-danger">{formErrorMsg}</i>
          </span>
        ) : (
          <span>
            <b>{option.display_name}:</b> {optionValueName}
          </span>
        )}
        <div className="field is-grouped is-grouped-multiline">
          {option.option_values.map(value => (
            <p className="control">
              <button
                type="button"
                className={
                  optionValueName === value.label
                    ? 'button selected-border'
                    : 'button'
                }
                style={{ backgroundColor: value.value_data.colors[0] }}
                name={`optionValueId${getIndex}`}
                id={value.label}
                value={value.id}
                disabled={checkInStock(value.id)}
                onClick={e =>
                  handleOnChange(
                    e,
                    `optionValueName${getIndex}`,
                    `optionErrorMsg${getIndex}`
                  )
                }
              >
                {checkInStock(value.id) && <div className="line2" />}
              </button>
            </p>
          ))}
        </div>
      </div>
    );
  }
}

export default Swatch;
