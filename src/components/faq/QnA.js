import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { HashLink as Link } from 'react-router-hash-link';
import Markdown from 'react-markdown';

@inject('shop')
@observer
class QnA extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: { FAQEntryGroup }
    } = this.props;
    return (
      <div className="body">
        <h2 className="faq-title"> {FAQEntryGroup.title}</h2>

        {FAQEntryGroup.FAQEntry.map(entry =>
          <div className="entry-group" key={entry.entryTitle}>
            <h3 className="section-title"> <div />{entry.entryTitle}</h3>
            {entry.FAQqa.map(qa =>
              <ul className="qa" key={qa.FAQQuestion}>
                <span className="question">
                  <li> <h4> {qa.FAQQuestion} </h4> </li>
                </span>
                <span className="answer">
                  <li>
                    <Markdown source={qa.FAQAnswer} />
                  </li>
                </span>
              </ul>
            )}

          </div>
        )}
        <Link className="primary-btn button back-to-top" to="/#top">
          BACK TO HOMEPAGE
        </Link>
      </div>
    );
  }
}

export default QnA;
