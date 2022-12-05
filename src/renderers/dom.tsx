import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from '../components/App';

// Hot module replacement logic to accept updates from webpack-dev-server
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);
