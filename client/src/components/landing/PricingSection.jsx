import React from 'react';
import styles from './PricingSection.module.css';

const plans = [
  {
    name: "Demo",
    price: 0,
    features: [
      "Acces la semnale demo",
      "Acces canal public Discord",
      "Fără suport premium",
      "Fără rezultate live",
    ],
    cta: "Încearcă gratis",
    highlight: false,
    disabled: false,
  },
  {
    name: "Pro",
    price: 29,
    features: [
      "Semnale premium Forex & Crypto",
      "Acces instant la Discord privat",
      "Rezultate și statistici live",
      "Suport rapid",
      "Acces la analize exclusive",
    ],
    cta: "Abonează-te",
    highlight: true,
    disabled: false,
  },
  {
    name: "VIP",
    price: 99,
    features: [
      "Toate beneficiile Pro",
      "1-on-1 cu signal provider",
      "Acces prioritar la strategii",
      "Webinarii exclusive",
      "Suport dedicat premium",
    ],
    cta: "Solicită acces",
    highlight: false,
    disabled: true,
  },
];

export default function PricingSection() {
  return (
    <section className={styles.pricingSection}>
      <h2 className={styles.title}>Planuri și prețuri</h2>
      <div className={styles.cards}>
        {plans.map((plan, idx) => (
          <div
            key={plan.name}
            className={`${styles.card} ${plan.highlight ? styles.highlight : ''} ${plan.disabled ? styles.disabled : ''}`}
            style={{ animationDelay: `${idx * 0.13}s` }}
          >
            {plan.highlight && <div className={styles.badge}>Popular</div>}
            <div className={styles.planName}>{plan.name}</div>
            <div className={styles.price}>
              {plan.price === 0 ? (
                <span>Gratuit</span>
              ) : (
                <>
                  <span className={styles.priceValue}>{plan.price}</span>
                  <span className={styles.priceCur}>EUR</span>
                  <span className={styles.pricePer}>/lună</span>
                </>
              )}
            </div>
            <ul className={styles.features}>
              {plan.features.map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button
              className={styles.ctaBtn}
              disabled={plan.disabled}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}