import React from 'react';
import styles from './HowItWorksSection.module.css';

const steps = [
  {
    icon: "🚀",
    title: "Quick Registration",
    desc: "Create your account in seconds with just your email. No complex verification process — get started immediately."
  },
  {
    icon: "💎",
    title: "Secure Premium Payment",
    desc: "Complete your subscription with trusted Stripe payment processing. Instant activation with enterprise-grade security."
  },
  {
    icon: "🎯",
    title: "Exclusive Discord Access",
    desc: "Automatic invitation to our private Discord community with direct access to professional traders and premium signals."
  },
  {
    icon: "📈",
    title: "Live Professional Signals",
    desc: "Receive real-time Forex & Crypto signals from verified professionals with complete risk management strategies included."
  }
];

export default function HowItWorksSection() {
  return (
    <section className={styles.howSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>How It Works</h2>
        <p className={styles.subtitle}>
          Join thousands of successful traders in just 4 simple steps
        </p>
        <div className={styles.steps}>
          {steps.map((step, idx) => (
            <div key={step.title} className={styles.step} style={{ animationDelay: `${idx * 0.15}s` }}>
              <div className={styles.stepNumber}>
                <span>{idx + 1}</span>
              </div>
              <div className={styles.icon}>{step.icon}</div>
              <div className={styles.stepTitle}>{step.title}</div>
              <div className={styles.stepDesc}>{step.desc}</div>
              {idx < steps.length - 1 && (
                <div className={styles.arrow}>
                  <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
                    <path d="M2 10H38M38 10L30 2M38 10L30 18" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.cta}>
          <p className={styles.ctaText}>
            <strong>Ready to transform your trading?</strong> Start receiving professional signals today.
          </p>
        </div>
      </div>
    </section>
  );
}
