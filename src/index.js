import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// Note: older versions of react-router-dom exported
// `UNSAFE_logV6DeprecationWarnings`. Newer versions don't expose it,
// and it's safe to remove the call — it was only used to toggle
// noisy deprecation logging for v6->v7 migration.

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
