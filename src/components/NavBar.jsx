import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
    };
  }

  handleClick = () => {
    const { isActive } = this.state
    this.setState({
      isActive: !isActive
    })
  }

  render() {
    const { isActive } = this.state
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item">
            <i className="fas fa-home" />
          </Link>

          <button
            type="button"
            className="navbar-burger burger"
            aria-label="menu"
            aria-expanded="false"
            onClick={() => this.handleClick()}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>

        <div id="navbarBasicExample" className={`navbar-menu ${isActive && "is-active"}`}>
          <div className="navbar-start">
            <Link to="/analyze" className="navbar-item" data-cy="analyze-page-link">
              Analyze Data
            </Link>
            <Link to="/about" className="navbar-item" data-cy="about-page-link">
              About Me
            </Link>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;