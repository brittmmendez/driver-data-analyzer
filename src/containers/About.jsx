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
            About Me
          </div>
        </div>
      </section >
    );
  }
}
export default About;
