import React from 'react';
import { Link } from 'react-router-dom';
import img from '../static/homepage.png'

const LandingPage = () => (
  <section className="section">
    <div className="container">
      <div className="content">
        <div className="columns">
          <div className="column">
            <h1>Welcome!</h1>
            <p>In this app, you will find a file upload form that will allow you to quickly upload driver data for quick and easy analysis! </p>
            <p>Click the Analyza Data link in the NavBar to get started.</p>
            <Link className="button" to="/analyze"> Analyze Now </Link>
          </div>

          <div className="column has-text-centered">
            <img src={img} width="500" alt="map with car" />
          </div>
        </div>
      </div>
    </div>
  </section >
);

export default LandingPage;
