import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/dashboard';
import Appointments from './pages/appointments';
import Login from './pages/login';
import Register from './pages/register'; // Import the Register component
import UserSettings from './pages/UserSettings'; // Assuming you have this component
import PetsPage from './pages/PetsPage'; // Assuming you have this component
import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} /> {/* Add this line */}
          <Route
            path="/appointments"
            element={isAuthenticated ? <Appointments /> : <Navigate to="/login" />}
          />
          <Route
            path="/pets"
            element={isAuthenticated ? <PetsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={isAuthenticated ? <UserSettings /> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;