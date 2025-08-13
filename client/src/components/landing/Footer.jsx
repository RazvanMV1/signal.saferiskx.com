// Footer.jsx - Simplified Professional Version
import React from 'react';
import styles from './Footer.module.css';
import logo from '../../assets/logos/logo.svg';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (href.startsWith('/')) {
      window.location.href = href;
    } else {
      window.open(href, '_blank', 'noopener noreferrer');
    }
  };

  return (
    <footer className={styles.footer}>
      {/* Main Footer Content */}
      <div className={styles.footerMain}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            
            {/* Brand Column */}
            <div className={styles.brandColumn}>
              <div className={styles.brandSection}>
                <img src={logo} alt="SafeRiskX" className={styles.footerLogo} />
              </div>
              <p className={styles.brandDescription}>
                Professional trading signals with verified performance. 
                Join our exclusive Discord community for consistent profits.
              </p>
              
              {/* Discord Link */}
              <div className={styles.discordSection}>
                <button
                  onClick={() => handleLinkClick('https://discord.gg/na9dXyCYCv')}
                  className={styles.discordButton}
                  title="Join our Discord Server"
                >
                  <span className={styles.discordIcon}>💬</span>
                  <span className={styles.discordText}>Join Discord Community</span>
                  <span className={styles.discordArrow}>→</span>
                </button>
              </div>
            </div>

            {/* Account Actions */}
            <div className={styles.actionsColumn}>
              <h4 className={styles.columnTitle}>Account</h4>
              <div className={styles.actionButtons}>
                <button
                  onClick={() => handleLinkClick('/login')}
                  className={styles.actionButton}
                >
                  <span className={styles.actionIcon}>🔑</span>
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => handleLinkClick('/register')}
                  className={styles.actionButtonPrimary}
                >
                  <span className={styles.actionIcon}>🚀</span>
                  <span>Sign Up</span>
                </button>
              </div>
            </div>

            {/* Legal Links */}
            <div className={styles.legalColumn}>
              <h4 className={styles.columnTitle}>Legal</h4>
              <ul className={styles.legalList}>
                <li>
                  <button
                    onClick={() => handleLinkClick('/terms')}
                    className={styles.legalLink}
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('/privacy')}
                    className={styles.legalLink}
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLinkClick('/risk-disclosure')}
                    className={styles.legalLink}
                  >
                    Risk Disclosure
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.footerBottom}>
        <div className={styles.container}>
          <div className={styles.bottomContent}>
            
            {/* Copyright */}
            <div className={styles.copyright}>
              <p>© {currentYear} SafeRiskX. All rights reserved.</p>
            </div>

            {/* Risk Warning */}
            <div className={styles.riskWarning}>
              <span className={styles.warningIcon}>⚠️</span>
              <span className={styles.warningText}>
                Trading involves substantial risk and may not be suitable for everyone.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
