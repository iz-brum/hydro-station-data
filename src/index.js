import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { UNSAFE_logV6DeprecationWarnings } from 'react-router-dom';

UNSAFE_logV6DeprecationWarnings({
  v7_startTransition: true,
  v7_relativeSplatPath: true,
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
