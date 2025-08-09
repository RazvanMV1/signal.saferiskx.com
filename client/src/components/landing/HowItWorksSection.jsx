import React from 'react';
import styles from './HowItWorksSection.module.css';

const steps = [
  {
    icon: "📝",
    title: "Înregistrează-te rapid",
    desc: "Creează-ți cont în câteva secunde, fără complicații. Ai nevoie doar de email și username Discord."
  },
  {
    icon: "💳",
    title: "Achită abonamentul Stripe",
    desc: "Plătești cu cardul în siguranță prin Stripe și primești acces instant la semnale premium."
  },
  {
    icon: "🤖",
    title: "Primești acces pe Discord",
    desc: "Ești adăugat automat în grupul premium Discord pentru semnale și suport live."
  },
  {
    icon: "⚡",
    title: "Primești semnale live",
    desc: "Primește și execută semnale Forex & Crypto de la profesioniști, cu risk management inclus."
  }
];

export default function HowItWorksSection() {
  return (
    <section className={styles.howSection}>
      <h2 className={styles.title}>Cum funcționează?</h2>
      <div className={styles.steps}>
        {steps.map((step, idx) => (
          <div key={step.title} className={styles.step} style={{ animationDelay: `${idx * 0.13}s` }}>
            <div className={styles.icon}>{step.icon}</div>
            <div className={styles.stepTitle}>{step.title}</div>
            <div className={styles.stepDesc}>{step.desc}</div>
            {idx < steps.length - 1 && <div className={styles.arrow}>→</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
