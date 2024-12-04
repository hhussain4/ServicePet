import React, { useState, useEffect } from "react";
import "./UserSettings.css";
import PetsPage from "./PetsPage";
import NavBar from "./NavBar";
import settingsBanner from "../assets/settingsBanner.png";

const UserSettings = () => {
  const [user, setUser] = useState({});
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const sessionToken = localStorage.getItem("sessionToken");
        if (!sessionToken) {
          throw new Error("No session token found. Please log in.");
        }

        // Fetch user data
        const userResponse = await fetch("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${sessionToken}` },
        });

        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch pets
        const petsResponse = await fetch("http://localhost:5000/api/pets", {
          headers: { Authorization: `Bearer ${sessionToken}` },
        });

        if (!petsResponse.ok) throw new Error("Failed to fetch pets");
        const petsData = await petsResponse.json();
        setPets(petsData);

        // Extract pet IDs and fetch appointments
        const petIDs = petsData.map((pet) => pet.petID);
        fetchAppointments(petIDs, sessionToken);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load user data.");
      }
    };

    const fetchAppointments = async (petIDs, sessionToken) => {
      try {
        if (petIDs.length === 0) {
          setAppointments([]);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/user/appointments",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionToken}`,
            },
            body: JSON.stringify({ petIDs }),
          }
        );

        if (!response.ok) throw new Error("Failed to fetch appointments");
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to fetch appointments.");
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      user["new-password"] &&
      user["new-password"] !== user["confirm-password"]
    ) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const sessionToken = localStorage.getItem("sessionToken");
      if (!sessionToken) {
        throw new Error("No session token found. Please log in.");
      }

      const response = await fetch("http://localhost:5000/api/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          address: user.address,
          currentPassword: user["current-password"], // Optional
          newPassword: user["new-password"], // Optional
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user data.");
      }

      setSuccess("User data updated successfully.");
      setUser((prevUser) => ({
        ...prevUser,
        "current-password": "",
        "new-password": "",
        "confirm-password": "",
      }));
    } catch (error) {
      console.error("Error updating user data:", error);
      setError(error.message);
    }
  };
  const deletePet = async (petID) => {
    try {
      const sessionToken = localStorage.getItem("sessionToken");
      if (!sessionToken) {
        throw new Error("No session token found. Please log in.");
      }

      const response = await fetch(`http://localhost:5000/api/pets/${petID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete pet.");
      }

      setPets((prevPets) => prevPets.filter((pet) => pet.petID !== petID));
      setSuccess("Pet deleted successfully.");
    } catch (error) {
      console.error("Error deleting pet:", error);
      setError(error.message);
    }
  };
  const deleteAppointment = async (appointmentID) => {
    try {
      const sessionToken = localStorage.getItem("sessionToken");
      if (!sessionToken) {
        throw new Error("No session token found. Please log in.");
      }
  
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete appointment.");
      }
  
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appt) => appt.appointmentID !== appointmentID)
      );
      setSuccess("Appointment deleted successfully.");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setError(error.message);
    }
  };
  
  const now = new Date();
  const pastAppointments = appointments.filter(
    (appt) => new Date(appt.date) < now
  );
  const upcomingAppointments = appointments.filter(
    (appt) => new Date(appt.date) >= now
  );

  return (
    <div>
      <NavBar />
      <div className="mt-10 flex justify-center">
        <img
          src={settingsBanner}
          alt="settings"
          className="w-auto h-auto scale-90 border-[#F7ECE9] border-4 rounded-2xl"
        />
      </div>
      <div className="user-settings-container mt-12 mb-12 max-w-screen-lg mx-auto border-[#F7ECE9] border-4 rounded-2xl">
        <h1 className="text-[34px] text-left ml-2"> User Information</h1>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="name-ssn-email-address flex justify-evenly mb-4">
            <div>
              <label htmlFor="name">Name: </label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name || ""}
                onChange={handleChange}
                required
                className="border-black border-2 rounded-lg p-[1px] w-48 text-left"
              />
            </div>
            <div>
              <label htmlFor="SSN">SSN: </label>
              <input
                type="text"
                id="SSN"
                name="SSN"
                value={user.SSN || ""}
                disabled
                className="border-black border-2 rounded-lg p-[1px] w-48 text-left"
              />
            </div>

            <div>
              <label htmlFor="email">Email: </label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email || ""}
                onChange={handleChange}
                required
                className="border-black border-2 rounded-lg p-[1px] w-48 text-left"
              />
            </div>
            <div>
              <label htmlFor="address">Address: </label>
              <input
                type="text"
                id="address"
                name="address"
                value={user.address || ""}
                onChange={handleChange}
                required
                className="border-black border-2 rounded-lg p-[1px] w-48 text-left"
              />
            </div>
          </div>
          <div className="password-fields flex justify-evenly mb-2">
            <label htmlFor="current-password">Current Password: </label>
            <input
              type="password"
              id="current-password"
              name="current-password"
              placeholder="Enter current password"
              onChange={handleChange}
              className="border-black border-2 rounded-lg p-[1px] w-48 text-left"
            />
            <label htmlFor="new-password">New Password: </label>
            <input
              type="password"
              id="new-password"
              name="new-password"
              placeholder="Enter new password"
              onChange={handleChange}
              className="border-black border-2 rounded-lg p-[1px] w-48 text-left"
            />
            <label htmlFor="confirm-password">Confirm New Password: </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder="Confirm new password"
              onChange={handleChange}
              className="border-black border-2 rounded-lg p-[1px] w-48 text-left"
            />
          </div>
          <div  className="mb-2 flex justify-start p-2">
            <button type="submit" className=" bg-[#FFEDEC] border-black border-2 rounded-md items-center px-2 py-0">Save</button>
          </div>
        </form>
      </div>

      <div className="mb-12 max-w-screen-lg mx-auto">
        <PetsPage />
      </div>

      {/* Appointments Section */}
      <div>
        <div className="appointments-section mb-12 max-w-screen-lg mx-auto border-[#F7ECE9] border-4 rounded-2xl">
          <h2 className="text-[34px] text-left ml-2">Upcoming Appointments</h2>
          {upcomingAppointments.length === 0 ? (
  <p>No upcoming appointments</p>
) : (
  <ul>
    {upcomingAppointments.map((appt) => (
      <li className="mb-2" 
        key={appt.appointmentID}>
        {appt.date} at {appt.time} with Dr. {appt.doctorName} at {appt.hospitalName} for {appt.petName}
        <button
          onClick={() => deleteAppointment(appt.appointmentID)}
          className=" bg-[#FFEDEC] border-black border-2 rounded-md items-center px-2 py-0 ml-2"
        >
          Delete
        </button>
      </li>
    ))}
  </ul>
)}

        </div>
        <div className="appointments-section max-w-screen-lg mx-auto border-[#F7ECE9] border-4 rounded-2xl mb-6">
          <h2 className="text-[34px] text-left ml-2">Past Appointments</h2>
          {pastAppointments.length === 0 ? (
  <p>No past appointments</p>
) : (
  <ul>
    {pastAppointments.map((appt) => (
      <li className="mb-2" 
        key={appt.appointmentID}>
        {appt.date} at {appt.time} with Dr. {appt.doctorName} at {appt.hospitalName} for {appt.petName}
        <button
          onClick={() => deleteAppointment(appt.appointmentID)}
          className=" bg-[#FFEDEC] border-black border-2 rounded-md items-center px-2 py-0 ml-2"
        >
          Delete
        </button>
      </li>
    ))}
  </ul>
)}

        </div>
      </div>
    </div>
  );
};

export default UserSettings;
