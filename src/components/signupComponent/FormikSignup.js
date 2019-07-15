/* eslint-disable */
import React, { Component } from 'react';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import Yup from 'yup';
import { inject, observer } from 'mobx-react';
import { Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import MDSpinner from 'react-md-spinner';

const cookies = new Cookies();

@inject('shop')
@observer
class FormikSignup extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    viaModal: PropTypes.bool
  };
  static defaultProps = {
    viaModal: false
  };

  render() {
    const { viaModal } = this.props;
    return (
      <div className="user-accounts has-text-left">
        <Formik
          initialValues={{
            email: '',
            agree: false
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("Oops! This doesn't look like a valid email.")
              .required('Oops! Please enter your email.'),
            agree: Yup.bool()
              .test(
                'consent',
                'You have to agree with our Terms and Conditions!',
                value => value === true
              )
              .required('You have to agree with our Terms and Conditions!')
          })}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const {
              shop: { crmSignup },
              viaModal
            } = this.props;
            const url = `${shop.apiUrl}/emailSignup`;
            const data = {
              email: values.email
            };

            console.log(data);
            try {
              const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  Authorization: `Bearer ${shop.user.guestToken}`
                }
              });

              const content = await response;

              if (content.status === 200) {
                crmSignup.setSignupFormSuccess(true);
                crmSignup.setSignupModal(false);
                crmSignup.setViaSignupModal(viaModal);
                cookies.set(
                  'CRMoptIn',
                  {
                    CRMoptIn: true,
                    email: values.email
                  },
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
          {({ isSubmitting, errors, touched }) => (
            <Form className="signup-form">
              <ErrorMessage className="error" name="email" component="div" />
              <div className="field has-addons has-addons-centered is-grouped">
                <div className="control is-expanded is-marginless">
                  <label
                    htmlFor={viaModal ? 'emailModal' : 'email'}
                    className={
                      errors.email && touched['email'] ? 'error-border' : ''
                    }
                  >
                    <span className="is-sr-only">Email</span>
                    <Field
                      id={viaModal ? 'emailModal' : 'email'}
                      className="input form-input"
                      type="email"
                      name="email"
                      aria-label="email field"
                      aria-labelledby="email field"
                      placeholder="Email"
                    />
                  </label>
                </div>
                <div className="control is-hidden-mobile">
                  <button
                    className={
                      isSubmitting
                        ? 'submitting primary-btn form-btn'
                        : 'primary-btn form-btn event_profile_email_signup'
                    }
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <MDSpinner
                        size={15}
                        singleColor="#ffffff"
                        duration={2000}
                      />
                    ) : (
                      <span>Sign Me Up!</span>
                    )}
                  </button>
                </div>
              </div>
              <ErrorMessage className="error" name="agree" component="div" />
              <div className="control">
                <div className="columns is-mobile">
                  <label
                    className="checkbox"
                    htmlFor={viaModal ? 'agreeModal' : 'agree'}
                  >
                    <span className="is-sr-only">Agreement Checkbox</span>
                    <Field
                      className="checkbox"
                      // checked={true}
                      type="checkbox"
                      name="agree"
                      id={viaModal ? 'agreeModal' : 'agree'}
                      aria-label="agree checkbox"
                      aria-labelledby="agree checkbox"
                    />
                  </label>
                  <div className="column">
                    <div className="has-text-left sub-text checkbox-text">
                      By registering, I agree to receive emails from Tampax Cup
                      and other trusted{' '}
                      <a
                        href="http://us.pg.com/our-brands"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        P&G brands and programs
                      </a>
                      . Click to read{' '}
                      <a
                        href="http://www.pg.com/en_US/terms_conditions/index.shtml"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        P&G Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a
                        href="http://www.pg.com/privacy/english/privacy_statement.shtml"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy Policy
                      </a>
                      .{' '}
                    </div>
                  </div>
                </div>
              </div>
              <div className="control is-hidden-tablet">
                <button
                  className={
                    isSubmitting
                      ? 'submitting primary-btn form-btn'
                      : 'primary-btn form-btn event_profile_email_signup'
                  }
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <MDSpinner
                      size={15}
                      singleColor="#ffffff"
                      duration={2000}
                    />
                  ) : (
                    <span>Sign Me Up!</span>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default FormikSignup;
