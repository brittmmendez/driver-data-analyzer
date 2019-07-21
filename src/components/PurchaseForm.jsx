/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react/no-unused-state */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { HashLink as Link } from 'react-router-hash-link';
import { Image, Transformation } from 'cloudinary-react';
import PurchaseFormErrorMsg from './PurchaseFormErrorMsg';
import OOSnotifyMeSignup from './OOSnotifyMeSignup';
import Swatch from './productOptions/Swatch';
import Rectangles from './productOptions/Rectangles';
import X from '../static/images/svg/X.svg';

@inject('shop')
@observer
export default class PurchaseForm extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    product: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    resetSlider: PropTypes.func.isRequired // eslint-disable-line react/forbid-prop-types
  };

  constructor(props) {
    super(props);
    const { product } = this.props;
    this.state = {
      modalClass: '',
      quantity: 1,
      modalQuantity: 1,
      optionDisplayName1: this.setOptionDisplayName(product.options[0]),
      optionDisplayName2: this.setOptionDisplayName(product.options[1]),
      optionDisplayName3: this.setOptionDisplayName(product.options[2]),
      optionValueId1: this.setOptionId(product.options[0]),
      optionValueName1: this.setOptionName(product.options[0]),
      optionErrorMsg1: '',
      optionValueId2: this.setOptionId(product.options[1]),
      optionValueName2: this.setOptionName(product.options[1]),
      optionErrorMsg2: '',
      optionValueId3: this.setOptionId(product.options[2]),
      optionValueName3: this.setOptionName(product.options[2]),
      optionErrorMsg3: '',
      vairantImg: this.setInitialImg(product),
      submitSuccess: false
    };
  }

  componentDidMount() {
    const { product } = this.props;
    const { state } = this;
    this.checkInStock();
    product.setVariantPrice(0);

    // resets state if default option is OOS
    if (product.options.length === 1) {
      if (product.findInOOSarray(state.optionValueId1)) {
        const getProduct = product.variants.find(v => v.inventory_level !== 0);
        this.setState(
          {
            optionValueId1: getProduct.values[0].id,
            optionValueName1: getProduct.values[0].label,
            // vairantImg: product.images[0].standard_url
            vairantImg: product.variants[1].image_url
          },
          function () {
            product.clearOOSarray();
            product.setVariantPrice(getProduct.price);
            this.checkInStock();
            // TODO -- need to figure out how to swap photo
          }
        );
      }
    }

    if (product.options.length === 2) {
      if (
        product.findInOOSarray(state.optionValueId1) &&
        product.findInOOSarray(state.optionValueId2)
      ) {
        const getProduct = product.variants.find(v => v.inventory_level !== 0);
        this.setState(
          {
            optionValueId1: getProduct.values[0].id,
            optionValueName1: getProduct.values[0].label,
            optionValueId2: getProduct.values[1].id,
            optionValueName2: getProduct.values[1].label,
            // vairantImg: product.images[0].standard_url
            vairantImg: product.variants[1].image_url
          },
          function () {
            product.clearOOSarray();
            this.checkInStock();
            // TODO -- need to figure out how to swap photo
          }
        );
      }
    }

    if (product.options.length === 3) {
      if (
        product.findInOOSarray(state.optionValueId1) &&
        product.findInOOSarray(state.optionValueId2) &&
        product.findInOOSarray(state.optionValueId3)
      ) {
        const getProduct = product.variants.find(v => v.inventory_level !== 0);
        this.setState(
          {
            optionValueId1: getProduct.values[0].id,
            optionValueName1: getProduct.values[0].label,
            optionValueId2: getProduct.values[1].id,
            optionValueName2: getProduct.values[1].label,
            optionValueId3: getProduct.values[2].id,
            optionValueName3: getProduct.values[2].label,
            // vairantImg: product.images[0].standard_url
            vairantImg: product.variants[1].image_url
          },
          function () {
            product.clearOOSarray();
            this.checkInStock();
            // TODO -- need to figure out how to swap photo
          }
        );
      }
    }
  }

  handleSignupSuccess = () => {
    this.setState({
      submitSuccess: true
    });
  };

  setOptionDisplayName = option => {
    if (option) {
      return option.display_name;
    }
    return null;
  };

  setInitialImg = product => {
    if (product.variants[0] && product.variants[0].image_url) {
      product.swapImg(product.variants[0].image_url);
      product.setSku(product.variants[0].sku);

      return product.variants[0].image_url;
    }
    return null;
  };

  setOptionId = option => {
    if (option) {
      const defaultValue = option.option_values.filter(
        op => op.is_default === true
      )[0];
      if (defaultValue) {
        return defaultValue.id;
      }
      if (option.type === 'swatch') {
        return option.option_values[0].id;
      }
    }
    return null;
  };

  setOptionName = option => {
    if (option) {
      const defaultValue = option.option_values.filter(
        op => op.is_default === true
      )[0];
      if (defaultValue) {
        return defaultValue.label;
      }
      if (option.type === 'swatch') {
        return option.option_values[0].label;
      }
    }
    return null;
  };

  getIndex = option => {
    const { product } = this.props;
    return product.options.indexOf(option) + 1;
  };

  checkInStock = () => {
    const { product } = this.props;
    const { state } = this;

    if (product.options.length === 1) {
      product.variants.map(variant => {
        if (variant.inventory_level === 0) {
          product.addToOOSarray(variant.values[0].id);
        }
      });
    }

    if (product.options.length === 2) {
      product.variants.map(variant => {
        // if you find the first option thats selected, and the sku is OOS
        // store the second optionValueId in an array that is used to checkInStock and disable that btn
        if (
          variant.values[0].id === state.optionValueId1 &&
          variant.inventory_level === 0
        ) {
          product.addToOOSarray(variant.values[1].id);
        }

        if (
          variant.values[1].id === state.optionValueId2 &&
          variant.inventory_level === 0
        ) {
          product.addToOOSarray(variant.values[0].id);
        }
      });
    }

    if (product.options.length === 3) {
      product.variants.map(variant => {
        // if you find the first 2 options that are selected, and the sku is OOS
        // store the third optionValueId in an array that is used to checkInStock and disable that btn
        if (
          variant.values[0].id === state.optionValueId1 &&
          variant.values[1].id === state.optionValueId2 &&
          variant.inventory_level === 0
        ) {
          product.addToOOSarray(variant.values[2].id);
        }

        // if you find the first and third options that are selected, and the sku is OOS
        // store the second optionValueId in an array that is used to checkInStock and disable that btn
        if (
          variant.values[0].id === state.optionValueId1 &&
          variant.values[2].id === state.optionValueId3 &&
          variant.inventory_level === 0
        ) {
          product.addToOOSarray(variant.values[1].id);
        }

        // if you find the last 2 options that are selected, and the sku is OOS
        // store the first optionValueId in an array that is used to checkInStock and disable that btn
        if (
          variant.values[1].id === state.optionValueId2 &&
          variant.values[2].id === state.optionValueId3 &&
          variant.inventory_level === 0
        ) {
          product.addToOOSarray(variant.values[0].id);
        }
      });
    }
  };

  getErrorCount = () => {
    const { optionErrorMsg1, optionErrorMsg2, optionErrorMsg3 } = this.state;
    return [optionErrorMsg1, optionErrorMsg2, optionErrorMsg3].filter(
      val => val !== ''
    ).length;
  };

  displayOptionValueName = option => {
    const { state } = this;
    const index = this.getIndex(option);

    switch (index) {
      case 1:
        return state.optionValueName1;
      case 2:
        return state.optionValueName2;
      default:
        return state.optionValueName3;
    }
  };

  displayErrorMsg = option => {
    const { state } = this;
    const index = this.getIndex(option);

    switch (index) {
      case 1:
        return state.optionErrorMsg1;
      case 2:
        return state.optionErrorMsg2;
      default:
        return state.optionErrorMsg3;
    }
  };

  handleOnChange = (event, valueName, formErrorNumber) => {
    const { product } = this.props;
    product.clearOOSarray();

    if (event && event.target.value) {
      if (event.target.value > 0) {
        this.setState(
          {
            [event.target.name]: parseInt(event.target.value, 10),
            [valueName]: event.target.id
          },
          function () {
            this.findVairant();
            this.checkInStock();
          }
        );
      }
    }

    this.removeError(formErrorNumber);
  };

  findVairant = () => {
    const { product } = this.props;
    const { state } = this;

    const variantImg = product.findByVariant(
      state.optionValueId1,
      state.optionValueId2,
      state.optionValueId3
    );
    if (variantImg.length !== 0) {
      this.setVairantImg(variantImg[0]);
    }
  };

  setVairantImg = imageUrl => {
    const { product, resetSlider } = this.props;
    this.setState({
      vairantImg: imageUrl
    });
    product.swapImg(imageUrl);
    resetSlider();
  };

  removeError = formErrorNumber => {
    this.setState({
      [formErrorNumber]: ''
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { state } = this;
    this.formErrors();
    if (this.confirmOptionsSelected()) {
      this.handleModalToggle();

      this.setState({
        modalQuantity: state.quantity,
        quantity: 1
      });
    }
  };

  // handleSubmit = event => {
  //   event.preventDefault();
  //   const { shop, product } = this.props;
  //   const { state } = this;
  //   this.formErrors();
  //   if (this.confirmOptionsSelected()) {
  //     shop.cart.addToCart({
  //       item: product,
  //       quantity: state.quantity,
  //       optionValue1: state.optionValueId1 || 0,
  //       optionValue2: state.optionValueId2 || 0,
  //       optionValue3: state.optionValueId3 || 0,
  //       optionValueName1: state.optionValueName1 || 0,
  //       optionValueName2: state.optionValueName2 || 0,
  //       optionValueName3: state.optionValueName3 || 0
  //     });
  //     this.handleModalToggle();

  //     this.setState({
  //       modalQuantity: state.quantity,
  //       quantity: 1
  //     });

  //   }
  // };

  handleModalToggle = () => {
    const { modalClass } = this.state;

    this.setState({
      modalClass: modalClass === '' ? 'is-active' : '',
      submitSuccess: false
    });
  };

  confirmFirstOption() {
    const { optionDisplayName1, optionValueName1 } = this.state;

    const missingOption1 =
      optionDisplayName1 !== null && optionValueName1 === null;

    if (missingOption1) {
      this.setState({
        optionErrorMsg1: `Please select ${optionDisplayName1.toLowerCase()}`
      });
    }
    return !missingOption1;
  }

  confirmSecondOption() {
    const { optionDisplayName2, optionValueName2 } = this.state;

    const missingOption2 =
      optionDisplayName2 !== null && optionValueName2 === null;

    if (missingOption2) {
      this.setState({
        optionErrorMsg2: `Please select ${optionDisplayName2.toLowerCase()}`
      });
    }
    return !missingOption2;
  }

  confirmThirdOption() {
    const { optionDisplayName3, optionValueName3 } = this.state;

    const missingOption3 =
      optionDisplayName3 !== null && optionValueName3 === null;

    if (missingOption3) {
      this.setState({
        optionErrorMsg3: `Please select ${optionDisplayName3.toLowerCase()}`
      });
    }

    return !missingOption3;
  }

  formErrors() {
    this.confirmFirstOption();
    this.confirmSecondOption();
    this.confirmThirdOption();
  }

  confirmOptionsSelected() {
    return (
      this.confirmFirstOption() &&
      this.confirmSecondOption() &&
      this.confirmThirdOption()
    );
  }

  decreaseQuantity() {
    let { quantity } = this.state;

    if (quantity > 1) {
      this.setState({
        quantity: (quantity -= 1)
      });
    }
  }

  increaseQuantity() {
    let { quantity } = this.state;

    this.setState({
      quantity: (quantity += 1)
    });
  }

  render() {
    const { product, shop } = this.props;
    const {
      quantity,
      modalQuantity,
      modalClass,
      optionDisplayName1,
      optionDisplayName2,
      optionDisplayName3,
      optionValueName1,
      optionValueName2,
      optionValueName3,
      optionErrorMsg1,
      optionErrorMsg2,
      optionErrorMsg3,
      vairantImg,
      submitSuccess
    } = this.state;

    // if variant img is diff than first img in array, reset array
    if (
      product.images.length &&
      vairantImg !== product.images[0].standard_url
    ) {
      this.setVairantImg(vairantImg);
    }

    return (
      <div className="form">
        <form onSubmit={this.handleSubmit}>
          {/* if options are given figure out which to display */}
          {product.options[0] &&
            product.options.map(option => (
              <div className="product-options" key={option.id}>
                {option.type === 'swatch' && (
                  <div className="option">
                    <Swatch
                      option={option}
                      optionValueName={this.displayOptionValueName(option)}
                      formErrorMsg={this.displayErrorMsg(option)}
                      handleOnChange={this.handleOnChange}
                      getIndex={this.getIndex(option)}
                      checkInStock={product.findInOOSarray}
                    />
                  </div>
                )}

                {(option.type === 'rectangles' ||
                  option.type === 'radio_buttons') && (
                    <div className="option">
                      <Rectangles
                        option={option}
                        optionValueName={this.displayOptionValueName(option)}
                        formErrorMsg={this.displayErrorMsg(option)}
                        handleOnChange={this.handleOnChange}
                        getIndex={this.getIndex(option)}
                        checkInStock={product.findInOOSarray}
                      />
                    </div>
                  )}
              </div>
            ))}

          <div className="mobile-form">
            <div className="level add-to-cart-form">
              <div className="has-text-right pricing-line">
                <PurchaseFormErrorMsg
                  getErrorCount={this.getErrorCount()}
                  className="is-hidden-tablet"
                  optionErrorMsg1={optionErrorMsg1}
                  optionErrorMsg2={optionErrorMsg2}
                  optionErrorMsg3={optionErrorMsg3}
                />
                {product.sale_price === 0 ? (
                  <div className="mobile-price has-text-weight-bold">
                    ${product.getPrice()}
                  </div>
                ) : (
                    <span>
                      <s className="mobile-sale-price">
                        ${product.price.toFixed(2)}
                      </s>
                      <p className="mobile-price has-text-weight-bold">
                        {'  '}${product.sale_price.toFixed(2)}
                      </p>
                    </span>
                  )}
              </div>
              <div className="has-text-right mobile-pricing">
                <PurchaseFormErrorMsg
                  getErrorCount={this.getErrorCount()}
                  className="is-hidden-mobile"
                  optionErrorMsg1={optionErrorMsg1}
                  optionErrorMsg2={optionErrorMsg2}
                  optionErrorMsg3={optionErrorMsg3}
                />
              </div>
              <div className="field">
                <span className="is-inline quantity-selector">
                  <button
                    className="button"
                    data-cy="decrease"
                    type="button"
                    onClick={() => this.decreaseQuantity()}
                    disabled={quantity <= 1 || product.inventory_level < 1}
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
                        min="1"
                        value={quantity}
                        onChange={this.handleOnChange}
                        disabled={product.inventory_level < 1}
                      // disabled={product.inventory_level < 1 || quantity >= product.inventory_level}
                      />
                    </div>
                  </label>
                  <button
                    className="button"
                    data-cy="increase"
                    type="button"
                    onClick={() => this.increaseQuantity()}
                    disabled={product.inventory_level < 1}
                  // disabled={product.inventory_level < 1 || quantity >= product.inventory_level}
                  >
                    <i className="fas fa-plus" />
                  </button>
                </span>
              </div>
              <button
                className="button primary-btn add-to-cart-button field is-inline event_buy_now_add_to_cart"
                data-cy="add-to-bag"
                type="submit"
                disabled={quantity < 1 || product.inventory_level < 1}
              >
                {product.inventory_level < 1 ? (
                  <span>Sold Out</span>
                ) : (
                    <span>Add To Cart</span>
                  )}
              </button>
            </div>
          </div>
        </form>

        {!shop.cart.addToCartError && (
          <div className={`modal ${modalClass}`}>
            <div
              className="modal-background"
              role="button"
              tabIndex="0"
              onClick={() => this.handleModalToggle()}
              onKeyPress={() => this.handleModalToggle()}
            />
            <div className="box has-text-centered">
              <span
                role="button"
                tabIndex="0"
                className="icon pull-right"
                onClick={() => this.handleModalToggle()}
                onKeyPress={() => this.handleModalToggle()}
              >
                <img src={X} alt="close-icon" className="close-icon" />
              </span>
              <div className="content is-expanded has-background-light-grey">
                {submitSuccess ? (
                  <h2 className="thank-you-modal-title">
                    Thanks! We’ll let you know when it’s back!
                  </h2>
                ) : (
                    <div>
                      <h3 className="modal-title">
                        We’re out of stock but you’re in luck!
                    </h3>
                      <div className="columns is-mobile">
                        <div className="column is-5">
                          <Image
                            publicId={vairantImg || product.thumbnail_url}
                            className="oos-modal-img"
                            alt="img"
                            type="fetch"
                          >
                            <Transformation
                              quality="auto"
                              fetchFormat="auto"
                              dpr="auto"
                              responsive
                              crop="scale"
                            // width="120"
                            // height="120"
                            />
                          </Image>
                        </div>
                        <div className="column has-text-left">
                          <div>
                            <p>
                              We reorder based on community feedback and demand,
                              so your voice is very important. We’ll email you
                              when we bring your style and size back!
                          </p>
                            <div className="added-item-price">
                              {product.sale_price === 0 ? (
                                <h4 className="has-text-weight-bold">
                                  ${product.getPrice()} each
                              </h4>
                              ) : (
                                  <div>
                                    <s>${product.price.toFixed(2)}</s>
                                    <span className="has-text-weight-bold">
                                      {'  '}${product.sale_price.toFixed(2)} each
                                </span>
                                  </div>
                                )}
                            </div>
                            <p className="product-options">
                              {product.options[0] && (
                                <span>
                                  {optionDisplayName1}: {optionValueName1}
                                </span>
                              )}
                              {product.options[1] && (
                                <span>
                                  {optionDisplayName2}: {optionValueName2}
                                </span>
                              )}
                              {product.options[2] && (
                                <span>
                                  {optionDisplayName3}: {optionValueName3}
                                </span>
                              )}
                              <span>Quantity: {modalQuantity}</span>
                            </p>
                          </div>

                          <OOSnotifyMeSignup
                            handleSignupSuccess={this.handleSignupSuccess}
                            optionValueName1={optionValueName1}
                            optionValueName2={optionValueName2}
                            optionValueName3={optionValueName3}
                            product={product}
                          />
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )
          // <div className={`modal ${modalClass}`}>
          //   <div className="modal-background" role="button"
          //     tabIndex="0"
          //     onClick={() => this.handleModalToggle()}
          //     onKeyPress={() => this.handleModalToggle()} />
          //   <div className="box has-text-centered">
          //     <span
          //       role="button"
          //       tabIndex="0"
          //       className="icon pull-right"
          //       onClick={() => this.handleModalToggle()}
          //       onKeyPress={() => this.handleModalToggle()}
          //     >
          //       <img src={X} alt="close-icon" className="close-icon" />
          //     </span>
          //     <div className="content is-expanded has-background-light-grey">
          //       <h3 className="modal-title">
          //         {product.name} has been added to your cart!
          //       </h3>
          //       <div className="columns is-mobile">
          //         <div className="column is-6 has-text-right">
          //           <Image
          //             publicId={vairantImg || product.thumbnail_url}
          //             className="modal-img"
          //             alt="img"
          //             type="fetch"
          //           >
          //             <Transformation
          //               quality="auto"
          //               fetchFormat="auto"
          //               dpr="auto"
          //               responsive
          //               crop="scale"
          //             // width="120"
          //             // height="120"
          //             />
          //           </Image>
          //         </div>
          //         <div className="column has-text-left">
          //           <div>
          //             <div className="added-item-price">
          //               {product.sale_price === 0 ? (
          //                 <h4 className="has-text-weight-bold">
          //                   ${product.getPrice()} each
          //                 </h4>
          //               ) : (
          //                   <div>
          //                     <s>${product.price.toFixed(2)}</s>
          //                     <span className="has-text-weight-bold">
          //                       {'  '}${product.sale_price.toFixed(2)} each
          //                     </span>
          //                   </div>
          //                 )}
          //             </div>
          //             <p className="product-options">
          //               {product.options[0] && (
          //                 <span>
          //                   {optionDisplayName1}: {optionValueName1}
          //                 </span>
          //               )}
          //               {product.options[1] && (
          //                 <span>
          //                   {optionDisplayName2}: {optionValueName2}
          //                 </span>
          //               )}
          //               {product.options[2] && (
          //                 <span>
          //                   {optionDisplayName3}: {optionValueName3}
          //                 </span>
          //               )}
          //               <span>
          //                 Quantity: {modalQuantity}
          //               </span>
          //             </p>
          //           </div>
          //         </div>
          //       </div>
          //       <button
          //         className="button primary-btn keep-cta event_continue_shopping"
          //         type="button"
          //         onClick={() => this.handleModalToggle()}
          //       >
          //         <span>Continue Shopping</span>
          //     </button>
          //       <Link to="/my-cart#top" data-cy="my-cart-modal">
          //         <button
          //           className="button primary-btn checkout-cta event_checkout_now"
          //           type="button"
          //           onClick={() => this.handleModalToggle()}
          //         >
          //           <span>Checkout Now</span>
          //       </button>
          //       </Link>
          //     </div>
          //   </div>
          // </div>
        }
      </div>
    );
  }
}
