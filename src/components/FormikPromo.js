import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import Yup from 'yup';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import MDSpinner from "react-md-spinner";
import X from '../static/images/svg/X.svg'

@inject('shop')
@observer
class FormikPromo extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  constructor(props) {
    super(props);
    this.state = {
      success: false
    };
  }

  componentWillMount() {
    const { shop } = this.props;
    shop.cart.coupon.resetErrorMsg();
  }

  handleClick = () => {
    const { shop } = this.props;
    shop.cart.coupon.removePromo();
    this.setState({
      success: false
    })
  };

  handleFormClick = () => {
    const { shop } = this.props;
    shop.cart.coupon.resetError();
    this.setState({
      success: false
    })
  };

  render() {
    const { shop } = this.props;
    const { success } = this.state;


    return (
      <div>
        {!shop.cart.coupon.promo && (
          <Formik
            initialValues={{ promo: '' }}
            validationSchema={Yup.object().shape({
              promo: Yup.string().required(),
            })}
            onSubmit={async (promoCode, { setSubmitting }) => {
              shop.cart.coupon.applyPromo(promoCode.promo)
                .then((response) => {
                  if (response) {
                    this.setState({
                      success: true
                    },
                      () => {
                        setSubmitting(false);
                      }
                    )
                  } else {
                    this.setState({
                      success: false
                    })
                    setSubmitting(false);

                  }
                });
            }}
          >
            {({ isSubmitting }) => (
              <Form onClick={this.handleFormClick}>
                <div className="field is-grouped is-marginless">

                  <div className="control is-expanded is-marginless">
                    <Field
                      disabled={success}
                      className={shop.cart.coupon.error ? "error-form input" : "input"}
                      type="promo"
                      name="promo"
                      placeholder="Promo Code"
                    />
                  </div>
                  <div className="control">
                    <button className={isSubmitting || success ? "button submitting secondary-btn" : "button secondary-btn"} type="submit">
                      {!success && !isSubmitting ? "Apply" : <MDSpinner size={15} singleColor="#614495" duration={2000} />}
                    </button>
                  </div>
                </div>
                {shop.cart.coupon.error
                  && (
                    <p className="error">
                      {shop.cart.coupon.errorMesage}
                    </p>
                  )}
                <p className="has-text-left is-marginless sub-text"> One promo code per order</p>
              </Form>
            )}
          </Formik>
        )}
        {shop.cart.coupon.promo && (
          <div>
            <div className="promo-applied">
              <div className="columns is-mobile is-marginless">
                <div className="column is-7 promo">
                  <p>{shop.cart.coupon.code}</p>
                </div>
                <div className="column is-5 has-text-right promo">
                  <span role="button" tabIndex="0" className="icon close-btn" data-cy="remove" onClick={() => this.handleClick()} onKeyPress={() => this.handleClick()}>
                    <img src={X} alt="close-icon" className="close-icon" />
                  </span>
                </div>
              </div>
              <div className="promo-msg">
                {shop.cart.coupon.name}
              </div>
            </div>
            <p className="has-text-left is-marginless sub-text"> One promo code per order</p>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(FormikPromo);
