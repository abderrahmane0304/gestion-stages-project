import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EtudiantDashboard from './pages/EtudiantDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (id, role) => {
    setUserId(id);
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserId(null);
    setUserRole(null);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home onLogin={handleLogin} />} />
          <Route 
            path="/etudiant" 
            element={<EtudiantDashboard userId={userId} onLogout={handleLogout} />} 
          />
          <Route 
            path="/admin" 
            element={<AdminDashboard userId={userId} onLogout={handleLogout} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
