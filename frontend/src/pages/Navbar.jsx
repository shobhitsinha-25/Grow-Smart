import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../images/logo.png"; 
import aiLogo from "../images/aiLogo.png"; 
import GeminiAssistant from "./AiHelper" 

const Navbar = () => {
  const [showAssistant, setShowAssistant] = useState(false);

  return (
    <>
      <nav className="bg-black text-white fixed top-0 left-0 w-full h-[100px] z-50">
        <div className="container mx-auto flex items-center justify-between px-4 h-full"> {/* Changed to justify-between initially */}
          {/* Main Logo Section - Left */}
          <div className="flex items-center">
            <img className="h-[90px] w-[90px] left-0 mt-[3px]" src={logo} alt="Main Logo" />
          </div>

          {/* AI Assistant Button/Logo - Center */}
          <div className="flex-grow flex ml-[100px]">
  <button
    onClick={() => setShowAssistant(true)}
    className="p-2 rounded-full transition duration-200 focus:outline-none flex items-center space-x-2"
    aria-label="Ask AI Assistant"
  >
    <img
      src={aiLogo}
      alt="Ask AI"
      className="h-[60px] w-[60px] object-contain rounded-full transform hover:-rotate-45 transition-transform duration-300 hover:scale-110"
      />
    
  </button>
  <span className="text-sm text-white text-[25px] ml-[4px] mt-[30px] ">Cultiv AI </span>
</div>

          {/* Navigation Links - Right */}
          <div className="flex items-center space-x-4">
            <Link
              to="/signup"
              className="hover:text-green-500 transition duration-200 text-sm"
            >
              About
            </Link>
            <Link
              to="/signin"
              className="hover:text-green-500 transition duration-200 text-sm"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="hover:text-green-500 transition duration-200 text-sm"
            >
              Sign Up
            </Link>
          </div>
        </div>
        <hr className="h-[3px] bg-white border-none" />
      </nav>

      {showAssistant && <GeminiAssistant onClose={() => setShowAssistant(false)} />}
    </>
  );
};

export default Navbar;