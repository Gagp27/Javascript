import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css";
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render( //Disabled strictMode for disabled double call in useEffect
  //<React.StrictMode>
    <App />
  //</React.StrictMode>
);
