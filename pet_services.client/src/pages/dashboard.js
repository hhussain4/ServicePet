import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import dashban2 from "../assets/dashban2.png";
import christmas from "../assets/christmas.png";
const Dashboard = () => {
  return (
    <div className="App">
      <NavBar />
      <div className="mt-10 flex justify-center">
        <img
          src={dashban2}
          alt="Test"
          className="w-auto h-auto scale-75 border-[#F7ECE9] border-4 rounded-2xl"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-y-6 gap-x-4 p-4">
        {/* Card 1 */}
        <div className="w-[200px] h-[280px] bg-[#FFEDEC] rounded-lg shadow-md p-4 flex flex-col justify-between">
          <div className="p-2 border border-[#F1BABA] rounded-md bg-white text-center mb-2">
            Service Name
          </div>
          <div className="p-4 border border-[#F1BABA] rounded-md bg-white flex-1 text-center mb-1">
            Service Description
          </div>
          <div className="text-center">
            <p className="font-bold">Service Cost</p>
            <p className="text-red-500 text-sm">insurance price varies</p>
          </div>
        </div>
        {/* More Cards Here */}

        {/* Card 2 */}
        <div className="w-[200px] h-[280px] bg-[#FFEDEC] rounded-lg shadow-md p-4 flex flex-col justify-between">
          <div className="p-2 border border-[#F1BABA] rounded-md bg-white text-center mb-2">
            Service Name
          </div>
          <div className="p-4 border border-[#F1BABA] rounded-md bg-white flex-1 text-center mb-1">
            Service Description
          </div>
          <div className="text-center">
            <p className="font-bold">Service Cost</p>
            <p className="text-red-500 text-sm">insurance price varies</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="w-[200px] h-[280px] bg-[#FFEDEC] rounded-lg shadow-md p-4 flex flex-col justify-between">
          <div className="p-2 border border-[#F1BABA] rounded-md bg-white text-center mb-2">
            Service Name
          </div>
          <div className="p-4 border border-[#F1BABA] rounded-md bg-white flex-1 text-center mb-1">
            Service Description
          </div>
          <div className="text-center">
            <p className="font-bold">Service Cost</p>
            <p className="text-red-500 text-sm">insurance price varies</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="w-[200px] h-[280px] bg-[#FFEDEC] rounded-lg shadow-md p-4 flex flex-col justify-between">
          <div className="p-2 border border-[#F1BABA] rounded-md bg-white text-center mb-2">
            Service Name
          </div>
          <div className="p-4 border border-[#F1BABA] rounded-md bg-white flex-1 text-center mb-1">
            Service Description
          </div>
          <div className="text-center">
            <p className="font-bold">Service Cost</p>
            <p className="text-red-500 text-sm">insurance price varies</p>
          </div>
        </div>

        {/* Card 5 */}
        <div className="w-[200px] h-[280px] bg-[#FFEDEC] rounded-lg shadow-md p-4 flex flex-col justify-between">
          <div className="p-2 border border-[#F1BABA] rounded-md bg-white text-center mb-2">
            Service Name
          </div>
          <div className="p-4 border border-[#F1BABA] rounded-md bg-white flex-1 text-center mb-1">
            Service Description
          </div>
          <div className="text-center">
            <p className="font-bold">Service Cost</p>
            <p className="text-red-500 text-sm">insurance price varies</p>
          </div>
        </div>

        {/* Card 6 */}
        <div className="w-[200px] h-[280px] bg-[#FFEDEC] rounded-lg shadow-md p-4 flex flex-col justify-between">
          <div className="p-2 border border-[#F1BABA] rounded-md bg-white text-center mb-2">
            Service Name
          </div>
          <div className="p-4 border border-[#F1BABA] rounded-md bg-white flex-1 text-center mb-1">
            Service Description
          </div>
          <div className="text-center">
            <p className="font-bold">Service Cost</p>
            <p className="text-red-500 text-sm">insurance price varies</p>
          </div>
        </div>

        {/* Card 7 */}
        <div className="w-[200px] h-[280px] bg-[#FFEDEC] rounded-lg shadow-md p-4 flex flex-col justify-between">
          <div className="p-2 border border-[#F1BABA] rounded-md bg-white text-center mb-2">
            Service Name
          </div>
          <div className="p-4 border border-[#F1BABA] rounded-md bg-white flex-1 text-center mb-1">
            Service Description
          </div>
          <div className="text-center">
            <p className="font-bold">Service Cost</p>
            <p className="text-red-500 text-sm">insurance price varies</p>
          </div>
        </div>

        {/* Card 8 */}
        <div className="w-[200px] h-[280px] bg-[#FFEDEC] rounded-lg shadow-md p-4 flex flex-col justify-between">
          <div className="p-2 border border-[#F1BABA] rounded-md bg-white text-center mb-2">
            Service Name
          </div>
          <div className="p-4 border border-[#F1BABA] rounded-md bg-white flex-1 text-center mb-1">
            Service Description
          </div>
          <div className="text-center">
            <p className="font-bold">Service Cost</p>
            <p className="text-red-500 text-sm">insurance price varies</p>
          </div>
        </div>

      </div>

      <div className="christmas flex justify-center "> 
        <img
        src={christmas}
        alt="christmas"
        className="w-auto h-auto scale-75 border-[#F7ECE9] border-4 rounded-2xl"/>
      </div>
    </div>
  );
};

export default Dashboard;
