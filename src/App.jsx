import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import StudentCard from './components/StudentCard';
import IssueData from './components/IssueData';
import './index.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <h1>📚 My Library Manager</h1>

        <nav className='navDiv'>
          <Link to="/" className='navBox' >Students</Link>
          <Link to="/Issue" className='navBox'>Issue </Link>
        </nav>
        <Routes>
          <Route path="/Issue" element={<IssueData/>} />
          <Route path="/" element={<StudentCard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;