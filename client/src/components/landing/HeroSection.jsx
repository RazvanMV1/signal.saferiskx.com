import React, { useState, useEffect } from 'react';
import styles from './LandingPage.module.css';
import logo from '../../assets/logos/logo.svg';

export default function HeroSection() {
  const [currentStat, setCurrentStat] = useState(0);
  
  const stats = [
    { value: "2,847+", label: "Active Traders" },
    { value: "$2.1M+", label: "Member Profits" },
    { value: "94%", label: "Win Rate" },
    { value: "24/7", label: "Live Signals" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [stats.length]);

  const handleGetStarted = () => {
    // Scroll to pricing section or redirect to registration
    const pricingSection = document.querySelector('[data-section="pricing"]');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/register';
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          {/* Trust Badge */}
          <div className={styles.trustBadge}>
            <span className={styles.trustIcon}>🏆</span>
            <span className={styles.trustText}>Trusted by 2,800+ Professional Traders</span>
          </div>

          {/* Logo */}
          <div className={styles.logoContainer}>
            <img src={logo} alt="SafeRiskX Premium Signals" className={styles.heroLogo} />
          </div>

          {/* Main Headlines */}
          <h1 className={styles.heroTitle}>
            Transform Your Trading with
            <span className={styles.brandAccent}> Professional Signals</span>
          </h1>
          
          <p className={styles.heroSubtitle}>
            Join the exclusive SafeRiskX community and receive <strong>verified Forex & Crypto signals</strong> 
            with complete risk management. Get instant access to our premium Discord community 
            where professional traders share real-time opportunities.
          </p>

          {/* Value Propositions */}
          <div className={styles.valueProps}>
            <div className={styles.valueProp}>
              <span className={styles.valueIcon}>⚡</span>
              <span>Instant Discord Access</span>
            </div>
            <div className={styles.valueProp}>
              <span className={styles.valueIcon}>📊</span>
              <span>Verified Performance</span>
            </div>
            <div className={styles.valueProp}>
              <span className={styles.valueIcon}>🛡️</span>
              <span>Professional Risk Management</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={styles.ctaGroup}>
            <button 
              onClick={handleGetStarted}
              className={styles.primaryCta}
            >
              <span className={styles.ctaIcon}>🚀</span>
              <span>Start Trading Professionally</span>
              <span className={styles.ctaArrow}>→</span>
            </button>
            
            <button className={styles.secondaryCta}>
              <span className={styles.ctaIcon}>🎮</span>
              <span>View Live Signals</span>
            </button>
          </div>

          {/* Social Proof */}
          <div className={styles.socialProof}>
            <div className={styles.avatars}>
              <div className={styles.avatar}>👨‍💼</div>
              <div className={styles.avatar}>👩‍💻</div>
              <div className={styles.avatar}>🧑‍🚀</div>
              <div className={styles.avatar}>👩‍🎓</div>
              <div className={styles.avatarMore}>+2.8K</div>
            </div>
            <div className={styles.socialText}>
              <strong>Join successful traders</strong> who've transformed their trading with SafeRiskX
            </div>
          </div>

          {/* Guarantee */}
          <div className={styles.guarantee}>
            <span className={styles.guaranteeIcon}>🛡️</span>
            <span>30-day money-back guarantee • Cancel anytime</span>
          </div>
        </div>

        {/* Dynamic Stats Sidebar */}
        <div className={styles.statsPanel}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats[currentStat].value}</div>
            <div className={styles.statLabel}>{stats[currentStat].label}</div>
          </div>
          <div className={styles.statIndicators}>
            {stats.map((_, idx) => (
              <div 
                key={idx}
                className={`${styles.indicator} ${currentStat === idx ? styles.active : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Animated Background */}
      <div className={styles.heroBackground}>
        <div className={styles.bgPattern}></div>
        <div className={styles.bgGradients}></div>
        <div className={styles.floatingElements}>
          <div className={styles.floatingIcon} style={{ animationDelay: '0s' }}>📊</div>
          <div className={styles.floatingIcon} style={{ animationDelay: '1s' }}>💰</div>
          <div className={styles.floatingIcon} style={{ animationDelay: '2s' }}>📈</div>
          <div className={styles.floatingIcon} style={{ animationDelay: '3s' }}>🎯</div>
        </div>
      </div>
    </section>
  );
}
