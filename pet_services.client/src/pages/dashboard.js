import React from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  return (
    
    
    
    
    
    <div className="App">
      <div className="top-bar">
        <div className="logo">ServicePet</div>
        <div className="user-menu">
          <div className="user-icon">👤</div>
          <div className="dropdown">
            <button className="dropbtn hover:bg-#0056b3">☰</button>
            <div className="dropdown-content">
              <Link to="/settings">User Settings</Link>
              <Link to="/logout">Sign Out</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="nav-bar">
        <Link to="/appointments" className="nav-link">Create Appointment</Link>
      </div>
      <div className="content">
        <p>Welcome to the ServicePet Dashboard!</p>
      </div>
    </div>
  );
};

export default Dashboard;