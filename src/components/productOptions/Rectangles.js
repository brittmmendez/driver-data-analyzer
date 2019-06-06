import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';

@inject('shop')
@observer
class Rectangles extends Component {
  static propTypes = {
    formErrorMsg: PropTypes.string.isRequired, // eslint-disable-line react/forbid-prop-types
    option: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    getIndex: PropTypes.number.isRequired, // eslint-disable-line react/forbid-prop-types
    checkInStock: PropTypes.func.isRequired, // eslint-disable-line react/forbid-prop-types
    optionValueName: PropTypes.string.isRequired, // eslint-disable-line react/forbid-prop-types
    handleOnChange: PropTypes.func.isRequired // eslint-disable-line react/forbid-prop-types
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
            <p className="control" key={value.id}>
              <button
                type="button"
                className={
                  optionValueName === value.label
                    ? 'button selected-border'
                    : 'button'
                }
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
                {checkInStock(value.id) && <div className="line1" />}
                {value.label}
              </button>
            </p>
          ))}
        </div>
        {/* <Link to="/">
          What’s my {option.display_name.toLowerCase()}?
        </Link> */}
      </div>
    );
  }
}

export default Rectangles;
