import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Image, Transformation } from 'cloudinary-react';

@inject('shop')
@observer
class ParantCompany extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: {
        aboutPage: { parentCompany }
      }
    } = this.props;
    return (
      <div className="parent-company">
        <p className="about-title">{parentCompany.title}</p>
        <p>{parentCompany.body}</p>
        <p className="section-title">{parentCompany.subTitle}</p>
        <div className="columns is-multiline is-mobile ">
          {parentCompany.img.map(i =>
            <div className="column is-2-widescreen is-2-desktop is-3-tablet is-4-mobile">
              <Image
                publicId={i.mediaFile}
                alt={i.mediaTitle}
                className="spotlight-img"
                type="fetch"
              >
                <Transformation quality="auto" fetchFormat="auto" dpr="auto"
                  responsive crop="scale" width="132"
                  height="67" />
              </Image>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ParantCompany;
