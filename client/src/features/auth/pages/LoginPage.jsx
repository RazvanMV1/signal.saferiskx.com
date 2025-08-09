import React, { useEffect, useState } from 'react';
import LoginForm from '../components/LoginForm';
import styles from '../styles/LoginPage.module.css';
import logoS from '../../../assets/logos/logo.svg'; // Adjust the path as necessary

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger entrance animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={styles.loginPage}>
      {/* Animated background with gradient and geometric patterns */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.gradientOverlay}></div>
        <div className={styles.geometricShapes}>
          <div className={styles.shape1}></div>
          <div className={styles.shape2}></div>
          <div className={styles.shape3}></div>
        </div>
      </div>
      
      {/* Centered login card container */}
      <div className={styles.loginContainer}>
        <div className={`${styles.loginCard} ${isVisible ? styles.visible : ''}`}>
          {/* Brand logo section */}
          <div className={styles.brandSection}>
            <div className={styles.logoContainer}>
              <img src={logoS} alt="SafeRiskX Logo"  />
            </div>
            <p className={styles.brandSubtitle}>Secure Trading Risk Management</p>
          </div>
          
          {/* Login form component */}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
