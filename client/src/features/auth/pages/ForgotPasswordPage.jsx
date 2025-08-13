import React, { useEffect, useState } from 'react';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import styles from '../styles/LoginPage.module.css'; // Folosim același CSS ca LoginPage
import logoS from '../../../assets/logos/logo.svg';

export default function ForgotPasswordPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set document title for SEO
    document.title = 'Reset Password - SafeRiskX | Secure Trading Platform';
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Reset your SafeRiskX password securely. Get back to professional trading signals and risk management.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Reset your SafeRiskX password securely. Get back to professional trading signals and risk management.';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }

    // Add robots meta for password reset page
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

  const goBack = () => {
    // Întoarcere la login în loc de home pentru forgot password
    window.location.href = '/login';
  };

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
        onClick={goBack}
        aria-label="Go back to login"
        title="Back to login"
      >
        <span className={styles.backIcon}>←</span>
        <span className={styles.backText}>Login</span>
      </button>
      
      {/* Centered forgot password card container */}
      <div className={styles.loginContainer}>
        <div className={`${styles.loginCard} ${isVisible ? styles.visible : ''}`}>
          {/* Brand logo and header section */}
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
            <h1 className={styles.brandTitle}>Reset Password</h1>
            <p className={styles.brandSubtitle}>AI-Powered Trading Signals & Risk Analytics</p>
          </header>
          
          {/* Password reset info section */}
          <div className={styles.infoSection}>
            <div className={styles.resetInfo}>
              <div className={styles.resetIcon}>🔒</div>
              <div className={styles.resetContent}>
                <h3 className={styles.resetTitle}>Secure Password Reset</h3>
                <p className={styles.resetDescription}>
                  Enter your email address and we'll send you a secure link to reset your password.
                </p>
              </div>
            </div>
          </div>
          
          {/* Forgot password form component */}
          <main className={styles.formSection}>
            <ForgotPasswordForm />
          </main>
          
          {/* Footer with navigation and legal links */}
          <footer className={styles.loginFooter}>
            <div className={styles.signupPrompt}>
              <p className={styles.footerText}>
                Remember your password? 
                <a 
                  href="/login"
                  className={styles.registerLink}
                  title="Back to login"
                >
                  Sign in here
                </a>
              </p>
            </div>
            
            <div className={styles.helpLinks}>
              <a 
                href="/support" 
                className={styles.helpLink}
                title="Get help with your account"
              >
                Need Help?
              </a>
              <a 
                href={`${process.env.REACT_APP_API_URL || ''}/register`}
                className={styles.helpLink}
                title="Create new account"
              >
                Create Account
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
              <span className={styles.securityText}>Secure Reset Process</span>
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
