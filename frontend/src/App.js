import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Fase1 from './components/Fase1';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/fase1">Fase 1</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fase1" element={<Fase1 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;