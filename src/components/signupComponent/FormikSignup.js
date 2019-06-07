/* eslint-disable */
import React, { Component } from 'react';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import Yup from 'yup';
import { inject, observer } from 'mobx-react';
import { Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import MDSpinner from "react-md-spinner";

const cookies = new Cookies();

@inject('shop')
@observer
class FormikSignup extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    viaModal: PropTypes.bool,
  };
  static defaultProps = {
    viaModal: false,
  };

  render() {
    const { viaModal } = this.props;
    return (
      <div className="user-accounts has-text-left">
        <Formik
          initialValues={{
            email: ''
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("Oops! This doesn't look like a valid email.")
              .required('Oops! Please enter your email.')
          })}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const { shop: { crmSignup }, viaModal } = this.props;
            const url =
              'https://0khg96ijce.execute-api.us-east-1.amazonaws.com/prod/email';
            const data = {
              email: values.email
            };

            console.log(data);
            try {
              const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
              });

              const content = await response;

              if (content.status === 200) {
                crmSignup.setSignupFormSuccess(true);
                crmSignup.setSignupModal(false);
                crmSignup.setViaSignupModal(viaModal);
                cookies.set(
                  'CRMsignup',
                  { CRMsignup: true },
                  { path: '/' }
                );
              } else {
                crmSignup.setSignupFormError(true);
                crmSignup.setSignupModal(false);
              }

              setSubmitting(false);
              resetForm();
            } catch (err) {
              setSubmitting(false);
              resetForm();
              crmSignup.setSignupFormError(true);
              crmSignup.setSignupModal(false);
            }
          }}
        >
          {({ isSubmitting, errors }) => (
            <Form className="signup-form">
              <div className="field has-addons">
                <div className="control">
                  <label
                    htmlFor={viaModal ? "emailModal" : "email"}
                    className={errors.email ? 'error-border' : ''}
                  >
                    <Field
                      id={viaModal ? "emailModal" : "email"}
                      className="input form-input"
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      aria-label="email"
                      aria-labelledby="email field"
                    />
                  </label>
                </div>
                <div className="control">
                  <button
                    className={isSubmitting ? "submitting primary-btn form-btn" : "primary-btn form-btn event_crm_action"}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ?
                      <MDSpinner size={20} singleColor="#ffffff" duration={2000} />
                      :
                      'ADD ME'
                    }
                  </button>
                </div>
              </div>
              <ErrorMessage className="error" name="email" component="div" />
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default FormikSignup;
