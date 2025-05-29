import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactTypingEffect from 'react-typing-effect';
import Navbar from './Navbar';
import orbital from "../images/orbital.png"
import AIHelper from './AiHelper';

const SignUpPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const apibaseurl = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${apibaseurl}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data=await response.json();
        console.log(data.username);
        navigate('/signin');
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      setError('Error registering user');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen overflow-hidden bg-black-100">
        <div className="left w-[40%] bg-black h-screen flex items-center justify-center">
          <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-sm mt-[175px]">
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign Up</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-green-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-green-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-green-200 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
              >
                Sign Up
              </button>
              <p className="mt-4">
                Already have an account? <a href="/signin" className="text-green-500">Sign In</a>
              </p>
            </form>
          </div>
        </div>
<div className="right w-[60%] h-screen bg-black relative flex items-center justify-center px-8">
  
  <img
    src={orbital}
    alt="Orbital"
  className="absolute inset-0 w-full h-full object-cover opacity-50 animate-signuprotateOrbit"
  />
  
  <div className="relative text-center text-white z-10">
    <h1 className="text-[3rem] font-rye text-green-300 font-jersey">
  <ReactTypingEffect
    text={["Grow Smart"]} 
    speed={105} 
    eraseDelay={900} 
    cursor="_" 
  />
</h1>
    <div className="bg-transparent  text-white p-6 rounded-lg w-full max-w-3xl mx-auto  text-center">
  <p className="text-sm leading-relaxed">
    Grow Smart is an innovative project aimed at improving farming efficiency and sustainability through IoT and automation. This system integrates sensors to monitor critical environmental parameters like soil moisture, temperature, and humidity. Using real-time data, it automates irrigation, ensuring optimal water usage and preventing crop damage due to over- or under-watering. A user-friendly web or mobile interface allows farmers to monitor conditions remotely and receive actionable insights. By combining hardware components such as microcontrollers, sensors, and actuators with software technologies and cloud platforms, the Smart Agriculture System addresses key agricultural challenges. It offers a scalable and cost-effective solution to promote sustainable farming practices, conserve resources, and increase crop productivity. This project bridges technology and agriculture, contributing to a smarter and more efficient farming ecosystem.
  </p>
</div>

    
  </div>
  <AIHelper />
</div>


      </div>
    </>
  );
};

export default SignUpPage;
