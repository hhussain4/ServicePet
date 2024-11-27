import React, { useState, useEffect } from 'react';

const PetsPage = () => {
  const [pets, setPets] = useState([]);
  const [newPet, setNewPet] = useState({ breed: '', name: '', birthDate: '' });
  const [error, setError] = useState('');

  // Fetch pets when the component loads
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const sessionToken = localStorage.getItem('sessionToken');

        if (!sessionToken) {
          throw new Error('No session token found. Please log in.');
        }

        const response = await fetch('http://localhost:5000/api/pets', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${sessionToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch pets');
        }

        const data = await response.json();
        setPets(data);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to fetch pets');
      }
    };

    fetchPets();
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
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(newPet),
      });

      if (!response.ok) {
        throw new Error('Failed to add pet');
      }

      const data = await response.json();
      console.log('Pet added successfully:', data);
      setPets((prevPets) => [...prevPets, { ...newPet, petID: data.petID }]);
      setNewPet({ breed: '', name: '', birthDate: '' }); // Reset the form
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to add pet');
    }
  };

  const handlePetChange = (e) => {
    const { name, value } = e.target;
    setNewPet((prevPet) => ({ ...prevPet, [name]: value }));
  };

  return (
    <div className="pets-page-container">
      <h1>Your Pets</h1>
      {error && <p className="error">{error}</p>}

      <ul>
        {pets.map((pet) => (
          <li key={pet.petID}>
            {pet.name} ({pet.breed}) - Born on {pet.birthDate}
          </li>
        ))}
      </ul>

      <h3>Add a New Pet</h3>
      <form onSubmit={handleAddPet}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={newPet.name}
          onChange={handlePetChange}
          required
        />
        <label htmlFor="breed">Breed</label>
        <input
          type="text"
          id="breed"
          name="breed"
          value={newPet.breed}
          onChange={handlePetChange}
          required
        />
        <label htmlFor="birthDate">Birth Date</label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={newPet.birthDate}
          onChange={handlePetChange}
          required
        />
        <button type="submit">Add Pet</button>
      </form>
    </div>
  );
};

export default PetsPage;
