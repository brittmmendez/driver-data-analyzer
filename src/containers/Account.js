import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

@inject('shop')
@observer
class Account extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };


  handleClick = () => {
    const { shop } = this.props;

    shop.user.logOut();
  };

  render() {
    const { shop } = this.props;
    return (
      <section className="section">
        <div className="container has-text-centered">
          {shop.user.loggedIn && (
            <div>
              <h1>Welcome to your account page</h1>
              <h3>Previous orders will be listed here</h3>
              <button type="button" className="button is-primary" onClick={this.handleClick}>
                Log Out
              </button>
            </div>
          )}
          {!shop.user.loggedIn && (
            <div>
              <h1>Please sign in</h1>
              <h3>to view account</h3>
              <Link className="button is-primary" to="login">
                <span>Log In</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  }
}

export default Account;
