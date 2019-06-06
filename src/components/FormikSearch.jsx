import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import Yup from 'yup';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

@inject('shop')
@observer
class FormikSearch extends Component {
  render() {
    const { props } = this;
    const { shop } = props;

    return (
      <Formik
        initialValues={{ search: '' }}
        validationSchema={Yup.object().shape({
          search: Yup.string().required(),
        })}
        onSubmit={(searchTerm, { setSubmitting, resetForm }) => {
          shop.products.resetProductList();
          shop.products.updateSearch(searchTerm.search);
          props.closeNav();
          props.history.push('/products-page');
          setSubmitting(false);
          resetForm();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="field has-addons">
              <div className="control">
                <Field
                  className="input"
                  type="search"
                  name="search"
                  placeholder="Search Now"
                />
              </div>
              <div className="control">
                <button className="button is-rounded" type="submit" disabled={isSubmitting}>
                  Search
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default withRouter(FormikSearch);
