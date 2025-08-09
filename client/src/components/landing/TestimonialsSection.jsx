import React from 'react';
import styles from './TestimonialsSection.module.css';

const testimonials = [
  {
    name: "Andrei S.",
    avatar: "🧑‍💼",
    text: "SafeRiskX Signals mi-a schimbat complet modul în care fac trading Forex. Semnale precise, management de risk real, și comunitate super activă pe Discord.",
    tag: "Trader Forex"
  },
  {
    name: "Cristina T.",
    avatar: "👩‍💻",
    text: "Am testat multe grupuri de semnale, dar aici chiar am transparență și suport rapid. Recomand pentru oricine vrea rezultate pe termen lung!",
    tag: "Crypto Enthusiast"
  },
  {
    name: "Alex P.",
    avatar: "🧑‍🚀",
    text: "Mi-am crescut disciplina și am scăpat de FOMO cu ajutorul alertelor SafeRiskX. Plus, totul e automatizat cu Stripe și Discord, fără bătăi de cap.",
    tag: "Risk Manager"
  }
];

export default function TestimonialsSection() {
  return (
    <section className={styles.testimonialsSection}>
      <h2 className={styles.title}>Ce spun membrii noștri</h2>
      <div className={styles.cards}>
        {testimonials.map((t, idx) => (
          <div key={t.name} className={styles.card} style={{ animationDelay: `${idx * 0.14}s` }}>
            <div className={styles.avatar}>{t.avatar}</div>
            <div className={styles.text}>"{t.text}"</div>
            <div className={styles.name}>{t.name}</div>
            <div className={styles.tag}>{t.tag}</div>
          </div>
        ))}
      </div>
    </section>
  );
}