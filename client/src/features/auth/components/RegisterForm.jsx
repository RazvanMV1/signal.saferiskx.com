import React, { useState } from 'react';
import { register } from '../services/authService.js';
import ErrorMessage from '../../../components/common/ErrorMessage';
import styles from '../styles/RegisterForm.module.css';

export default function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    const data = await register(firstName, lastName, email, password);
    setLoading(false);
    if (data.error) {
      setError(data.error);
    } else {
      setSuccess(true);
      // Poți redirecta sau afișa un mesaj de succes aici
      // window.location.href = '/login';
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm}>
      <h2 className={styles.formTitle}>Create Your Account</h2>
      <p className={styles.formSubtitle}>Start your journey with SafeRiskX</p>
      
      {/* Name fields row */}
      <div className={styles.nameRow}>
        {/* First Name input with animated focus effects */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>First Name</label>
          <div className={`${styles.inputWrapper} ${focusedField === 'firstName' ? styles.focused : ''}`}>
            <div className={styles.inputIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              required
              onChange={e => setFirstName(e.target.value)}
              onFocus={() => setFocusedField('firstName')}
              onBlur={() => setFocusedField(null)}
              className={styles.formInput}
            />
            <div className={styles.inputUnderline}></div>
          </div>
        </div>

        {/* Last Name input with animated focus effects */}
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Last Name</label>
          <div className={`${styles.inputWrapper} ${focusedField === 'lastName' ? styles.focused : ''}`}>
            <div className={styles.inputIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              required
              onChange={e => setLastName(e.target.value)}
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => setFocusedField(null)}
              className={styles.formInput}
            />
            <div className={styles.inputUnderline}></div>
          </div>
        </div>
      </div>

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
            placeholder="Create a password"
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
      
      {/* Success message with animation */}
      {success && (
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <div className={styles.successContent}>
            <h3>Account created successfully!</h3>
            <p>You can now sign in to your account.</p>
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
            Creating Account...
          </>
        ) : (
          <>
            Create Account
            <span className={styles.buttonIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </span>
          </>
        )}
      </button>

      {/* Footer links */}
      <div className={styles.formFooter}>
        <div className={styles.footerLinks}>
          <a href="/login" className={styles.loginLink}>
            Already have an account? <span>Sign in</span>
          </a>
        </div>
      </div>
    </form>
  );
}
