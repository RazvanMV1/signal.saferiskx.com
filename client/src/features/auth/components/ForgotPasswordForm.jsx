import React, { useState } from 'react';
import { forgotPassword } from '../services/authService';
import styles from '../styles/ForgotPasswordForm.module.css';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSent(false);
    setLoading(true);

    const data = await forgotPassword(email);
    setLoading(false);

    if (data.error) {
      setError(data.error);
    } else {
      setSent(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.forgotPasswordForm}>
      <h2 className={styles.formTitle}>Reset Password</h2>
      <p className={styles.formSubtitle}>
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      {/* Email input with animated focus effects */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Email Address</label>
        <div className={`${styles.inputWrapper} ${focusedField === 'email' ? styles.focused : ''}`}>
          <div className={styles.inputIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            className={styles.formInput}
          />
          <div className={styles.inputUnderline}></div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className={styles.errorMessage}>
          <div className={styles.errorIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <span>{error}</span>
        </div>
      )}

      {/* Success message with animation */}
      {sent && (
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <div className={styles.successContent}>
            <h3>Email sent successfully!</h3>
            <p>If an account exists with this email, you will receive a reset link.</p>
          </div>
        </div>
      )}

      {/* Animated submit button */}
      <button
        type="submit"
        disabled={loading}
        className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
      >
        {loading ? (
          <>
            <span className={styles.spinner}></span>
            Sending...
          </>
        ) : (
          <>
            Send Reset Link
            <span className={styles.buttonIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </span>
          </>
        )}
      </button>

      {/* Footer links */}
      <div className={styles.formFooter}>
        <div className={styles.footerLinks}>
          <a href="/login" className={styles.backLink}>
            <span className={styles.backIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
            </span>
            Back to Login
          </a>
        </div>
        <div className={styles.helpText}>
          <p>Remember your password? <a href="/login" className={styles.loginLink}>Sign in</a></p>
        </div>
      </div>
    </form>
  );
}
