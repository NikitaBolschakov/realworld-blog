import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.scss';
import App from './App.jsx';
import { store } from './app/store.js';
import { BrowserRouter as Router } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>  
      <StrictMode>
        <App />
      </StrictMode>
    </Router>
  </Provider>
);
