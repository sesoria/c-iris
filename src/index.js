import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from './app/store';
import { Provider } from 'react-redux';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);
