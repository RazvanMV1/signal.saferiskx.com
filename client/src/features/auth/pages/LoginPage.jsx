import React, { useEffect, useState } from 'react';
import LoginForm from '../components/LoginForm';
import styles from '../styles/LoginPage.module.css';
import logoS from '../../../assets/logos/logo.svg';

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set document title for SEO
    document.title = 'Login - SafeRiskX | Secure Trading Platform';
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Login to SafeRiskX - Professional trading signals and risk management platform.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Login to SafeRiskX - Professional trading signals and risk management platform.';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }

    // Add robots meta for login page
    const robotsMeta = document.createElement('meta');
    robotsMeta.name = 'robots';
    robotsMeta.content = 'noindex, nofollow';
    document.getElementsByTagName('head')[0].appendChild(robotsMeta);
    
    // Trigger entrance animation after brief loading
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsLoading(false);
    }, 150);
    
    // Cleanup
    return () => {
      clearTimeout(timer);
      // Reset title when leaving
      document.title = 'SafeRiskX';
      // Remove robots meta
      const robots = document.querySelector('meta[name="robots"]');
      if (robots) robots.remove();
    };
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginPage}>
      {/* Animated background with gradient and geometric patterns */}
      <div className={styles.backgroundAnimation}>
        <div className={styles.gradientOverlay}></div>
        <div className={styles.geometricShapes}>
          <div className={styles.shape1}></div>
          <div className={styles.shape2}></div>
          <div className={styles.shape3}></div>
          <div className={styles.shape4}></div>
          <div className={styles.shape5}></div>
        </div>
      </div>
      
      {/* Back navigation button */}
      <button 
        className={styles.backButton}
        onClick={() => {
          window.location.href = '/';
        }}
        aria-label="Go Home"
        title="Go Home"
      >
        <span className={styles.backText}>Home</span>
      </button>
      
      {/* Centered login card container */}
      <div className={styles.loginContainer}>
        <div className={`${styles.loginCard} ${isVisible ? styles.visible : ''}`}>
          {/* Brand logo section - DOAR LOGO, fără text dublat */}
          <header className={styles.brandSection}>
            <div className={styles.logoContainer}>
              <img 
                src={logoS} 
                alt="SafeRiskX Logo" 
                className={styles.logo}
                loading="eager"
                width="120"
                height="40"
              />
            </div>
            <p className={styles.brandSubtitle}>Professional Trading Signals & Risk Management</p>
          </header>
          
          {/* Login form component - LoginForm va avea propriul său header */}
          <main className={styles.formSection}>
            <LoginForm />
          </main>
          
          {/* Footer with navigation and legal links */}
          <footer className={styles.loginFooter}>
            <div className={styles.signupPrompt}>
              <p className={styles.footerText}>
                Don't have an account? 
                <a 
                  href={`${process.env.REACT_APP_API_URL || ''}/register`}
                  className={styles.registerLink}
                  title="Create new account"
                >
                  Sign up here
                </a>
              </p>
            </div>
            
            <div className={styles.helpLinks}>
              <a 
                href="/forgot-password" 
                className={styles.helpLink}
                title="Reset your password"
              >
                Forgot Password?
              </a>
              <a 
                href="/support" 
                className={styles.helpLink}
                title="Get help with your account"
              >
                Need Help?
              </a>
            </div>
            
            <div className={styles.legalLinks}>
              <a 
                href="/terms" 
                className={styles.legalLink}
                title="Terms of Service"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms
              </a>
              <span className={styles.linkSeparator}>•</span>
              <a 
                href="/privacy" 
                className={styles.legalLink}
                title="Privacy Policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy
              </a>
              <span className={styles.linkSeparator}>•</span>
              <a 
                href="/risk-disclosure" 
                className={styles.legalLink}
                title="Risk Disclosure Statement"
                target="_blank"
                rel="noopener noreferrer"
              >
                Risk Disclosure
              </a>
            </div>
            
            <div className={styles.securityBadge}>
              <div className={styles.securityIcon}>🔒</div>
              <span className={styles.securityText}>Secure Login</span>
            </div>
          </footer>
        </div>
      </div>
      
      {/* Floating help button */}
      <button 
        className={styles.floatingHelp}
        onClick={() => window.open('/support', '_blank')}
        aria-label="Get help"
        title="Need assistance? Click for help"
      >
        <span className={styles.helpIcon}>?</span>
      </button>
    </div>
  );
}
