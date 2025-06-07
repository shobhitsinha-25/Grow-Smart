import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import orbital from "../images/orbital.png";
import ReactTypingEffect from 'react-typing-effect';
import Lottie from 'lottie-react';
import agricultureAnimation from "../agriculture.json"

const SignInPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const response = await fetch(`${apibaseurl}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);  
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);  
        navigate('/dashboard');
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      setError('Error signing in');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-black-100">
        <div className="left w-[40%] bg-black h-screen">
          <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-sm mx-auto ml-[75px] mt-[200px] mb-[50px]">
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign In</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="w-full">
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
                Sign In
              </button>
              <p className="mt-4">
                Don't have an account? <a href="/signup" className="text-green-500">Sign Up</a>
              </p>
              <p>
                <Link to="/forgot-password" className="text-blue-500">Forgot password?</Link>
              </p>

            </form>
          </div>
        </div>

                    {/*Right div*/}

        <div className="bg-black right w-[60%] h-screen overflow-hidden relative">
  {/* Orbital Image */}
  <img
    src={orbital}
    alt="Orbital"
    className="w-full h-full object-cover opacity-70 animate-signinrotateOrbit"
  />
  
  {/* Text Overlay */}
  <div className="absolute inset-0 flex items-center justify-center">
    <h1 className="text-[3rem] font-rye text-white font-jersey z-10">
      <ReactTypingEffect
        text={["Grow Smart"]} 
        speed={100} 
        eraseDelay={900} 
        cursor="_" 
      />
    </h1>
  </div>
    {/* Bottom Left Lottie Animation */}
   
    <div className="absolute bottom-4 left-4 flex gap-2 z-10">
  {Array(9).fill(0).map((_, i) => (
    <div key={i} className="w-[75px] h-[80px]">
      <Lottie animationData={agricultureAnimation} loop={true} />
    </div>
  ))}
</div>
  </div>


</div>

      
    </>
  );
};

export default SignInPage;
