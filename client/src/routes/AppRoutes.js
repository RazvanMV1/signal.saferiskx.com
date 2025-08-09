import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import LoginPage from '../features/auth/pages/LoginPage';
import ForgotPasswordForm from '../features/auth/components/ForgotPasswordForm';
import DashboardPage from '../features/dashboard/pages/DashboardPage';

export default function SignalRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}
