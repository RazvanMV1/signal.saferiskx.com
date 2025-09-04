// src/components/DashboardHeader.jsx
import React from 'react';
import styles from './DashboardHeader.module.css';
import logo from '../../assets/logos/logo.svg';


export default function DashboardHeader() {
  const handleLogout = async () => {
    window.location.href = '/';
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
            title="Înapoi la pagina principală"
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
