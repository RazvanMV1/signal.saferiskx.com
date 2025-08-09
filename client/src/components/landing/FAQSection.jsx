import React, { useState } from 'react';
import styles from './FAQSection.module.css';

const faqs = [
  {
    q: "Ce tipuri de semnale oferă SafeRiskX?",
    a: "Oferim semnale premium Forex și Crypto, cu niveluri clare de entry, stop loss și take profit, trimise instant pe Discord."
  },
  {
    q: "Cum primesc acces la semnale?",
    a: "După ce te înregistrezi și plătești abonamentul, vei primi acces automat la grupul premium Discord unde se postează semnalele."
  },
  {
    q: "Pot anula abonamentul oricând?",
    a: "Da! Poți renunța la abonament oricând din dashboard, fără costuri suplimentare."
  },
  {
    q: "Pot vedea performanța semnalelor?",
    a: "Da, avem o secțiune de statistici și rezultate, actualizată live, pentru transparență totală."
  },
  {
    q: "Pot testa platforma înainte de a plăti?",
    a: "Da, oferim acces demo gratuit la semnale și la platforma SafeRiskX pentru testare."
  },
  {
    q: "Cum mă asigur că primesc notificări pentru fiecare semnal?",
    a: "Poți activa notificările pe Discord și pe email din zona de preferințe a contului tău."
  }
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className={styles.faqSection}>
      <h2 className={styles.title}>Întrebări frecvente</h2>
      <div className={styles.accordion}>
        {faqs.map((f, idx) => (
          <div key={idx} className={`${styles.item} ${openIdx === idx ? styles.open : ''}`}>
            <button
              className={styles.q}
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              aria-expanded={openIdx === idx}
            >
              <span className={styles.qIcon}>{openIdx === idx ? "—" : "+"}</span>
              {f.q}
            </button>
            <div className={styles.aWrap} style={{ maxHeight: openIdx === idx ? '120px' : '0px' }}>
              <div className={styles.a}>{f.a}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}