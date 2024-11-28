import React, { useState, useEffect } from 'react';
import './UserSettings.css';
import PetsPage from './PetsPage';

const UserSettings = () => {
  const [user, setUser] = useState({});
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) {
          throw new Error('No session token found. Please log in.');
        }

        // Fetch user data
        const userResponse = await fetch('http://localhost:5000/api/user', {
          headers: { Authorization: `Bearer ${sessionToken}` },
        });

        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch pets
        const petsResponse = await fetch('http://localhost:5000/api/pets', {
          headers: { Authorization: `Bearer ${sessionToken}` },
        });

        if (!petsResponse.ok) throw new Error('Failed to fetch pets');
        const petsData = await petsResponse.json();
        setPets(petsData);

        // Extract pet IDs and fetch appointments
        const petIDs = petsData.map((pet) => pet.petID);
        fetchAppointments(petIDs, sessionToken);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load user data.');
      }
    };

    const fetchAppointments = async (petIDs, sessionToken) => {
      try {
        if (petIDs.length === 0) {
          setAppointments([]);
          return;
        }

        const response = await fetch('http://localhost:5000/api/user/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({ petIDs }),
        });

        if (!response.ok) throw new Error('Failed to fetch appointments');
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to fetch appointments.');
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user['new-password'] && user['new-password'] !== user['confirm-password']) {
      setError('New password and confirm password do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error('Failed to update user data');
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to update user data.');
    }
  };

  const now = new Date();
  const pastAppointments = appointments.filter((appt) => new Date(appt.date) < now);
  const upcomingAppointments = appointments.filter((appt) => new Date(appt.date) >= now);

  return (
    <div>
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
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={user.address || ''}
            onChange={handleChange}
            required
          />
          <label htmlFor="SSN">SSN</label>
          <input
            type="text"
            id="SSN"
            name="SSN"
            value={user.SSN || ''}
            disabled
          />
          <label htmlFor="current-password">Current Password</label>
          <input
            type="password"
            id="current-password"
            name="current-password"
            placeholder="Enter current password"
            onChange={handleChange}
          />
          <label htmlFor="new-password">New Password</label>
          <input
            type="password"
            id="new-password"
            name="new-password"
            placeholder="Enter new password"
            onChange={handleChange}
          />
          <label htmlFor="confirm-password">Confirm New Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="Confirm new password"
            onChange={handleChange}
          />
          <button type="submit">Save</button>
        </form>
      </div>

      <div>
        <PetsPage />
      </div>

      {/* Appointments Section */}
      <div className="appointments-section">
        <h2>Upcoming Appointments</h2>
        {upcomingAppointments.length === 0 ? (
          <p>No upcoming appointments</p>
        ) : (
          <ul>
            {upcomingAppointments.map((appt) => (
              <li key={appt.appointmentID}>
                {appt.date} at {appt.time} with Dr. {appt.doctorName} at {appt.hospitalName} for {appt.petName}
              </li>
            ))}
          </ul>
        )}

        <h2>Past Appointments</h2>
        {pastAppointments.length === 0 ? (
          <p>No past appointments</p>
        ) : (
          <ul>
            {pastAppointments.map((appt) => (
              <li key={appt.appointmentID}>
                {appt.date} at {appt.time} with Dr. {appt.doctorName} at {appt.hospitalName} for {appt.petName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserSettings;
