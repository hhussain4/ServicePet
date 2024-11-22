import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'; // Make sure to import the CSS file

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      onLogin(); // Call the onLogin prop to update the authentication status
      navigate('/'); // Redirect to the dashboard
    } catch (error) {
      console.error('Error:', error);
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="login-container flex justify-center items-center h-screen w-screen bg-[#F7ECE9]">
      <div className="login-box bg-[#F1BABA] p-10 rounded-lg shadow-md w-[400px] max-w-full">
        <h1 className= "mb-5 text-2xl text-center">Login</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="block mb-1 font-bold text-left" >Email:</label>
          <input className="w-full p-2 mb-5 border border-gray-300 rounded"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password" className="block mb-1 font-bold text-left">Password:</label>
          <input className="w-full p-2 mb-5 border border-gray-300 rounded"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full p-2 bg-[#AF4934] text-black border-none rounded cursor-pointer hover:bg-[#E4A79A] transition">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;