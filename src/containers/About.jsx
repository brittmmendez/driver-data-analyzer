import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

@inject('shop')
@observer
class About extends Component {
  render() {
    return (
      <section className="section  has-text-centered" data-cy="about-page">
        <div className="container">
          <div className="content">
            <h1>Brittany Morris</h1>

            <section className="about-me">
              <p>
                Brittany is a full stack software engineer with a passion to design, build,
                and launch high quality software applications through clean reusable code while
                always pursuing the best user-experience for the customer.
              </p>

              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/brittmmendez/driver-data-analyzer"
              >
                See this project on github!
            </a>

              <p>
                <a
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.linkedin.com/in/brittmmendez/"
                >
                  <i className="fab fa-linkedin-in" />
                </a>
                <a
                  target="_blank"
                  className="social-link"
                  rel="noopener noreferrer"
                  href="https://github.com/brittmmendez"
                >
                  <i className="fab fa-github" />
                </a>
              </p>
            </section>
          </div>
        </div>
      </section >
    );
  }
}
export default About;
