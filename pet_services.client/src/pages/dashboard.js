import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar"
import testImage from "../assets/test.jpeg";
const Dashboard = () => {
  return (
    <div className="App">
      <NavBar />
      <div className="">
      <img src={testImage} alt="Test" />
      </div>
    </div>
  );
};

export default Dashboard;