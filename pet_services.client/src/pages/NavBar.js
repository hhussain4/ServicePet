import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // For programmatic navigation

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      const sessionToken = localStorage.getItem("sessionToken");
      if (!sessionToken) {
        throw new Error("No session token found. Please log in.");
      }

      const response = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to log out.");
      }

      // Clear localStorage and redirect
      localStorage.removeItem("sessionToken");
      alert("Logged out successfully.");
      navigate("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="NavBar flex justify-between items-center bg-[#F1BABA] p-2 text-black w-full fixed top-0 left-0 z-50">
      {/* Left Section */}
      <div className="NavLeft flex space-x-4">
        <Link to="/dashboard" className="nav-link text-black">
          Homepage
        </Link>
        <Link to="/appointments" className="nav-link text-black">
          Create Appointment
        </Link>
      </div>

      {/* Right Section */}
      <div className="NavRight flex items-center space-x-4">
        {/* User Icon */}
        <div className="user-icon text-xl">👤</div>

        {/* Hamburger Menu */}
        <div className="dropdown relative">
          <button
            onClick={toggleDropdown}
            className="dropbtn bg-[#F1BABA] text-black text-xl focus:outline-none"
          >
            ≣
          </button>
          {isDropdownOpen && (
            <div
              className="dropdown-content absolute bg-white text-black right-0 mt-2 shadow-lg rounded w-[160px] text-center"
              onMouseLeave={closeDropdown} // Optional: Close when mouse leaves
            >
              <Link
                to="/settings"
                className="block px-4 py-2 hover:bg-gray-200 text-center"
                onClick={closeDropdown} // Close dropdown on link click
              >
                User Settings
              </Link>
              <button
                className="block px-4 py-2 hover:bg-gray-200 w-full text-center"
                onClick={() => {
                  closeDropdown();
                  handleLogout();
                }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
