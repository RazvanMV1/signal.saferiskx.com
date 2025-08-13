import React, { useState, useRef, useEffect } from 'react';
import { forgotPassword } from '../services/authService';
import ErrorMessage from '../../../components/common/ErrorMessage';
import styles from '../styles/LoginForm.module.css'; // Folosim același CSS ca LoginForm

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  
  const emailRef = useRef(null);
  const lockIntervalRef = useRef(null);
  const resendIntervalRef = useRef(null);

  // Validation patterns
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MAX_ATTEMPTS = 3; // Fewer attempts for forgot password
  const LOCK_DURATION = 300; // 5 minutes
  const RESEND_COOLDOWN = 60; // 1 minute

  // Form validation effect
  useEffect(() => {
    const isEmailValid = emailPattern.test(email);
    setIsFormValid(isEmailValid && !isLocked && !sent);
  }, [email, isLocked, sent]);

  // Lock timer effect
  useEffect(() => {
    if (isLocked && lockTimer > 0) {
      lockIntervalRef.current = setInterval(() => {
        setLockTimer(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (lockIntervalRef.current) {
        clearInterval(lockIntervalRef.current);
      }
    };
  }, [isLocked, lockTimer]);

  // Resend timer effect
  useEffect(() => {
    if (resendTimer > 0) {
      resendIntervalRef.current = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (resendIntervalRef.current) {
        clearInterval(resendIntervalRef.current);
      }
    };
  }, [resendTimer]);

  // Auto-focus email field on mount
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(`Too many attempts. Please wait ${Math.ceil(lockTimer / 60)} minutes.`);
      return;
    }

    if (!isFormValid) {
      setError('Please enter a valid email address.');
      return;
    }

    if (resendTimer > 0) {
      setError(`Please wait ${resendTimer} seconds before requesting another reset.`);
      return;
    }

    setError('');
    setSent(false);
    setLoading(true);

    try {
      const data = await forgotPassword(email);
      setLoading(false);

      if (data.error) {
        setError(data.error);
        setAttempts(prev => {
          const newAttempts = prev + 1;
          if (newAttempts >= MAX_ATTEMPTS) {
            setIsLocked(true);
            setLockTimer(LOCK_DURATION);
            setError('Too many reset attempts. Please wait 5 minutes before trying again.');
          }
          return newAttempts;
        });
      } else {
        // Success
        setSent(true);
        setAttempts(0);
        setResendTimer(RESEND_COOLDOWN);
        
        // Track successful reset request
        if (window.gtag) {
          window.gtag('event', 'password_reset_requested', {
            method: 'email'
          });
        }
      }
    } catch (err) {
      setLoading(false);
      console.error('Forgot password error:', err);
      setError('Network error. Please check your connection and try again.');
    }
  };

  const handleResend = () => {
    if (resendTimer === 0) {
      setSent(false);
      setError('');
      // Allow user to submit again
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm} noValidate>
        
        {/* Email input with validation */}
        <div className={styles.inputGroup}>
          <label htmlFor="reset-email" className={styles.inputLabel}>
            Email Address
            <span className={styles.required}>*</span>
          </label>
          <div className={`${styles.inputWrapper} ${focusedField === 'email' ? styles.focused : ''} ${email && !emailPattern.test(email) ? styles.invalid : ''}`}>
            <div className={styles.inputIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <input
              id="reset-email"
              ref={emailRef}
              type="email"
              placeholder="Enter your email address"
              value={email}
              required
              autoComplete="email"
              onChange={e => setEmail(e.target.value.trim())}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className={styles.formInput}
              disabled={loading || isLocked || sent}
              aria-describedby={email && !emailPattern.test(email) ? 'email-error' : undefined}
            />
            <div className={styles.inputUnderline}></div>
            {email && emailPattern.test(email) && (
              <div className={styles.validIcon} aria-hidden="true">✓</div>
            )}
          </div>
          {email && !emailPattern.test(email) && (
            <span id="email-error" className={styles.fieldError}>
              Please enter a valid email address
            </span>
          )}
        </div>

        {/* Security features */}
        <div className={styles.securityInfo}>
          {attempts > 0 && attempts < MAX_ATTEMPTS && (
            <div className={styles.attemptsWarning}>
              ⚠️ {MAX_ATTEMPTS - attempts} attempts remaining
            </div>
          )}
          {isLocked && (
            <div className={styles.lockNotice}>
              🔒 Too many attempts. Wait {formatTime(lockTimer)}
            </div>
          )}
          {resendTimer > 0 && (
            <div className={styles.attemptsWarning}>
              ⏱️ Next request available in {formatTime(resendTimer)}
            </div>
          )}
        </div>

        {/* Error message component */}
        <ErrorMessage error={error} />

        {/* Success message with enhanced design */}
        {sent && (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <div className={styles.successContent}>
              <h3 className={styles.successTitle}>Reset Link Sent!</h3>
              <p className={styles.successText}>
                If an account exists with <strong>{email}</strong>, you will receive a password reset link within a few minutes.
              </p>
              <div className={styles.successActions}>
                <p className={styles.successNote}>
                  Didn't receive the email? Check your spam folder or{' '}
                  {resendTimer === 0 ? (
                    <button 
                      type="button" 
                      onClick={handleResend}
                      className={styles.resendLink}
                    >
                      try again
                    </button>
                  ) : (
                    <span className={styles.resendWait}>
                      try again in {formatTime(resendTimer)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit button with enhanced states */}
        <button
          type="submit"
          disabled={loading || isLocked || !isFormValid || (sent && resendTimer > 0)}
          className={`${styles.submitButton} ${loading ? styles.loading : ''} ${!isFormValid ? styles.disabled : ''}`}
          aria-describedby="submit-status"
        >
          {loading ? (
            <>
              <span className={styles.spinner} aria-hidden="true"></span>
              <span>Sending Reset Link...</span>
            </>
          ) : isLocked ? (
            <>
              <span className={styles.lockIcon} aria-hidden="true">🔒</span>
              <span>Too Many Attempts</span>
            </>
          ) : sent ? (
            <>
              <span className={styles.sentIcon} aria-hidden="true">✓</span>
              <span>Email Sent Successfully</span>
            </>
          ) : (
            <>
              <span>Send Reset Link</span>
              <span className={styles.buttonIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </span>
            </>
          )}
        </button>

        {/* Security notice */}
        <div className={styles.securityNotice}>
          <div className={styles.noticeContent}>
            <div className={styles.noticeIcon}>🔐</div>
            <div className={styles.noticeText}>
              <p><strong>Security Notice:</strong></p>
              <p>For your security, reset links expire in 15 minutes and can only be used once.</p>
            </div>
          </div>
        </div>

        {/* Additional help */}
        <div className={styles.helpSection}>
          <h4 className={styles.helpTitle}>Need Additional Help?</h4>
          <div className={styles.helpLinks}>
            <a href="/support" className={styles.helpLink}>
              <span className={styles.helpIcon}>💬</span>
              Contact Support
            </a>
            <a href="/login" className={styles.helpLink}>
              <span className={styles.helpIcon}>←</span>
              Back to Login
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
