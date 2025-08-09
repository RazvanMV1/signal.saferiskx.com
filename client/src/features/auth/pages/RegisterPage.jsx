import React, { useEffect, useState } from 'react';
import RegisterForm from '../components/RegisterForm';
import styles from '../styles/RegisterPage.module.css';

export default function RegisterPage({ brand = "SafeRiskX", subtitle }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Text implicit pentru subtitle, adaptat la brand
  const defaultSubtitle = brand === "SafeRiskX Signals"
    ? "Abonează-te la semnalele premium Forex & Crypto. Acces instant pe Discord!"
    : "Start your journey with SafeRiskX";

  return (
    <div className={styles.registerPage}>
      <div className={styles.backgroundAnimation}>
        <div className={styles.gradientOverlay}></div>
        <div className={styles.geometricShapes}>
          <div className={styles.shape1}></div>
          <div className={styles.shape2}></div>
          <div className={styles.shape3}></div>
          <div className={styles.shape4}></div>
        </div>
      </div>
      <div className={styles.registerContainer}>
        <div className={`${styles.registerCard} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.brandSection}>
            <div className={styles.logoContainer}>
              <div className={styles.logoIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                </svg>
              </div>
              <h1 className={styles.brandTitle}>{brand}</h1>
            </div>
            <p className={styles.brandSubtitle}>{subtitle || defaultSubtitle}</p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
