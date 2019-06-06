import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Tabs from 'react-responsive-tabs';
import Markdown from 'react-markdown';
import PropTypes from 'prop-types';

@inject('shop')
@observer
class QnAMobile extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  getTabs(qaArray) {
    const productDescription = qaArray.map(qa => ({
      name: qa.FAQQuestion,
      details: (
        <Markdown source={qa.FAQAnswer} />
      )
    }));

    return productDescription.map((tab, index) => ({
      title: tab.name,
      getContent: () => tab.details,
      /* Optional parameters */
      key: index,
      tabClassName: 'tabs is-inline-flex-tablet is-centered-tablet',
      panelClassName: 'panel'
    }));
  }

  render() {
    const { shop: { FAQEntryGroup } } = this.props;

    return (
      <div className="container content body">
        <h2 className="faq-title"> {FAQEntryGroup.title}</h2>

        {FAQEntryGroup.FAQEntry.map(entry =>
          <div className="entry-group" key={entry.entryTitle}>
            <h3 className="section-title"> <div />{entry.entryTitle}</h3>
            <Tabs showMore items={this.getTabs(entry.FAQqa)} selectedTabKey={-3} />
          </div>
        )}
      </div>
    );
  }
}

export default QnAMobile;
