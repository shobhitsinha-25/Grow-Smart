import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../images/logo.png";
import aiLogo from "../images/aiLogo.png"; 
import GeminiAssistant from "./AiHelper";   

const DashboardNavbar = ({ isDark, toggleDarkMode }) => {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  // AI Assistant toggle state
  const [showAssistant, setShowAssistant] = useState(false);

  // Greeting logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning🌤️";
    else if (hour >= 12 && hour < 17) return "Good Afternoon☀️";
    else if (hour >= 17 && hour < 21) return "Good Evening🌙";
    else return "Good Night🌑";
  }

  const greeting = getGreeting();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    sessionStorage.removeItem('user');
    navigate('/signin');
  };

  return (
    <>
      <nav className="bg-black text-white fixed top-0 left-0 w-full h-[100px] z-50">
        <div className="container mx-auto flex items-center justify-between px-4 h-full">
          {/* Logo and Greeting */}
          <div className="flex items-center">
            <img className="h-[90px] w-[90px] mt-[3px]" src={logo} alt="Logo" />
            {username && (
              <span className="ml-[100px] text-[#ffe6e6] text-[30px]">{greeting}, {username}</span>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            {/* AI Assistant Button */}
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

            {/* About Link */}
            <Link
              to="/signup"
              className="hover:text-green-500 transition duration-200 text-sm"
            >
              About
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="hover:text-red-400 transition duration-200 text-sm"
            >
              Log Out
            </button>

            {/* Light/Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`w-12 h-6 flex items-center border-2 border-white rounded-full p-1 duration-300 ${isDark ? 'bg-white' : 'bg-black'}`}
            >
              <div
                className={`w-4 h-4 rounded-full text-xs flex items-center justify-center transform duration-300 ${
                  isDark ? 'translate-x-6 bg-white text-black' : 'translate-x-0 bg-black text-white'
                }`}
              >
                {isDark ? '🌗' : '🌤️'}
              </div>
            </button>
          </div>
        </div>
        <hr className="h-[3px] bg-white border-none" />
      </nav>

      {/* AI Assistant Modal */}
      {showAssistant && <GeminiAssistant onClose={() => setShowAssistant(false)} />}
    </>
  );
};

export default DashboardNavbar;
