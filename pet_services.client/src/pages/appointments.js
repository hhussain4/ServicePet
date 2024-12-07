import React, { useState, useEffect } from 'react';
import NavBar from "./NavBar";
import appointmentsBanner from "../assets/AppointmentsBanner.png";
import InsurancePolicy from './InsurancePolicy';

const Appointment = () => {
  const [userId] = useState(localStorage.getItem('userId')); // Replace with actual user ID logic
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
  const [isInsuranceValid, setIsInsuranceValid] = useState(false);

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

  // Handle form input changes
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

  // Submit appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isInsuranceValid) {
      setError('Please validate your insurance before creating an appointment.');
      return;
    }

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
    <div>
      <NavBar />
      <div className="mt-10 flex justify-center">
        <img
          src={appointmentsBanner}
          alt="appointments"
          className="w-auto h-auto scale-90 border-[#F7ECE9] border-4 rounded-2xl"
        />
      </div>
      <div className="appointment-container mt-12 mb-12 max-w-screen-lg mx-auto border-[#F7ECE9] border-4 rounded-2xl">
        <h1 className="text-[34px] text-left ml-2">Create an Appointment</h1>
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
  
        {/* Insurance Policy Validation */}
        <InsurancePolicy onInsuranceValidated={setIsInsuranceValid} />
  
        <form onSubmit={handleSubmit}>
          <div className="flex justify-evenly mb-4">
            {/* Select Pet */}
            <div>
              <label htmlFor="petID" className="block">Select Pet:</label>
              <select
                id="petID"
                name="petID"
                value={appointment.petID}
                onChange={handleInputChange}
                required
                className="border-black border-2 rounded-lg p-1 w-48 text-left"
              >
                <option value="">Choose a pet</option>
                {pets.map((pet) => (
                  <option key={pet.petID} value={pet.petID}>
                    {pet.name} ({pet.breed})
                  </option>
                ))}
              </select>
            </div>
  
            {/* Select Doctor */}
            <div>
              <label htmlFor="doctorName" className="block">Select Doctor:</label>
              <select
                id="doctorName"
                name="doctorName"
                value={appointment.doctorName}
                onChange={handleInputChange}
                required
                className="border-black border-2 rounded-lg p-1 w-48 text-left"
              >
                <option value="">Choose a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.doctorID} value={doctor.name}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>
            </div>
  
            {/* Select Hospital */}
            <div>
              <label htmlFor="hospitalName" className="block">Select Hospital:</label>
              <select
                id="hospitalName"
                name="hospitalName"
                value={appointment.hospitalName}
                onChange={handleInputChange}
                required
                className="border-black border-2 rounded-lg p-1 w-48 text-left"
              >
                <option value="">Choose a hospital</option>
                {hospitals.map((hospital) => (
                  <option key={hospital.hospitalID} value={hospital.name}>
                    {hospital.name} - {hospital.location}
                  </option>
                ))}
              </select>
            </div>
          </div>
  
          <div className="flex justify-evenly mb-4">
            {/* Date */}
            <div>
              <label htmlFor="date" className="block">Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={appointment.date}
                onChange={handleInputChange}
                required
                className="border-black border-2 rounded-lg p-1 w-48 text-left"
              />
            </div>
  
            {/* Time */}
            <div>
              <label htmlFor="time" className="block">Time:</label>
              <input
                type="time"
                id="time"
                name="time"
                value={appointment.time}
                onChange={handleInputChange}
                required
                className="border-black border-2 rounded-lg p-1 w-48 text-left"
              />
            </div>
  
            {/* Address */}
            <div>
              <label htmlFor="address" className="block">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={appointment.address}
                onChange={handleInputChange}
                required
                readOnly
                className="border-black border-2 rounded-lg p-1 w-48 text-left bg-gray-100 text-gray-500"
              />
            </div>
          </div>
  
          <div className="flex justify-end p-2">
            <button
              type="submit"
              disabled={!isInsuranceValid}
              className={`bg-[#FFEDEC] border-black border-2 rounded-md px-4 py-1 ${
                isInsuranceValid ? "hover:bg-[#F7ECE9]" : "cursor-not-allowed"
              }`}
            >
              Create Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Appointment;
