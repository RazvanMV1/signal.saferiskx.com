// src/components/DashboardHeader.jsx
import React from 'react';
import styles from './DashboardHeader.module.css';
import logo from '../../assets/logos/logo.svg';

const apiUrl = process.env.REACT_APP_API_URL;

export default function DashboardHeader() {
  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out...');
      
      const response = await fetch(`${apiUrl}/api/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        console.log('✅ Logout successful');
        // Redirect la landing page
        window.location.href = '/';
      } else {
        throw new Error('Eroare la logout');
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
      alert('Eroare la logout: ' + error.message);
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        {/* Left Section - poate fi gol sau cu meniu */}
        <div className={styles.leftSection}>
          {/* Opțional: hamburger menu sau navigație */}
        </div>

        {/* Center Section - Logo ca Logout Button */}
        <div className={styles.centerSection}>
          <button 
            onClick={handleLogout}
            className={styles.logo}
            title="Logout și înapoi la pagina principală"
          >
            <img 
              src={logo}
              alt="Premium Signals - Logout" 
              className={styles.logoImage}
            />
          </button>
        </div>

        {/* Right Section - User info sau acțiuni */}
        <div className={styles.rightSection}>
          {/* Opțional: notificări, settings, etc. */}
        </div>
      </div>
    </div>
  );
}
