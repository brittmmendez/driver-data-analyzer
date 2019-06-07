import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LandingPage from './LandingPage';
import ProductsCatalog from './ProductsCatalog';
import ProductShow from './ProductShow';
import ErrorPage from './ErrorPage';
import FormikLogin from './FormikLogin';
import FormikRegister from './FormikRegister';
import Account from './Account';
import OrderLookUp from './OrderLookUp';
import OrderConfirmation from './OrderConfirmation';
// import FormikSearch from '../components/FormikSearch';
import MyCart from './MyCart';
// import Basic from './zoom/Basic';
// import ReactSlickInt from './zoom/ReactSlickIntegration';
import Checkout from './Checkout';
// import About from './About';
import ExchangesReturns from './ExchangesReturns';
import FAQs from './FAQs';
import SiteMap from './SiteMap';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={LandingPage} />
    <Route exact path="/products-page/:productId" component={ProductShow} />
    {/* <Route
      exact
      path="/products-page/c/:catId"
      component={ProductsCatalog}
      category
    /> */}
    <Route exact path="/products-page" component={ProductsCatalog} />
    {/* <Route exact path="/search" component={FormikSearch} /> */}
    <Route exact path="/search/:searchTerm" component={ProductsCatalog} />
    <Route exact path="/order-lookup" component={OrderLookUp} />
    <Route
      exact
      path="/order-confirmation"
      component={OrderConfirmation}
    />
    {/* <Route path="/basic" component={Basic} /> */}
    {/* <Route path="/reactslickintegration" component={ReactSlickInt} /> */}
    {/* <Route path="/about" component={About} /> */}
    <Route path="/exchanges-returns" component={ExchangesReturns} />
    <Route path="/faq" component={FAQs} />
    <Route path="/site-map" component={SiteMap} />
    <Route path="/my-cart" component={MyCart} />
    <Route path="/checkout" component={Checkout} />
    <Route path="/shipping" component={Checkout} />
    <Route path="/billing" component={Checkout} />
    <Route path="/terms-and-conditions" component={Checkout} />
    <Route path="/review-order" component={Checkout} />
    <Route path="/register" component={FormikRegister} />
    <Route path="/login" component={FormikLogin} />
    <Route path="/account" component={Account} />
    <Route component={ErrorPage} />
  </Switch>
);

export default Routes;
