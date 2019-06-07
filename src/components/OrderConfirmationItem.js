import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('shop')
@observer
class OrderConfirmationItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    className: PropTypes.string.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const { item, className } = this.props;

    return (
      <div className={className} key={item.id}>
        <article className="media">
          <figure className="media-left item-picture">
            <img
              src={item.thumbnail_url}
              alt="img"
              width="130px"
              height="130px"
            />
          </figure>
          <div className="media-content">
            <span className="product-name has-text-weight-bold">
              {item.name}
            </span>
            <div className="columns is-mobile">
              <div className="column variants-column">
                <div className="variants">
                  {item.option_values.length > 0 && (
                    <div>
                      {item.option_values.map(
                        optionValue =>
                          optionValue.label !== '' && (
                            <span key={optionValue.value}>
                              {optionValue.label}: {optionValue.value}
                            </span>
                          )
                      )}
                    </div>
                  )}
                  <span className="quantity"> Quantity: {item.quantity} </span>
                </div>
                <p className="item-price-summary">
                  ${item.price.toFixed(2)} each
                  </p>
              </div>
              <div className="column order-confirmation">
                <p className="item-total-price has-text-right has-text-weight-bold">
                  ${item.productTotal}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }
}

export default OrderConfirmationItem;
