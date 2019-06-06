/* eslint-disable */
import React, { Component } from 'react';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import Yup from 'yup';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

@inject('shop')
@observer
class FormikRegister extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    history: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const { shop, history } = this.props;

    return (
      <div className="user-accounts container has-text-centered">
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            verifyEmail: '',
            password: '',
            verifyPassword: ''
          }}
          validationSchema={Yup.object().shape({
            firstName: Yup.string().required('First Name is required'),
            lastName: Yup.string().required('Last Name is required'),
            email: Yup.string()
              .email('Email not valid')
              .required('Email is required'),
            verifyEmail: Yup.string()
              .oneOf([Yup.ref('email'), null], 'Emails do not match')
              .required('Confirmation Email is required'),
            password: Yup.string()
              .min(8, 'Password must be 8 characters or longer')
              .required('Password is required'),
            verifyPassword: Yup.string()
              .oneOf([Yup.ref('password'), null], 'Passwords do not match')
              .required('Confirmation Password is required')
          })}
          onSubmit={(values, { setSubmitting }) => {
            shop.user.register(values).then(response => {
              if (response) {
                setSubmitting(false);
                history.push('/login');
              } else {
                setSubmitting(false);
              }
            });
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              {shop.user.registerError && (
                <strong>
                  <p className="help is-danger">
                    Account not created. Username already exists. Please
                    <Link to="/login"> Log In!</Link>
                  </p>
                </strong>
              )}
              <label className="label" htmlFor="firstName">
                First Name
                <ErrorMessage
                  className="help is-danger"
                  name="firstName"
                  component="div"
                />
                <div className="control has-icons-left has-icons-right">
                  <input
                    className="input"
                    type="firstName"
                    name="firstName"
                    id="firstName"
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-user" />
                  </span>
                </div>
              </label>
              <br />
              <label className="label" htmlFor="lastName">
                Last Name
                <ErrorMessage
                  className="help is-danger"
                  name="lastName"
                  component="div"
                />
                <div className="control has-icons-left has-icons-right">
                  <input
                    className="input"
                    type="lastName"
                    name="lastName"
                    id="lastName"
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-user" />
                  </span>
                </div>
              </label>
              <br />
              <label className="label" htmlFor="email">
                Email
                <ErrorMessage
                  className="help is-danger"
                  name="email"
                  component="div"
                />
                <div className="control has-icons-left has-icons-right">
                  <Field
                    className="input"
                    type="email"
                    name="email"
                    id="email"
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-envelope" />
                  </span>
                </div>
              </label>
              <br />
              <label className="label" htmlFor="verifyEmail">
                Confirm Email
                <ErrorMessage
                  className="help is-danger"
                  name="verifyEmail"
                  component="div"
                />
                <div className="control has-icons-left has-icons-right">
                  <Field
                    className="input"
                    type="verifyEmail"
                    name="verifyEmail"
                    id="verifyEmail"
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-envelope" />
                  </span>
                </div>
              </label>
              <br />
              <label className="label" htmlFor="password">
                Password
                <ErrorMessage
                  className="help is-danger"
                  name="password"
                  component="div"
                />
                <div className="control has-icons-left has-icons-right">
                  <Field
                    className="input"
                    type="password"
                    name="password"
                    id="password"
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-lock" />
                  </span>
                </div>
              </label>
              <br />
              <label className="label" htmlFor="verifyPassword">
                Confirm Password
                <ErrorMessage
                  className="help is-danger"
                  name="verifyPassword"
                  component="div"
                />
                <div className="control has-icons-left has-icons-right">
                  <Field
                    className="input"
                    type="password"
                    name="verifyPassword"
                    id="verifyPassword"
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-lock" />
                  </span>
                </div>
              </label>
              <br />
              <button
                className="button is-primary "
                type="submit"
                disabled={isSubmitting}
              >
                Submit
              </button>
            </Form>
          )}
        </Formik>
        <h5>
          Already have an account?
          <Link to="/login"> Log In!</Link>
        </h5>
      </div>
    );
  }
}

export default FormikRegister;
