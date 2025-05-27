import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUpPage from './pages/SignUppage';
import SignInPage from './pages/SignInpage';
import Dashboard from './pages/Dashboard';
import Weather from './pages/Weather';
import ForgotPassword from './pages/ForgetPasswordPage';
import VerifyCode from './pages/VerificationPage';
import ResetPassword from './pages/ResetPasswordPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/weather" element={<Weather />} />
         <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify" element={<VerifyCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/signup" />} />
      </Routes>
    </Router>
  );
};

export default App;
