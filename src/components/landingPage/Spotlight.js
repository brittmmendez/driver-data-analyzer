import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Image, Transformation } from 'cloudinary-react';
import LazyLoad from 'react-lazyload';

@inject('shop')
@observer
class Spotlight extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: {
        landingPage: { spotlight }
      }
    } = this.props;
    return (
      <LazyLoad height={200}>
        <div
          className="spotlight"
          style={{
            backgroundImage: `url(${spotlight.spotlightProductMediaFile})`
          }}
        >
          <section className="section spotlight">
            <div className="content">
              <div className="has-text-left">
                <div className="spotlight-msg has-text-left-mobile">
                  <h1>{spotlight.spotlightProductTitle}</h1>
                  {/* <p className="">{spotlight.spotlightProductMessaging}</p> */}
                  <div className="has-text-centered-mobile">
                    <Link
                      className="primary-btn button join-button"
                      to={spotlight.spotlightProductCtaButtonRelativeURL}
                    >
                      <span>{spotlight.spotlightProductCtaButtonText}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </LazyLoad>

      // <div className="spotlight">
      //   <section className="section">
      //     <div className="columns reverse-column-order content">
      //       <div className="column is-6 has-text-left">
      //         <div className="spotlight-msg">
      //           <h1>{spotlight.spotlightProductTitle}</h1>
      //           <p className="has-text-left">
      //             {spotlight.spotlightProductMessaging}
      //           </p>
      // <div className="has-text-centered-mobile">
      //   <Link
      //     className="primary-btn button join-button"
      //     to={spotlight.spotlightProductCtaButtonRelativeURL}
      //   >
      //     <span>{spotlight.spotlightProductCtaButtonText}</span>
      //   </Link>
      // </div>
      //         </div>
      //       </div>
      //       <LazyLoad height={200}>
      //         <div className="column has-text-right has-text-centered-touch">
      //           <Image
      //             publicId={spotlight.spotlightProductMediaFile}
      //             alt={spotlight.spotlightProductMediaText}
      //             className="spotlight-img"
      //             type="fetch"
      //           >
      //             <Transformation
      //               quality="auto"
      //               dpr="auto"
      //               fetchFormat="auto"
      //               responsive
      //               crop="scale"
      //               width="550"
      //             />
      //           </Image>
      //         </div>
      //       </LazyLoad>
      //     </div>
      //   </section>
      // </div>
    );
  }
}

export default Spotlight;
