import React from 'react';
import styles from './LandingPage.module.css';
import logo from '../../assets/logos/logo.svg';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <img src={logo} alt="SafeRiskX Signals" className={styles.heroLogo} />
        <h1 className={styles.heroTitle}>
          Semnale premium Forex & Crypto<br />
          <span className={styles.brandAccent}>Direct pe Discord</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Intră în clubul SafeRiskX Signals și primește semnale verificate, analize și management de risk de la profesioniști. Acces instant la grupul Discord premium!
        </p>
        <a href="/register" className={styles.ctaBtn}>Încearcă gratuit</a>
      </div>
      <div className={styles.heroBg} />
    </section>
  );
}