import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import LoginPage from '../features/auth/pages/LoginPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import DiscordServiceCard from '../features/discord-service/DiscordServiceCard';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import RiskDisclosure from '../pages/RiskDisclosure';
import Terms from '../pages/termsComponent';
import TradingStatsPage from '../pages/TradingStatsPage';


export default function SignalRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard" element={<DiscordServiceCard />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/risk-disclosure" element={<RiskDisclosure />} />
      <Route path="/trading-stats" element={<TradingStatsPage />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}
