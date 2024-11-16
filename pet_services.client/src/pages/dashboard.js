import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const [loginStatus, setLoginStatus] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      setLoginStatus('Login successful');
      console.log('Login successful:', data);
    } catch (error) {
      setLoginStatus('Login failed');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className="top-bar">
        <div className="logo">ServicePet</div>
        <div className="user-menu">
          <div className="user-icon">👤</div>
          <div className="dropdown">
            <button className="dropbtn">☰</button>
            <div className="dropdown-content">
              <Link to="/settings">User Settings</Link>
              <Link to="/logout">Sign Out</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="nav-bar">
        <Link to="/" className="nav-link">Dashboard</Link>
        <Link to="/appointments" className="nav-link">Create Appointment</Link>
        <Link to="/login" className="nav-link">Login</Link>
      </div>
      <div className="content">
        <p>Welcome to the ServicePet Dashboard!</p>
        <button onClick={handleLogin}>Test Login</button>
        {loginStatus && <p>{loginStatus}</p>}
      </div>
    </div>
  );
};

export default Dashboard;