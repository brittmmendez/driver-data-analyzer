import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import ProductsCatalogItem from '../components/ProductsCatalogItem';
import ProductShow from './ProductShow';
import LoadingView from '../components/LoadingView';
// import Sort from '../components/Sort';
import ShopProductsBtn from '../components/ShopProductsBtn';
import ErrorPage from './ErrorPage';

@inject('shop')
@observer
class ProductsCatalog extends Component {
  static propTypes = {
    shop: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    match: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  };

  componentWillMount() {
    const { match } = this.props;
    window.PGdataLayer.page = {
      title: 'Product Catalog',
      url: match.path
    }
    window.dataLayer.push({ 'event': 'virtualPageview' })
  }

  componentDidMount() {
    const { shop, match } = this.props;

    const params = match.params.catId;
    if (params) {
      shop.products.updateFilter(params);
    }
  }

  componentDidUpdate(prevProps) {
    const { shop, match } = this.props;
    const params = match.params.catId;
    if (params !== prevProps.match.params.catId) {
      shop.products.updateFilter(params);
    }

    if (params === undefined && prevProps.match.params.catId === undefined) {
      return;
    }

    if (params === undefined) {
      shop.products.updateFilter();
    }
  }

  render() {
    let items;
    const { shop, match } = this.props;
    const { sort, filter, searchTerm, loadingProductsError } = shop.products;

    if (searchTerm) {
      // Limit products by search term
      items = shop.productSearch(searchTerm);
    } else {
      // if no search, load all products
      items = shop.products.data;
    }

    // sorts items array formed from above
    if (sort === 'ascending') {
      items = items.slice().sort((a, b) => a.price - b.price);
    } else if (sort === 'decending') {
      items = items.slice().sort((a, b) => b.price - a.price);
    }

    // filters items array formed from above
    if (filter) {
      items = items.filter(item => item.categories[1] === parseInt(filter, 10));
    }

    if (loadingProductsError) {
      return (
        <ErrorPage
          errorTitle="Hmm, this page was just here a moment ago."
          errorMsg="Don’t worry, we simply got temporarily disconnected.
      Please refresh the page to try again."
          errorType="load"
          refreshBtn
        />
      );
    }

    if (shop.products.productCount > 0) {
      if (items.length > 0) {
        return (
          <section className="product-catalog section content container">
            {/* <Sort /> */}
            <h2 className="product-catalog-title has-text-centered">
              {' '}
              All Products
            </h2>
            <div className="has-text-centered">
              <Switch match={match}>
                <div className="content">
                  <div className="columns is-multiline is-mobile">
                    {items.map(product => (
                      <ProductsCatalogItem
                        key={product.id}
                        product={product}
                        match={match}
                      />
                    ))}
                  </div>
                </div>
                <Route
                  exact
                  path={`/${match.url}/:productId`}
                  component={ProductShow}
                />
              </Switch>
            </div>
          </section>
        );
      }
      if (items.length === 0) {
        return (
          <section className="section">
            {/* <Sort /> */}
            <div className="container has-text-centered">
              <Switch match={match}>
                <div className="content">
                  <h1> No Products Found </h1>
                  <ShopProductsBtn />
                </div>
                <Route
                  exact
                  path={`/${match.url}/:productId`}
                  component={ProductShow}
                />
              </Switch>
            </div>
          </section>
        );
      }
    }
    return (
      <div className="spinner-container">
        <LoadingView />
      </div>
    );
  }
}

export default ProductsCatalog;
