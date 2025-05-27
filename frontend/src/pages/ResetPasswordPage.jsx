import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import orbital from "../images/orbital.png";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const apibaseurl = import.meta.env.VITE_API_BASE_URL;

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!verificationCode) {
      setError('Verification code is required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${apibaseurl}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, verificationCode, newPassword }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Password reset successfully!');
        setTimeout(() => {
          navigate('/signin'); // Redirect to sign-in page after successful reset
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message);

        if (data.message === 'Invalid or expired verification code') {
          setTimeout(() => {
            navigate('/forgot-password'); // Redirect to forgot password page
          }, 2000);
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  if (!email) {
    return <p>Invalid access. Please start over.</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-black overflow-hidden relative">
      {/* Background Image */}
      <img
        src={orbital}
        alt="Orbital"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-50 animate-resetzoomInOut"
      />

      {/* Form */}
      <div className="relative z-10 bg-white shadow-md rounded px-8 py-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleResetPassword}>
          <label className="block text-sm font-medium text-gray-700">Verification Code</label>
          <input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-green-200 focus:outline-none"
          />
          <label className="block text-sm font-medium text-gray-700 mt-4">New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-green-200 focus:outline-none"
          />
          <label className="block text-sm font-medium text-gray-700 mt-4">Confirm New Password</label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-green-200 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-green-600 transition duration-200"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
