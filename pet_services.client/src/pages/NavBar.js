import React, { useState } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
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
              className="dropdown-content absolute bg-white text-black right-0 mt-2 shadow-lg rounded w-[160px]"
              onMouseLeave={closeDropdown} // Optional: Close when mouse leaves
            >
              <Link
                to="/settings"
                className="block px-4 py-2 hover:bg-gray-200"
                onClick={closeDropdown} // Close dropdown on link click
              >
                User Settings
              </Link>
              <Link
                to="/logout"
                className="block px-4 py-2 hover:bg-gray-200"
                onClick={closeDropdown} // Close dropdown on link click
              >
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;