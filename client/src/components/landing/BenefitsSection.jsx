import React from 'react';
import styles from './BenefitsSection.module.css';

const benefits = [
  {
    icon: "⚡",
    title: "Real-Time Signals",
    desc: "Receive premium Forex & Crypto trading signals instantly through Discord and our platform with lightning-fast execution."
  },
  {
    icon: "🛡️",
    title: "Professional Risk Management",
    desc: "Every signal includes precise risk levels, stop loss, and take profit targets — no false promises, just professional trading guidance."
  },
  {
    icon: "📊",
    title: "Transparent Performance",
    desc: "Access verified signal performance metrics, win rates, and risk-reward ratios — all publicly available and independently tracked."
  },
  {
    icon: "🤖",
    title: "Instant Premium Access",
    desc: "Complete secure payment and gain immediate access to our exclusive Discord community and all SafeRiskX premium features."
  }
];

export default function BenefitsSection() {
  return (
    <section className={styles.benefitsSection}>
      <h2 className={styles.title}>Why Choose SafeRiskX Premium Signals?</h2>
      <div className={styles.cards}>
        {benefits.map((b, idx) => (
          <div key={b.title} className={styles.card} style={{ animationDelay: `${idx * 0.15}s` }}>
            <div className={styles.icon}>{b.icon}</div>
            <div className={styles.cardTitle}>{b.title}</div>
            <div className={styles.cardDesc}>{b.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
