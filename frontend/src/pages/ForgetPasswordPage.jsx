import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import orbital from "../images/orbital.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const apibaseurl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${apibaseurl}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        // Redirect to Reset Password with email and verificationCode
        navigate('/reset-password', {
          state: { email, verificationCode: data.verificationCode },
        });
      } else {
        setError(data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen relative bg-black overflow-hidden">
      {/* Background Image */}
      <div className="relative w-screen h-screen">
        <img
          src={orbital}
          alt="Orbital"
          className="absolute w-full h-full object-cover opacity-50 animate-forgotzoomInOut"
        />
      </div>

      {/* Form */}
      <div className="absolute z-10 shadow-md rounded px-8 py-6 w-full max-w-sm bg-white text-black">
        <h1 className="text-2xl font-bold text-center mb-6">Forgot Password</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleForgotPassword}>
          <label className="block text-sm font-medium text-black">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-green-200 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-green-600 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Generate Verification Code'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
