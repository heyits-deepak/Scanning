// main.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import VulSolution from './VulSolution.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/vulsolution" element={<VulSolution />} />
      <Route path="/" element={<App />} />
    </Routes>
  </Router>,
);
