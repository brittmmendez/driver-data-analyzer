import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import App from './containers/App';
import './styles/index.scss';
import Shop from './models/Shop';

const shop = Shop.create({});

ReactDOM.render(
  <Provider shop={shop}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
