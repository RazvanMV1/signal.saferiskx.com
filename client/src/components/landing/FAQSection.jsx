import React, { useState } from 'react';
import styles from './FAQSection.module.css';

const faqs = [
  {
    q: "What types of signals does SafeRiskX provide?",
    a: "We provide premium Forex and Crypto trading signals with precise entry points, stop loss, and take profit levels, delivered instantly through our exclusive Discord community.",
    category: "signals"
  },
  {
    q: "How quickly do I get access after payment?",
    a: "Access is completely automated! Once payment is confirmed through Stripe, you'll receive instant Discord access and can start receiving professional signals immediately.",
    category: "access"
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Absolutely! You have complete control over your subscription. Cancel anytime directly from your dashboard with no hidden fees or cancellation charges.",
    category: "billing"
  },
  {
    q: "Can I track the performance of your signals?",
    a: "Yes! We provide complete transparency with live performance tracking, win rates, and detailed statistics. All results are publicly verified and updated in real-time.",
    category: "performance"
  },
  {
    q: "Is there a free trial or demo available?",
    a: "Yes! We offer demo access to our platform and sample signals so you can experience the quality before committing to our premium service.",
    category: "trial"
  },
  {
    q: "How do I ensure I never miss a signal?",
    a: "Multiple notification methods ensure you stay informed: Discord notifications, email alerts, and mobile push notifications. Customize your preferences in your dashboard.",
    category: "notifications"
  },
  {
    q: "What makes SafeRiskX different from other signal services?",
    a: "Complete transparency, verified track record, professional risk management, instant Discord integration, and a proven community of successful traders. No false promises, just results.",
    category: "difference"
  },
  {
    q: "Do you provide educational content and support?",
    a: "Yes! Premium members get access to exclusive market analysis, educational webinars, trading strategies, and direct support from our professional trading team.",
    category: "education"
  }
];

const categoryIcons = {
  signals: "📊",
  access: "⚡",
  billing: "💳",
  performance: "📈",
  trial: "🆓",
  notifications: "🔔",
  difference: "🏆",
  education: "🎓"
};

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Frequently Asked Questions</h2>
          <p className={styles.subtitle}>
            Everything you need to know about SafeRiskX Premium Signals
          </p>
        </div>

        <div className={styles.accordion}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`${styles.item} ${openIdx === idx ? styles.open : ''}`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <button
                className={styles.question}
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                aria-expanded={openIdx === idx}
              >
                <div className={styles.questionContent}>
                  <span className={styles.categoryIcon}>
                    {categoryIcons[faq.category]}
                  </span>
                  <span className={styles.questionText}>{faq.q}</span>
                </div>
                <div className={styles.toggleIcon}>
                  <svg 
                    className={`${styles.chevron} ${openIdx === idx ? styles.rotated : ''}`}
                    width="20" 
                    height="20" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
              
              <div className={styles.answerWrapper}>
                <div className={styles.answer}>
                  <div className={styles.answerContent}>
                    {faq.a}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.ctaFooter}>
          <div className={styles.ctaContent}>
            <h3 className={styles.ctaTitle}>Still have questions?</h3>
            <p className={styles.ctaText}>
              Our support team is ready to help you get started with professional trading signals.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.primaryCta}>
                <span className={styles.ctaIcon}>🚀</span>
                Start Free Trial
              </button>
              <button className={styles.secondaryCta}>
                <span className={styles.ctaIcon}>💬</span>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
