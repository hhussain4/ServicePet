import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/dashboard';
import Appointments from './pages/appointments';
import Login from './pages/login';
import Register from './pages/register'; // Import the Register component
import UserSettings from './pages/UserSettings'; // Assuming you have this component
import PetsPage from './pages/PetsPage'; // Assuming you have this component
import { useState, useEffect } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state to prevent unnecessary redirects during validation

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const sessionToken = localStorage.getItem('sessionToken');

    if (sessionToken) {
      // Validate the session token with the backend
      const validateSession = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/user', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          });

          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('sessionToken'); // Remove invalid session token
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error validating session token:', error);
          localStorage.removeItem('sessionToken');
          setIsAuthenticated(false);
        } finally {
          setLoading(false); // Loading complete
        }
      };

      validateSession();
    } else {
      setLoading(false); // No session token, stop loading
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner or message while validating the session
  }

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
