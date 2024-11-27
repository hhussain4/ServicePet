import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar"

const Dashboard = () => {
  return (
    <div className="App">
      <NavBar />
      <div className="">
        <img src="./assets/DashBanner.png"/>
      </div>
    </div>
  );
};

export default Dashboard;