import React, { useState, useEffect } from 'react';

const Appointment = () => {
  const [pets, setPets] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [appointment, setAppointment] = useState({
    petID: '',
    doctorName: '',
    hospitalName: '',
    date: '',
    time: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch pets, doctors, and hospitals on component load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) throw new Error('No session token found. Please log in.');

        const [petsResponse, doctorsResponse, hospitalsResponse] = await Promise.all([
          fetch('http://localhost:5000/api/appointments/pets', {
            headers: { Authorization: `Bearer ${sessionToken}` },
          }),
          fetch('http://localhost:5000/api/appointments/doctors'),
          fetch('http://localhost:5000/api/appointments/hospitals'),
        ]);

        if (!petsResponse.ok || !doctorsResponse.ok || !hospitalsResponse.ok) {
          throw new Error('Failed to fetch required data');
        }

        setPets(await petsResponse.json());
        setDoctors(await doctorsResponse.json());
        setHospitals(await hospitalsResponse.json());
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load data. Please try again.');
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'hospitalName') {
      const selectedHospital = hospitals.find((hospital) => hospital.name === value);
      setAppointment((prev) => ({
        ...prev,
        hospitalName: value,
        address: selectedHospital ? selectedHospital.location : '',
      }));
    } else {
      setAppointment((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) throw new Error('No session token found. Please log in.');

      const response = await fetch('http://localhost:5000/api/appointments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(appointment),
      });

      if (!response.ok) throw new Error('Failed to create appointment');

      const data = await response.json();
      setSuccess(`Appointment created successfully! ID: ${data.appointmentID}`);
      setAppointment({
        petID: '',
        doctorName: '',
        hospitalName: '',
        date: '',
        time: '',
        address: '',
      });
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to create appointment. Please try again.');
    }
  };

  return (
    <div className="appointment-container">
      <h1>Create an Appointment</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="petID">Select Pet</label>
        <select id="petID" name="petID" value={appointment.petID} onChange={handleInputChange} required>
          <option value="">Choose a pet</option>
          {pets.map((pet) => (
            <option key={pet.petID} value={pet.petID}>
              {pet.name} ({pet.breed})
            </option>
          ))}
        </select>

        <label htmlFor="doctorName">Select Doctor</label>
        <select id="doctorName" name="doctorName" value={appointment.doctorName} onChange={handleInputChange} required>
          <option value="">Choose a doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.doctorID} value={doctor.name}>
              {doctor.name} - {doctor.specialty}
            </option>
          ))}
        </select>

        <label htmlFor="hospitalName">Select Hospital</label>
        <select id="hospitalName" name="hospitalName" value={appointment.hospitalName} onChange={handleInputChange} required>
          <option value="">Choose a hospital</option>
          {hospitals.map((hospital) => (
            <option key={hospital.hospitalID} value={hospital.name}>
              {hospital.name} - {hospital.location}
            </option>
          ))}
        </select>

        <label htmlFor="date">Date</label>
        <input type="date" id="date" name="date" value={appointment.date} onChange={handleInputChange} required />

        <label htmlFor="time">Time</label>
        <input type="time" id="time" name="time" value={appointment.time} onChange={handleInputChange} required />

        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={appointment.address}
          onChange={handleInputChange}
          required
          readOnly
        />

        <button type="submit">Create Appointment</button>
      </form>
    </div>
  );
};

export default Appointment;
