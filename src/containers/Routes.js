import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LandingPage from './LandingPage';
import AnalyzeData from './AnalyzeData';
import About from './About';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={LandingPage} />
    <Route exact path="/analyze" component={AnalyzeData} />
    <Route exact path="/about" component={About} />
    <Route component={LandingPage} />
  </Switch>
);

export default Routes;
