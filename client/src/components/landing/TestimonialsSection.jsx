import React from 'react';
import styles from './TestimonialsSection.module.css';

const testimonials = [
  {
    name: "Marcus Thompson",
    avatar: "👨‍💼",
    initials: "MT",
    text: "SafeRiskX transformed my trading completely. I went from losing money to consistent 15% monthly returns. The risk management is absolutely professional — no more emotional trades.",
    tag: "Senior Forex Trader",
    result: "+127% in 6 months",
    verified: true,
    rating: 5
  },
  {
    name: "Sarah Chen",
    avatar: "👩‍💻", 
    initials: "SC",
    text: "Finally found a signal service that actually works. Transparent performance, instant Discord access, and the community support is incredible. Best investment I've made this year.",
    tag: "Crypto Portfolio Manager",
    result: "+89% portfolio growth",
    verified: true,
    rating: 5
  },
  {
    name: "David Rodriguez",
    avatar: "🧑‍🚀",
    initials: "DR", 
    text: "I've tried 12+ signal services before SafeRiskX. This is the ONLY one that delivered real results. Professional analysis, perfect timing, and genuine transparency.",
    tag: "Day Trading Specialist",
    result: "Profitable 8 months straight",
    verified: true,
    rating: 5
  },
  {
    name: "Emily Watson",
    avatar: "👩‍🎓",
    initials: "EW",
    text: "Went from complete beginner to profitable trader in 3 months. The educational content and 1-on-1 support helped me understand market psychology and risk management.",
    tag: "New Trader Success",
    result: "From $0 to $15K profit",
    verified: true,
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Real Results from Real Traders</h2>
          <p className={styles.subtitle}>
            Join thousands of successful traders who transformed their trading with SafeRiskX
          </p>
          <div className={styles.socialProof}>
            <div className={styles.proofItem}>
              <span className={styles.proofNumber}>2,847+</span>
              <span className={styles.proofLabel}>Active Members</span>
            </div>
            <div className={styles.proofItem}>
              <span className={styles.proofNumber}>$2.1M+</span>
              <span className={styles.proofLabel}>Member Profits</span>
            </div>
            <div className={styles.proofItem}>
              <span className={styles.proofNumber}>94%</span>
              <span className={styles.proofLabel}>Success Rate</span>
            </div>
          </div>
        </div>

        <div className={styles.cards}>
          {testimonials.map((testimonial, idx) => (
            <div 
              key={testimonial.name} 
              className={styles.card} 
              style={{ animationDelay: `${idx * 0.12}s` }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.avatarSection}>
                  <div className={styles.avatar}>
                    <span className={styles.avatarEmoji}>{testimonial.avatar}</span>
                    <span className={styles.avatarInitials}>{testimonial.initials}</span>
                  </div>
                  <div className={styles.userInfo}>
                    <div className={styles.name}>
                      {testimonial.name}
                      {testimonial.verified && (
                        <span className={styles.verifiedBadge}>✓</span>
                      )}
                    </div>
                    <div className={styles.tag}>{testimonial.tag}</div>
                  </div>
                </div>
                <div className={styles.rating}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className={styles.star}>★</span>
                  ))}
                </div>
              </div>

              <div className={styles.text}>"{testimonial.text}"</div>

              <div className={styles.cardFooter}>
                <div className={styles.result}>
                  <span className={styles.resultIcon}>📈</span>
                  <span className={styles.resultText}>{testimonial.result}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.trustBar}>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>🏆</span>
            <span>Award-winning signals</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>🔒</span>
            <span>100% verified results</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>⚡</span>
            <span>Instant access</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>💎</span>
            <span>Premium community</span>
          </div>
        </div>

        <div className={styles.cta}>
          <h3 className={styles.ctaTitle}>Ready to Join These Success Stories?</h3>
          <p className={styles.ctaText}>
            Start your journey to profitable trading today
          </p>
          <button className={styles.ctaButton}>
            <span className={styles.ctaIcon}>🚀</span>
            Get Premium Access Now
            <span className={styles.ctaArrow}>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
