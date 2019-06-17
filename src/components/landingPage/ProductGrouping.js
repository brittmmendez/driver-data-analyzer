import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Image, Transformation } from 'cloudinary-react';
import LazyLoad from 'react-lazyload';
import { HashLink as Link } from 'react-router-hash-link';

@inject('shop')
@observer
class ProductGrouping extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  render() {
    const {
      shop: {
        landingPage: { productGroupingGroup }
      }
    } = this.props;
    return (
      <section className="section product-grouping">
        <div className="content has-text-centered">
          <div className="columns">
            {productGroupingGroup.productGroups.map((groupTwo, idx) => (

              <div
                className={`column col${idx}`}
                key={groupTwo.productGroupTitle}
              >
                <Link
                  to={groupTwo.productGroupRelativeUrl}
                >
                  <LazyLoad height={200}>
                    <Image
                      publicId={groupTwo.productGroupMediaFile}
                      alt={groupTwo.productGroupMediaTitle}
                      className="product-img"
                      type="fetch"
                    >
                      <Transformation
                        quality="auto"
                        dpr="auto"
                        fetchFormat="auto"
                        responsive
                        width="auto"
                        crop="scale"
                      />
                    </Image>
                  </LazyLoad>
                  <h3> {groupTwo.productGroupTitle} </h3>

                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
}

export default ProductGrouping;
