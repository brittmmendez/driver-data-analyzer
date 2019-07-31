import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import X from '../../static/images/svg/X.svg';

@inject('shop')
@observer
class Rectangles extends Component {
  static propTypes = {
    formErrorMsg: PropTypes.string.isRequired, // eslint-disable-line react/forbid-prop-types
    option: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    productID: PropTypes.number.isRequired, // eslint-disable-line react/forbid-prop-types
    getIndex: PropTypes.number.isRequired, // eslint-disable-line react/forbid-prop-types
    checkInStock: PropTypes.func.isRequired, // eslint-disable-line react/forbid-prop-types
    optionValueName: PropTypes.string.isRequired, // eslint-disable-line react/forbid-prop-types
    handleOnChange: PropTypes.func.isRequired // eslint-disable-line react/forbid-prop-types
  };

  constructor(props) {
    super(props);

    this.state = {
      toggleSizeGuide: false
    };
  }

  toggleSizeGuide() {
    const { toggleSizeGuide } = this.state;
    this.setState({
      toggleSizeGuide: !toggleSizeGuide
    });
  }

  render() {
    const {
      formErrorMsg,
      option,
      getIndex,
      checkInStock,
      optionValueName,
      handleOnChange,
      productID,
      shop: { products }
    } = this.props;

    const { toggleSizeGuide } = this.state;

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
        <a
          onClick={() => this.toggleSizeGuide()}
          onKeyPress={() => this.toggleSizeGuide()}
        >
          What’s my {option.display_name.toLowerCase()}?
        </a>
        <div
          className={toggleSizeGuide ? 'modal is-active size-guide' : 'modal'}
        >
          <div
            role="button"
            tabIndex="0"
            className="modal-background"
            type="button"
            onClick={() => this.toggleSizeGuide()}
            onKeyPress={() => this.toggleSizeGuide()}
          />
          <div className="modal-card">
            <section className="modal-card-body">
              <img
                className="close"
                role="button"
                tabIndex="0"
                src={X}
                onClick={() => this.toggleSizeGuide()}
                onKeyPress={() => this.toggleSizeGuide()}
                aria-label="close"
                alt="close icon"
              />
              <div className="has-text-left">
                <Markdown source={products.getModalCopy(productID)} />
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default Rectangles;
