import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('shop')
@observer
class Sort extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  constructor() {
    super();
    this.state = {
      select: ''
    };
  }

  handleFocus = () => {
    this.setState({
      select: ''
    });
  };

  handleChange = event => {
    const { shop } = this.props;

    shop.products.updateFilter(event.target.value);
  };

  handleSortChange = event => {
    const { shop } = this.props;

    shop.products.updateSort(event.target.value);
  };

  handleClick = () => {
    const { shop } = this.props;

    shop.products.resetFilter();
  };

  render() {
    const { state } = this;
    const { shop } = this.props;

    return (
      <form className="form section">
        <div className="field is-horizontal">
          <div className="control is-expanded has-icons-left">
            <div className="select is-rounded is-primary">
              <span className="icon is-small is-left">
                <i className="fas fa-dollar-sign" />
              </span>
              <select
                onBlur={this.handleSortChange}
                onChange={this.handleSortChange}
              >
                <option value="" disabled selected>
                  Price
                </option>
                <option value="ascending">Low to High</option>
                <option value="decending">High to Low</option>
              </select>
            </div>
          </div>

          <div className="control is-expanded has-icons-left">
            <div className="select is-rounded is-primary">
              <select
                value={state.select}
                onBlur={this.handleFocus}
                onChange={this.handleChange}
              >
                <option value="" disabled>
                  Filter
                </option>
                <option id="Tampax" value="24">
                  Tampax
                </option>
                <option id="Always" value="25">
                  Always
                </option>
              </select>
            </div>
          </div>

          {shop.products.filter ? (
            <div className="tags are-large">
              <span className="tag is-rounded">
                {shop.products.filter}
                <button
                  className="delete"
                  type="button"
                  onClick={this.handleClick}
                />
              </span>
            </div>
          ) : (
            ''
          )}
        </div>
      </form>
    );
  }
}

export default Sort;
