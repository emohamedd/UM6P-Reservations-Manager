import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot
import App from './App'; // Ensure this is the correct path to your App component

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
