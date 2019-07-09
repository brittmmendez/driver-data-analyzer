/* eslint-disable no-restricted-globals */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { HashLink as Link } from 'react-router-hash-link';
import PropTypes from 'prop-types';
import { Image, Transformation } from 'cloudinary-react';
import X from '../static/images/svg/X.svg';

@inject('shop')
@observer
class CartItem extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    item: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  constructor(props) {
    super(props);

    const { quantity } = props.item;

    this.state = {
      modalClass: '',
      quantity
    };
  }

  handleModalToggle = () => {
    const { modalClass } = this.state;
    const { item } = this.props;

    this.setState({
      modalClass: modalClass === '' ? 'is-active' : ''
    });

    if (modalClass === 'is-active') {
      this.setState({
        quantity: item.quantity
      });
    }
  };

  handleRemoveFromCart = item => {
    const {
      shop: { cart }
    } = this.props;

    this.handleModalToggle();
    cart.removeFromCart(item);
  };

  handleLowerQuantity = item => {
    if (item.quantity > 1) {
      item.lowerCartQuantity();
      this.setState({
        quantity: item.quantity
      });
    } else if (item.quantity === 1) {
      this.handleModalToggle();
      this.setState({
        quantity: 0
      });
    }
  };

  handleAddQuantity = item => {
    item.addCartQuantity();
    this.setState({
      quantity: item.quantity
    });
  };

  handleInputChange = event => {
    if (event.target.value) {
      if (event.target.value > 0) {
        this.setState({
          [event.target.name]: parseInt(event.target.value, 10)
        });
      } else {
        this.setState({
          [event.target.name]: Math.abs(parseInt(event.target.value, 10))
        });
      }
    } else {
      this.setState({
        [event.target.name]: 0
      });
    }
  };

  handleOnBlur = () => {
    const { item } = this.props;
    const { quantity } = this.state;

    const input = parseInt(quantity, 10);
    if (input <= 0 || isNaN(input)) {
      this.handleModalToggle();
    } else if (input > item.quantity) {
      const change = input - item.quantity;
      item.addCartQuantity(change);
    } else if (input < item.quantity) {
      const change = item.quantity - input;
      item.lowerCartQuantity(change);
    }
  };

  render() {
    const { item } = this.props;

    const { modalClass, quantity } = this.state;

    return (
      <div className="cart-item">
        <div className="is-hidden-tablet quantity-border" />
        <article className="media">
          <Link to={`/products-page/${item.item}#top`}>
            <figure className="media-left item-picture event_view_product_detail_page">
              <Image
                publicId={item.thumbnail_url}
                alt={item.name}
                className="product-image"
                type="fetch"
              >
                <Transformation
                  quality="auto"
                  fetchFormat="auto"
                  dpr="auto"
                  responsive
                  crop="scale"
                  // width="130"
                  // height="130"
                />
              </Image>
            </figure>
          </Link>
          <div className="media-content">
            <Link to={`/products-page/${item.item}#top`}>
              <p className="product-name event_view_product_detail_page">
                <strong>{item.name}</strong>
              </p>
            </Link>
            <div className="columns">
              <div className="column item-datails-area">
                <div className="item-details variants">
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
                  <span className="quantity"> Quantity: {quantity} </span>
                </div>
                {item.sale_price === 0 ? (
                  <p className="item-details has-text-weight-bold">
                    ${item.price.toFixed(2)} each
                  </p>
                ) : (
                  <div className="item-details">
                    <s>${item.retail_price.toFixed(2)}</s>
                    <span className="has-text-weight-bold">
                      {'  '}${item.sale_price.toFixed(2)} each
                    </span>
                  </div>
                )}
              </div>
              <div className="column item-product-selector">
                <div className="field">
                  <div className="level-item is-inline quantity-selector">
                    <button
                      className="button event_update_quantity"
                      data-cy="decrease"
                      type="button"
                      onClick={() => this.handleLowerQuantity(item)}
                      disabled={item.quantity === 0}
                    >
                      <i className="fas fa-minus" />
                    </button>
                    <label className="label is-inline" htmlFor="quantity">
                      <span className="is-sr-only">Quantity</span>
                      <div className="control is-inline">
                        <input
                          id="quantity"
                          name="quantity"
                          className="input is-inline"
                          type="tel"
                          min="0"
                          value={quantity}
                          onChange={this.handleInputChange}
                          onBlur={this.handleOnBlur}
                        />
                      </div>
                    </label>
                    <button
                      className="button event_update_quantity"
                      data-cy="increase"
                      type="button"
                      onClick={() => this.handleAddQuantity(item)}
                    >
                      <i className="fas fa-plus" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="media-right has-text-right">
            <div
              className="close"
              role="button"
              tabIndex="0"
              onClick={() => this.handleModalToggle()}
              onKeyPress={() => this.handleModalToggle()}
            >
              Remove
              <span
                className="icon"
                data-cy="open-modal"
                // role="button"
                // tabIndex="0"
                // onClick={() => this.handleModalToggle()}
                // onKeyPress={() => this.handleModalToggle()}
              >
                <img src={X} alt="close-icon" className="close-icon" />
              </span>
            </div>
            <p className="item-product-total has-text-weight-bold">
              ${item.productTotal}
            </p>
          </div>
        </article>
        <div className={`modal ${modalClass}`}>
          <div
            className="modal-background"
            role="button"
            tabIndex="0"
            onClick={() => this.handleModalToggle()}
            onKeyPress={() => this.handleModalToggle()}
          />
          <div className="box has-text-centered">
            <div className="content is-expanded has-background-light-grey">
              <div className="modal-title">
                <h3>
                  Are you sure you'd like to remove {item.name} from your cart?
                </h3>
              </div>
              <span
                role="button"
                tabIndex="0"
                className="icon closes-btn"
                onClick={() => this.handleModalToggle()}
                onKeyPress={() => this.handleModalToggle()}
              >
                <img src={X} alt="close-icon" className="close-icon" />
              </span>
              <div className="columns is-mobile">
                <div className="column is-6 has-text-right">
                  <Image
                    publicId={item.thumbnail_url}
                    alt={item.name}
                    className="delete-item-img"
                    type="fetch"
                  >
                    <Transformation
                      quality="auto"
                      fetchFormat="auto"
                      dpr="auto"
                      responsive
                      crop="scale"
                      // width="93"
                      // height="93"
                    />
                  </Image>
                </div>
                <div className="column has-text-left">
                  <div className="delete-item-details">
                    <div className="delete-item-price">
                      {item.sale_price === 0 ? (
                        <h4 className="delete-item-price has-text-weight-bold">
                          ${item.price.toFixed(2)} each
                        </h4>
                      ) : (
                        <div className="delete-item-price">
                          <s>${item.retail_price.toFixed(2)}</s>
                          <span className="has-text-weight-bold">
                            {'  '}${item.sale_price.toFixed(2)} each
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="item-details variants">
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
                      <span>Quantity: {item.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="button primary-btn keep-cta"
                type="button"
                onClick={() => this.handleModalToggle()}
              >
                <span>No, keep item in cart</span>
              </button>
              <button
                className="button primary-btn remove-cta event_remove_from_cart"
                data-cy="remove"
                type="button"
                onClick={() => this.handleRemoveFromCart(item)}
              >
                <span>Yes, remove item</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CartItem;
