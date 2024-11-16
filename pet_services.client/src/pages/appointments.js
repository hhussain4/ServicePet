import React, { useState } from 'react';
import './appointment.css';

const Appointments = () => {
  const [step, setStep] = useState(1);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedVet, setSelectedVet] = useState('');

  const vetOptions = {
    'New York City': ['Dr. Smith', 'Dr. Johnson'],
    'Buffalo': ['Dr. Brown', 'Dr. Davis'],
    'Rochester': ['Dr. Wilson', 'Dr. Garcia'],
    'Yonkers': ['Dr. Martinez', 'Dr. Anderson']
  };

  const showStep = (step) => {
    setStep(step);
  };

  const enableNext = (step) => {
    if (step === 1 && selectedCity) {
      document.getElementById('select-vet-btn').disabled = false;
    }
    if (step === 2 && selectedVet) {
      document.getElementById('select-time-btn').disabled = false;
    }
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    enableNext(1);
  };

  const handleVetChange = (event) => {
    setSelectedVet(event.target.value);
    enableNext(2);
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
              <a href="/settings">User Settings</a>
              <a href="/logout">Sign Out</a>
            </div>
          </div>
        </div>
      </div>
      <div className="nav-bar">
        <a href="/" className="nav-link">Dashboard</a>
        <a href="/appointments" className="nav-link">Create Appointment</a>
      </div>
      <div className="content">
        <h2>Create Appointment</h2>
        <div className="button-row">
          <button className="step-button" onClick={() => showStep(1)}>Select Location</button>
          <button className="step-button" onClick={() => showStep(2)} disabled id="select-vet-btn">Select Vet</button>
          <button className="step-button" onClick={() => showStep(3)} disabled id="select-time-btn">Select Time</button>
        </div>
        <form id="appointment-form">
          {/* Step 1: Select Location */}
          <div className={`step ${step === 1 ? 'active' : ''}`} id="step-1">
            <h3>Select Location</h3>
            <label><input type="radio" name="city" value="New York City" onChange={handleCityChange} /> New York City</label><br />
            <label><input type="radio" name="city" value="Buffalo" onChange={handleCityChange} /> Buffalo</label><br />
            <label><input type="radio" name="city" value="Rochester" onChange={handleCityChange} /> Rochester</label><br />
            <label><input type="radio" name="city" value="Yonkers" onChange={handleCityChange} /> Yonkers</label><br />
            <button className="step-button" type="button" onClick={() => showStep(2)} disabled id="next-step-1">Next</button>
          </div>
          
          {/* Step 2: Select Vet */}
          <div className={`step ${step === 2 ? 'active' : ''}`} id="step-2">
            <h3>Select Vet</h3>
            <div id="vet-options">
              {selectedCity && vetOptions[selectedCity].map((vet) => (
                <label key={vet}>
                  <input type="radio" name="vet" value={vet} onChange={handleVetChange} /> {vet}<br />
                </label>
              ))}
            </div>
            <button className="step-button" type="button" onClick={() => showStep(3)} disabled id="next-step-2">Next</button>
          </div>
          
          {/* Step 3: Select Time */}
          <div className={`step ${step === 3 ? 'active' : ''}`} id="step-3">
            <h3>Select Time</h3>
            <p>Select Time functionality is not implemented yet.</p>
            <button className="step-button" type="submit">Save Appointment</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Appointments;