import React, { useEffect, useState } from 'react';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import styles from '../styles/ForgotPasswordPage.module.css';

export default function ForgotPasswordPage() {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger entrance animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={styles.forgotPasswordPage}>
      {/* Animated background with gradient and geometric patterns */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.gradientOverlay}></div>
        <div className={styles.geometricShapes}>
          <div className={styles.shape1}></div>
          <div className={styles.shape2}></div>
          <div className={styles.shape3}></div>
          <div className={styles.shape4}></div>
          <div className={styles.shape5}></div>
        </div>
      </div>
      
      {/* Centered forgot password card container */}
      <div className={styles.forgotPasswordContainer}>
        <div className={`${styles.forgotPasswordCard} ${isVisible ? styles.visible : ''}`}>
          {/* Brand logo section */}
          <div className={styles.brandSection}>
            <div className={styles.logoContainer}>
              <div className={styles.logoIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </div>
              <h1 className={styles.brandTitle}>SafeRiskX</h1>
            </div>
            <p className={styles.brandSubtitle}>Password Recovery</p>
          </div>
          
          {/* Forgot password form component */}
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
