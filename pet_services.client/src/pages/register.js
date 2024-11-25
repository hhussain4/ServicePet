import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css'; // Make sure to create and import the CSS file

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ssn, setSsn] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, ssn, address }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      navigate('/login'); // Redirect to the login page after successful registration
    } catch (error) {
      console.error('Error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container flex justify-center items-center h-screen w-screen bg-[#F7ECE9]">
      <div className="register-box bg-[#F1BABA] p-10 rounded-lg shadow-md w-[400px] max-w-full">
        <h1 className="mb-5 text-2xl text-center">Register</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="name" className="block mb-1 font-bold text-left">Name:</label>
          <input
            className="w-full p-2 mb-5 border border-gray-300 rounded"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="email" className="block mb-1 font-bold text-left">Email:</label>
          <input
            className="w-full p-2 mb-5 border border-gray-300 rounded"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password" className="block mb-1 font-bold text-left">Password:</label>
          <input
            className="w-full p-2 mb-5 border border-gray-300 rounded"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="ssn" className="block mb-1 font-bold text-left">SSN:</label>
          <input
            className="w-full p-2 mb-5 border border-gray-300 rounded"
            type="text"
            id="ssn"
            value={ssn}
            onChange={(e) => setSsn(e.target.value)}
            required
          />
          <label htmlFor="address" className="block mb-1 font-bold text-left">Address:</label>
          <input
            className="w-full p-2 mb-5 border border-gray-300 rounded"
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <button type="submit" className="w-full p-2 bg-[#AF4934] text-black border-none rounded cursor-pointer hover:bg-[#E4A79A] transition">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;