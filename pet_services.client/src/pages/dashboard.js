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
      <div>
        <h4 className="text-red-600 mb-8"> *Service Description Boxes Are Scrollable* </h4>
      </div>
      <div className="flex flex-wrap justify-center items-center">
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-8">
          {/* Card 1 */}
          <div className="w-[200px] h-[280px] bg-[#FFEDEC] rounded-lg shadow-md p-4 flex flex-col justify-between">
            <div className="p-2 border border-[#F1BABA] rounded-md bg-white text-center mb-2">
              Physical
            </div>
            <div className="p-4 border border-[#F1BABA] rounded-md bg-white flex-1 text-center mb-1 text-sm overflow-y-auto scrollbar-hide h-[80px] ">
              Checking the animal’s skin/coat for any abnormalities such as
              bumps, dryness, injuries, etc. Checking for oral issues, swelling,
              checking temperature, blood pressure.
            </div>
            <div className="text-center">
              <p className="font-bold">$300</p>
              <p className="text-red-500 text-sm">insurance price varies</p>
            </div>
          </div>
          {/* More Cards Here */}

          {/* Card 2 */}
          <div className="w-[200px] h-[280px] bg-[#FFEDEC] rounded-lg shadow-md p-4 flex flex-col justify-between">
            <div className="p-2 border border-[#F1BABA] rounded-md bg-white text-center mb-2">
              Vaccinations
            </div>
            <div className="p-4 border border-[#F1BABA] rounded-md bg-white flex-1 text-center mb-1 text-sm overflow-y-auto scrollbar-hide h-[80px] ">
               Giving any required vaccinations to young animals for future disease prevention and recovery based on age range.
            </div>
            <div className="text-center">
              <p className="font-bold">$120</p>
              <p className="text-red-500 text-sm">insurance price varies</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="w-[200px] h-[280px] bg-[#FFEDEC] rounded-lg shadow-md p-4 flex flex-col justify-between">
            <div className="p-2 border border-[#F1BABA] rounded-md bg-white text-center mb-2">
              Dental Exam
            </div>
            <div className="p-4 border border-[#F1BABA] rounded-md bg-white flex-1 text-center mb-1 text-sm overflow-y-auto scrollbar-hide h-[80px] ">
            Checking for any oral hygiene issues, tooth or gum issues. Includes some standard dental cleaning. 
            </div>
            <div className="text-center">
              <p className="font-bold">$125</p>
              <p className="text-red-500 text-sm">insurance price varies</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="w-[200px] h-[280px] bg-[#FFEDEC] rounded-lg shadow-md p-4 flex flex-col justify-between">
            <div className="p-2 border border-[#F1BABA] rounded-md bg-white text-center mb-2">
              Laser Therapy
            </div>
            <div className="p-4 border border-[#F1BABA] rounded-md bg-white flex-1 text-center mb-1 text-sm overflow-y-auto scrollbar-hide h-[80px] ">
            Using low-intensity cold lasers to alleviate pain and encourage cell function and regeneration for any sprains, inflammation, wounds, fractures, or to accelerate healing for any post operative procedures.

            </div>
            <div className="text-center">
              <p className="font-bold">$500</p>
              <p className="text-red-500 text-sm">insurance price varies</p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="w-[200px] h-[280px] bg-[#FFEDEC] rounded-lg shadow-md p-4 flex flex-col justify-between">
            <div className="p-2 border border-[#F1BABA] rounded-md bg-white text-center mb-2">
              Spay/Neuter
            </div>
            <div className="p-4 border border-[#F1BABA] rounded-md bg-white flex-1 text-center mb-1 text-sm overflow-y-auto scrollbar-hide h-[80px] ">
            Medically sterilizing cats or dogs to prevent sickness, increase life expectancy, and prevent them from fostering offspring. Cost depends on size and breed.
            </div>
            <div className="text-center">
              <p className="font-bold">$150-$300</p>
              <p className="text-red-500 text-sm">insurance price varies</p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="w-[200px] h-[280px] bg-[#FFEDEC] rounded-lg shadow-md p-4 flex flex-col justify-between">
            <div className="p-2 border border-[#F1BABA] rounded-md bg-white text-center mb-2">
              Tooth Extraction
            </div>
            <div className="p-4 border border-[#F1BABA] rounded-md bg-white flex-1 text-center mb-1 text-sm overflow-y-auto scrollbar-hide h-[80px] ">
            Injecting or applying a numbing agent to the site of the extraction then surgically removing the tooth. Price below is per tooth.
            </div>
            <div className="text-center">
              <p className="font-bold">$30</p>
              <p className="text-red-500 text-sm">insurance price varies</p>
            </div>
          </div>

          {/* Card 7 */}
          <div className="w-[200px] h-[280px] bg-[#FFEDEC] rounded-lg shadow-md p-4 flex flex-col justify-between">
            <div className="p-2 border border-[#F1BABA] rounded-md bg-white text-center mb-2">
              Soft Tissue Surgery
            </div>
            <div className="p-4 border border-[#F1BABA] rounded-md bg-white flex-1 text-center mb-1 text-sm overflow-y-auto scrollbar-hide h-[80px] ">
            Providing surgical treatments of the soft tissue to resolve any ear, nose, and throat diseases. Price depends on area and severity.
            </div>
            <div className="text-center">
              <p className="font-bold">$500-$3500</p>
              <p className="text-red-500 text-sm">insurance price varies</p>
            </div>
          </div>

          {/* Card 8 */}
          <div className="w-[200px] h-[280px] bg-[#FFEDEC] rounded-lg shadow-md p-4 flex flex-col justify-between">
            <div className="p-2 border border-[#F1BABA] rounded-md bg-white text-center mb-2">
              Ocular Surgery
            </div>
            <div className="p-4 border border-[#F1BABA] rounded-md bg-white flex-1 text-center mb-1 text-sm overflow-y-auto scrollbar-hide h-[80px] ">
            Providing surgical treatments to the eye or surrounding area such as cataract surgery, orbit exenteration, cherry eye surgery, and more. Price depends on severity and type of treatment required. 
            </div>
            <div className="text-center">
              <p className="font-bold">$1000-$8000</p>
              <p className="text-red-500 text-sm">insurance price varies</p>
            </div>
          </div>

          
        </div>
      </div>

      <div className="christmas flex justify-center ">
        <img
          src={christmas}
          alt="christmas"
          className="w-auto h-auto scale-75 border-[#F7ECE9] border-4 rounded-2xl"
        />
      </div>
    </div>
  );
};

export default Dashboard;
