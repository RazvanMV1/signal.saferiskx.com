// src/pages/TradingStatsPage.jsx
import React from 'react';
import DailyTradingStats from '../features/DailyTradingStats/DailyTradingStats';
import Footer from '../components/Footer/Footer';
import PublicHeader from '../components/PublicHeader/DashboardHeader';

const TradingStatsPage = () => {
  return (
    <div>
        <PublicHeader />
      <DailyTradingStats />
        <Footer />
    </div>
  );
};

export default TradingStatsPage;
