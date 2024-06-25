import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './src/styles/App.css';
import AIWebsite from './Ai-News';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AIWebsite/>} />
      </Routes>
        
    </Router>
  );
}

export default App;
