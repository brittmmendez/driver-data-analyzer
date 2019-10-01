import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

@inject('shop')
@observer
class About extends Component {
  render() {
    return (
      <section className="section  has-text-centered">
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
                href="/"
              >
                See this project on github!
            </a>
            </section>
          </div>
        </div>
      </section >
    );
  }
}
export default About;
