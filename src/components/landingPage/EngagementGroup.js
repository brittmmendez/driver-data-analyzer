import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('shop')
@observer
class EngagementGroup extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: {
        landingPage: { engagementGroup }
      }
    } = this.props;
    return (
      <section className="section content engagement-group">
        <div className="has-text-centered has-text-white">
          <h1 className="engagement-title has-text-centered has-text-white">
            {' '}
            {engagementGroup.userEngagementTitle}{' '}
          </h1>
          <div className="columns">
            {engagementGroup.conclusions.map((conclusion, idx) => (
              <div key={conclusion.conclusionQuestion} className={`column is-6 col${idx}`}>
                <div className="question-answer has-text-white">
                  <h3 className="surrounding-text has-text-white">
                    {conclusion.conclusionQuestion}
                  </h3>
                  <h2 className="answer has-text-white">{conclusion.conclusionAnswer}</h2>
                  <h3 className="surrounding-text has-text-white">
                    {conclusion.conclusionMessaging}
                  </h3>
                </div>
              </div>
            ))}
          </div>
          <p>{engagementGroup.userEngagementMessaging}</p>
        </div>
      </section>
    );
  }
}

export default EngagementGroup;
