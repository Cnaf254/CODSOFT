import React, { useState } from "react";
import axios from "../axios"; // Ensure axios is correctly imported
import bgimage from '../../assets/images/bg.webp';
import SignUp from "../SignUp/SignUp";
import LogIn from "../LogIn/LogIn";

function Landing() {
  // const [login,setLogin] =useState(False)
  
  return (
    <div
      className="min-h-screen bg-cover bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full gap-10"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      {/* Zigzag Text above the form */}
      <div className="text-center mb-12 ">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 animate-zigzag">
          Welcome to our Blog Website
        </h1>
        <p className="text-xl mt-4 text-gray-800">
          Share anything you want and connect with others!
        </p>
      </div>
      {<LogIn/>}

      
    </div>
  );
}

export default Landing;
