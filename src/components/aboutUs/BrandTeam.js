import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Image, Transformation } from 'cloudinary-react';

@inject('shop')
@observer
class BrandTeam extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: {
        aboutPage: { brandTeam }
      }
    } = this.props;
    return (
      <div className="brand-team">
        <p className="about-title">{brandTeam.title}</p>
        <p>
          {brandTeam.body}
        </p>
        <div className="columns is-multiline is-centered-mobile is-mobile has-text-centered-mobile">
          {brandTeam.teamMember.map(memeber =>
            <div>
              <div className="column is-12-desktop is-12-tablet is-12-mobile">
                <Image
                  publicId={memeber.mediaFile}
                  alt={memeber.mediaTitle}
                  className="spotlight-img"
                  type="fetch"
                >
                  <Transformation quality="auto" fetchFormat="auto" dpr="auto"
                    responsive crop="scale" width="174"
                    height="174" />
                </Image>
                <p className="has-text-weight-bold is-marginless">{memeber.name}</p>
                <p>{memeber.position}</p>
              </div>
            </div>

          )

          }


        </div>
      </div>
    );
  }
}

export default BrandTeam;
