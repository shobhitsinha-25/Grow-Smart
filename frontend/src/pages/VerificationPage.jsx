import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const VerificationCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, verificationCode } = location.state || {};
  const [timeLeft, setTimeLeft] = useState(5); // 5 seconds countdown

  useEffect(() => {
    if (timeLeft === 0) {
      navigate('/reset-password', { state: { email, verificationCode } });
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, [timeLeft, navigate, email, verificationCode]);

  if (!email || !verificationCode) {
    return <p>Invalid access. Please start over.</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Verification Code</h1>
        <p className="text-black-500 text-center">Your verification code:</p>
        <p className="text-xl font-bold text-center">{verificationCode}</p>
        <p className="text-gray-500 text-sm text-center mt-4">
          Redirecting to the Next Step in <span className="font-bold">{timeLeft} </span>seconds...
        </p>
      </div>
    </div>
  );
};

export default VerificationCode;
