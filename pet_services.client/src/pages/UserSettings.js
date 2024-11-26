import React, { useState, useEffect } from 'react';
import './UserSettings.css';

const UserSettings = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/user', {
          method: 'GET',
          credentials: 'include', // Include cookies for session
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Password validation
    if (user['new-password'] && user['new-password'] !== user['confirm-password']) {
      setError('New password and confirm password do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
        credentials: 'include', // Include cookies for session
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      const data = await response.json();
      console.log('User information updated successfully:', data);
      setError(''); // Clear error on successful update
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to update user data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
    setError(''); // Clear error on input change
  };

  return (
    <div className="user-settings-container">
      <h1>User Settings</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">First Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={user.name || ''}
          onChange={handleChange}
          required
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={user.email || ''}
          onChange={handleChange}
          required
        />
        <label htmlFor="phone">Phone</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={user.phone || ''}
          onChange={handleChange}
          required
        />
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={user.address || ''}
          onChange={handleChange}
          required
        />
        <label htmlFor="current-password">Current Password</label>
        <input
          type="password"
          id="current-password"
          name="current-password"
          value={user['current-password'] || ''}
          onChange={handleChange}
          required
        />
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          name="new-password"
          value={user['new-password'] || ''}
          onChange={handleChange}
        />
        <label htmlFor="confirm-password">Confirm New Password</label>
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          value={user['confirm-password'] || ''}
          onChange={handleChange}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default UserSettings;