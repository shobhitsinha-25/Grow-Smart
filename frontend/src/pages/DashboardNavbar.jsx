import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../images/logo.png";

const DashboardNavbar = ({ isDark, toggleDarkMode }) => {
  const navigate = useNavigate();


  const username=localStorage.getItem("username");

  // generating Greeting based on the current time...
  const getGreeting=() => {
    const hour=new Date().getHours();
    if(hour>=5 && hour<12) return "Good Morning🌤️";
    else if(hour>=12 && hour<17) return "Good Afternoon☀️";
    else if(hour>=17 && hour<21) return "Good Evening🌙";
    else return "Good Night🌑";
  }

  const greeting=getGreeting();

  const handleLogout = () => {

    
    localStorage.removeItem('token');  
    localStorage.removeItem('username');
   
    sessionStorage.removeItem('user'); 

    
    navigate('/signin');
  };

  return (
    <nav className="bg-black text-white fixed top-0 left-0 w-full h-[100px] z-50">
      <div className="container mx-auto flex items-center justify-between px-4 h-full">
       
        <div className="flex items-center">
          <img className="h-[90px] w-[90px] left-0 mt-[3px]" src={logo} alt="Logo" />
          {username && (
            <span className="ml-[100px] text-[#ffe6e6] text-[30px]  ">{greeting}, {username}</span>
          )}
        </div>

        
        <div className="flex space-x-4">
          <Link
            to="/signup"
            className="hover:text-green-500 transition duration-200 text-sm"
          >
            About
          </Link>

          <button
            onClick={handleLogout}
            className="hover:text-red-400 transition duration-200 text-sm"
          >
            Log Out
          </button>
          {/* Light/Dark Toggle Button */}
          <button
  onClick={toggleDarkMode}
  className={`w-12 h-6 flex items-center border-2 border border-white rounded-full p-1 duration-300 ${
    isDark ? 'bg-white' : 'bg-black'
  }`}
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
      <hr className=" h-[3px] bg-white border-none" />
    </nav>

  );

};

export default DashboardNavbar;
