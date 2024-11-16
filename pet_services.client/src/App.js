import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/dashboard';
import Appointments from './pages/appointments';
import Login from './pages/login';
import UserSettings from './pages/UserSettings'; // Assuming you have this component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;