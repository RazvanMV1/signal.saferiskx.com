import React, { useState } from 'react';
import { login } from '../services/authService';
import ErrorMessage from '../../../components/common/ErrorMessage';
import styles from '../styles/LoginForm.module.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      setLoading(false);
      if (data.error) {
        setError(data.error);
      } else {
        window.location.href = '/dashboard'; // sau folosește navigate din react-router
      }
    } catch (err) {
      setLoading(false);
      setError('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.loginForm}>
      <h2 className={styles.formTitle}>Welcome Back</h2>
      <p className={styles.formSubtitle}>Sign in to your account</p>
      
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
            placeholder="Enter your email"
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

      {/* Password input with animated focus effects */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Password</label>
        <div className={`${styles.inputWrapper} ${focusedField === 'password' ? styles.focused : ''}`}>
          <div className={styles.inputIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
          </div>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            required
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            className={styles.formInput}
          />
          <div className={styles.inputUnderline}></div>
        </div>
      </div>

      {/* Error message component */}
      <ErrorMessage error={error} />

      {/* Animated submit button */}
      <button
        type="submit"
        disabled={loading}
        className={`${styles.submitButton} ${loading ? styles.loading : ''}`}
      >
        {loading ? (
          <>
            <span className={styles.spinner}></span>
            Signing in...
          </>
        ) : (
          <>
            Sign In
            <span className={styles.buttonIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </span>
          </>
        )}
      </button>

      {/* Footer links */}
      <div className={styles.formFooter}>
        <div className={styles.footerLinks}>
          <a href="/register" className={styles.registerLink}>
            Don't have an account? <span>Sign up</span>
          </a>
        </div>
        <div className={styles.forgotPassword}>
          <a href="/forgot-password" className={styles.forgotLink}>
            Forgot Password?
          </a>
        </div>
      </div>
    </form>
  );
}
