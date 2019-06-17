import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Tabs from 'react-responsive-tabs';
import Markdown from 'react-markdown';
import { HashLink as Link } from 'react-router-hash-link';
import { Helmet } from 'react-helmet';
// import { Image, Transformation } from 'cloudinary-react';
// import LazyLoad from 'react-lazyload';
import PurchaseForm from '../components/PurchaseForm';
import LoadingView from '../components/LoadingView';
import ProductImageArray from '../components/ProductImageArray';
import MobileProductImageArray from '../components/MobileProductImageArray';
// import ProductCustomerReviews from '../components/ProductCustomerReviews';
import ProductStarRating from '../components/ProductStarRating';
import ErrorPage from './ErrorPage';
import ErrorBanner from '../components/ErrorBanner';

@inject('shop')
@observer
class ProductShow extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    match: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  constructor() {
    super();
    this.state = {
      resetSlider: false
    };
  }

  componentWillMount() {
    const { match } = this.props
    match.params.productId
    window.PGdataLayer.page = {
      title: 'Uplift Details Page',
      url: 'products-page/uplift'
    }
    window.dataLayer.push({ 'event': 'virtualPageview' })
  }

  onProductButtonClick(product) {
    const { shop } = this.props;
    shop.cart.addToCart(product);
  }

  getDetails(product) {
    const { shop } = this.props;

    const details = shop.products.productDetailsGrouping.filter(
      grouping => parseInt(grouping.productId, 10) === product.id
    )[0];

    if (details) {
      return true;
    }
    return false;
  }

  getTabs(product) {
    const { shop } = this.props;

    const details = shop.products.productDetailsGrouping.filter(
      grouping => parseInt(grouping.productId, 10) === product.id
    )[0];

    const productDescription = details.productDetails.map(detail => ({
      name: (<span className="tabs-title">{detail.productDetailsTitle}</span>),
      details: (
        <div>
          {detail.productDetailsMediaFile ? (
            <div className="columns">
              <div className="column product-details-img">
                <img
                  src={detail.productDetailsMediaFile}
                  alt={detail.productDetailsMediaAlt}
                />
              </div>
              <div className="column">
                <Markdown source={detail.productDetailsCopy} />
              </div>
            </div>
          ) : (
              <Markdown source={detail.productDetailsCopy} />
            )}
        </div>
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

  resetSlider() {
    const { resetSlider } = this.state;
    this.setState({
      resetSlider: !resetSlider
    });
  }

  render() {
    const {
      shop,
      shop: { contentful },
      match } = this.props;
    const { resetSlider } = this.state;
    const params = parseInt(match.params.productId, 10);

    if (shop.products.loadingProductsError) {
      return (
        <ErrorPage
          errorTitle="We’re sorry, we couldn’t find this product."
          errorMsg="This product has either been removed, renamed or is unavailable. Feel free to take a look at our current products or to explore other parts of our site."
          errorType="product"
        />
      );
    }

    if (shop.products.data.length > 0) {
      const product = shop.products.data.filter(p => p.id === params)[0];

      return product ? (
        <div>
          <Helmet>
            <title>{product.name}</title>
            <meta property="og:type" content="product" />
            <meta
              property="og:url"
              content={`${process.env.REACT_APP_URL}/products-page/${
                product.id
                }`}
            />
            <meta property="og:title" content={product.page_title} />
            <meta
              property="og:description"
              content={product.meta_description}
            />
            <meta property="og:image" content={product.thumbnail_url} />
          </Helmet>
          <div className="product-show">
            {shop.cart.addToCartError && <ErrorBanner />}
            <section className="section">
              <div className="container content has-text-left">
                <div className="product-show-mobile">
                  <h2 className="product-name has-text-weight-bold is-marginless">
                    {product.name}
                  </h2>
                  {/* <p className="sku">{product.sku}</p> */}
                  {product.sale_price === 0 ? (
                    <h3 className="product-regular-price">
                      ${product.getPrice()}
                    </h3>
                  ) : (
                      <div>
                        <s className="product-price">
                          ${product.price.toFixed(2)}
                        </s>
                        <span className="product-price has-text-weight-bold">
                          {'  '}${product.sale_price.toFixed(2)}
                        </span>
                      </div>
                    )}
                  <div className="rating">
                    <ProductStarRating product={product} showAll />
                  </div>
                </div>
                <div className="content columns">
                  <div className="product-feature-image column is-6">
                    <div className="is-hidden-mobile">
                      <ProductImageArray
                        product={product}
                        resetSlider={resetSlider}
                      />
                    </div>

                    <div className="is-hidden-tablet">
                      <MobileProductImageArray
                        product={product}
                        resetSlider={resetSlider}
                      />
                    </div>
                  </div>
                  <div className="column is-6 product-details">
                    <div className="product-show-desktop">
                      <h2 className="product-name has-text-weight-bold is-marginless">
                        {product.name}
                      </h2>
                      {/* <p>{product.sku}</p> */}
                      {product.sale_price === 0 ? (
                        <h3 className="product-regular-price">
                          ${product.getPrice()}
                        </h3>
                      ) : (
                          <div>
                            <s className="product-price">
                              ${product.price.toFixed(2)}
                            </s>
                            <span className="product-price has-text-weight-bold">
                              {'  '}${product.sale_price.toFixed(2)}
                            </span>
                          </div>
                        )}
                      <div>
                        <ProductStarRating product={product} showAll />
                      </div>
                      <div className="product-description">
                        {/* <p> */}
                        <Markdown
                          escapeHtml={false}
                          source={product.description}
                        />
                        <Link
                          className="event_view_more_details"
                          smooth
                          to={`/products-page/${product.id}#more-details`}
                        >
                          View Details
                          </Link>
                        {/* </p> */}
                      </div>
                    </div>
                    <PurchaseForm
                      product={product}
                      resetSlider={() => this.resetSlider()}
                    />
                  </div>
                </div>
              </div>
            </section>
            <div className="product-details-section" style={{ backgroundImage: `url(${contentful.emptyCartImg})` }}>
              <section className="section">
                <div className="container">
                  {this.getDetails(product) && (
                    <div id="more-details">
                      <Tabs showMore={false} items={this.getTabs(product)} />
                    </div>
                  )}
                </div>
              </section>
            </div>
            {/* <LazyLoad height={200}>
              <section className="section has-text-centered">
                <div className="container content product-review">
                  <h2 className="customer-reviews">Customer Reviews</h2>
                  <ProductCustomerReviews product={product} />
                </div>
              </section>
            </LazyLoad> */}
          </div>
        </div>
      ) : (
          <ErrorPage
            errorTitle="We're sorry, we couldn't find this product."
            errorMsg="This product has either been removed, renamed or is unavailable. Feel free to take a look at our current products or to explore other parts of our site."
            errorType="product"
          />
        );
    }
    return (
      <div className="spinner-container">
        <LoadingView />
      </div>
    );
  }
}

export default ProductShow;
