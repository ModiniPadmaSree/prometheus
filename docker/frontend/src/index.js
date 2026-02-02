import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.module.css'; // Importing your global CSS module

const root = ReactDOM.createRoot(document.getElementById('root')); // Creating the React 18 root
root.render(<App />); // Rendering the main App component into the root
