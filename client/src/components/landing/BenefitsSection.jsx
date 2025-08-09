import React from 'react';
import styles from './BenefitsSection.module.css';

const benefits = [
  {
    icon: "⚡",
    title: "Semnale rapide",
    desc: "Primești semnale Forex & Crypto în timp real, direct pe Discord și în platformă."
  },
  {
    icon: "🛡️",
    title: "Risk Management Pro",
    desc: "Toate semnalele includ niveluri clare de risk, stop loss și take profit, fără promisiuni false."
  },
  {
    icon: "📊",
    title: "Statistici transparente",
    desc: "Vezi performanța semnalelor, win rate și raport risk/reward — totul public și verificabil."
  },
  {
    icon: "🤖",
    title: "Acces instant",
    desc: "Plătești cu cardul, primești acces instant la grupul premium Discord și la toate funcțiile SafeRiskX."
  }
];

export default function BenefitsSection() {
  return (
    <section className={styles.benefitsSection}>
      <h2 className={styles.title}>De ce să alegi SafeRiskX Signals?</h2>
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