import React, { useState, useEffect } from 'react';

const PetsPage = () => {
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]); // Added state for appointments
  const [newPet, setNewPet] = useState({ breed: '', name: '', birthDate: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch pets and appointments when the component loads
  useEffect(() => {
    const fetchPetsAndAppointments = async () => {
      try {
        const sessionToken = localStorage.getItem('sessionToken');

        if (!sessionToken) {
          throw new Error('No session token found. Please log in.');
        }

        // Fetch pets
        const petsResponse = await fetch('http://localhost:5000/api/pets', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });

        if (!petsResponse.ok) {
          throw new Error('Failed to fetch pets');
        }

        const petsData = await petsResponse.json();
        setPets(petsData);

        // Fetch appointments
        const petIDs = petsData.map((pet) => pet.petID);
        const appointmentsResponse = await fetch('http://localhost:5000/api/user/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({ petIDs }),
        });

        if (!appointmentsResponse.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to fetch pets or appointments.');
      }
    };

    fetchPetsAndAppointments();
  }, []);

  // Handle adding a new pet
  const handleAddPet = async (event) => {
    event.preventDefault();

    try {
      const sessionToken = localStorage.getItem('sessionToken');

      if (!sessionToken) {
        throw new Error('No session token found. Please log in.');
      }

      const response = await fetch('http://localhost:5000/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(newPet),
      });

      if (!response.ok) {
        throw new Error('Failed to add pet');
      }

      const data = await response.json();
      setPets((prevPets) => [...prevPets, { ...newPet, petID: data.petID }]);
      setNewPet({ breed: '', name: '', birthDate: '' }); // Reset the form
      setSuccess('Pet added successfully.');
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to add pet.');
      setSuccess('');
    }
  };

  // Handle deleting a pet and its appointments
  const handleDeletePet = async (petID) => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');

      if (!sessionToken) {
        throw new Error('No session token found. Please log in.');
      }

      const response = await fetch(`http://localhost:5000/api/pets/${petID}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete pet');
      }

      // Update state to remove the pet and its related appointments
      setPets((prevPets) => prevPets.filter((pet) => pet.petID !== petID));
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment.petID !== petID)
      );
      setSuccess('Pet and associated appointments deleted successfully.');
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to delete pet.');
      setSuccess('');
    }
  };

  const handlePetChange = (e) => {
    const { name, value } = e.target;
    setNewPet((prevPet) => ({ ...prevPet, [name]: value }));
  };

  return (
    <div className="pets-page-container border-[#F7ECE9] border-4 rounded-2xl">
      <h1 className="text-[34px] text-left ml-2">Pet Information</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <ul className='flex flex-col items-center justify-center p-2 space-y-1'>
        {pets.map((pet) => (
          <li className="flex items-center" key={pet.petID}>
            {pet.name} ({pet.breed}) - Born on {pet.birthDate}
            <button className=" bg-[#FFEDEC] border-black border-2 rounded-md items-center px-2 py-0 ml-9 mb-2" onClick={() => handleDeletePet(pet.petID)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3 className="text-[24px] text-left ml-2 mb-4">Add a New Pet</h3>
      <form onSubmit={handleAddPet}>
        <div className="flex justify-evenly mb-4">
        <div>
        <label htmlFor="name">Name: </label>
        <input
          type="text"
          id="name"
          name="name"
          value={newPet.name}
          onChange={handlePetChange}
          required
          className="border-black border-2 rounded-lg p-[1px] w-48 text-left"
        />
        </div>
        <div>
        <label htmlFor="breed">Breed: </label>
        <input
          type="text"
          id="breed"
          name="breed"
          value={newPet.breed}
          onChange={handlePetChange}
          required
          className="border-black border-2 rounded-lg p-[1px] w-48 text-left"
        />
</div>
<div>
        <label htmlFor="birthDate">Birth Date: </label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={newPet.birthDate}
          onChange={handlePetChange}
          required
          className="border-black border-2 rounded-lg p-[1px] w-48 text-left"
        />
</div>
        <button type="submit" className=" bg-[#FFEDEC] border-black border-2 rounded-md items-center px-2 py-0 ml-2">Add Pet</button>
        </div>
      </form>

      {/*<h2>Appointments</h2>*/}
      { /* appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        <ul>
          {appointments.map((appt) => (
            <li key={appt.appointmentID}>
              {appt.petName}: {appt.date} at {appt.time} with Dr. {appt.doctorName} at {appt.hospitalName}
            </li>
          ))}
        </ul>
      ) */}
    </div>
  );
};

export default PetsPage;
