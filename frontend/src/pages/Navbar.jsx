import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../images/logo.png";

const Navbar = () => {
  return (
    <nav className="bg-black text-white fixed top-0 left-0 w-full h-[100px] z-50">
      <div className="container mx-auto flex items-center justify-between px-4 h-full">
        {/* Logo Section */}
        <div className="flex items-center">
          <img className="h-[90px] w-[90px] left-0 mt-[3px]" src={logo} alt="Logo" />
          
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-4">
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
      <hr className=" h-[3px] bg-white border-none" />
    </nav>
    
  );
};

export default Navbar;
