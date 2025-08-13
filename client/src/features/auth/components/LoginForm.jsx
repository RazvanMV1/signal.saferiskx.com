import React, { useState, useRef, useEffect } from 'react';
import { login } from '../services/authService';
import ErrorMessage from '../../../components/common/ErrorMessage';
import styles from '../styles/LoginForm.module.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const lockIntervalRef = useRef(null);

  // Validation patterns
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MAX_ATTEMPTS = 5;
  const LOCK_DURATION = 300; // 5 minutes in seconds

  // Form validation effect
  useEffect(() => {
    const isEmailValid = emailPattern.test(email);
    const isPasswordValid = password.length >= 6;
    setIsFormValid(isEmailValid && isPasswordValid && !isLocked);
  }, [email, password, isLocked]);

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

  // Auto-focus email field on mount
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(`Too many failed attempts. Please wait ${Math.ceil(lockTimer / 60)} minutes.`);
      return;
    }

    if (!isFormValid) {
      setError('Please enter a valid email and password (minimum 6 characters).');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      setLoading(false);
      
      if (data.error) {
        setError(data.error);
        setAttempts(prev => {
          const newAttempts = prev + 1;
          if (newAttempts >= MAX_ATTEMPTS) {
            setIsLocked(true);
            setLockTimer(LOCK_DURATION);
            setError('Too many failed attempts. Account temporarily locked for 5 minutes.');
          }
          return newAttempts;
        });
      } else {
        // Success - reset attempts and redirect
        setAttempts(0);
        
        // Store user data if needed
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        // Redirect to dashboard
        const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
        window.location.href = redirectUrl;
      }
    } catch (err) {
      setLoading(false);
      console.error('Login error:', err);
      setError('Network error. Please check your connection and try again.');
    }
  };

  const handleKeyDown = (e, nextFieldRef) => {
    if (e.key === 'Enter' && nextFieldRef?.current) {
      e.preventDefault();
      nextFieldRef.current.focus();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formatLockTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSocialLogin = (provider) => {
    const apiUrl = process.env.REACT_APP_API_URL || '';
    window.location.href = `${apiUrl}/auth/${provider}`;
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm} noValidate>
        {/* ELIMINAT form header pentru a evita repetarea */}
        {/* Header este acum doar în LoginPage.jsx */}
        
        {/* Email input with validation */}
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.inputLabel}>
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
              id="email"
              ref={emailRef}
              type="email"
              placeholder="Enter your email address"
              value={email}
              required
              autoComplete="email"
              onChange={e => setEmail(e.target.value.trim())}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              onKeyDown={e => handleKeyDown(e, passwordRef)}
              className={styles.formInput}
              disabled={loading || isLocked}
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

        {/* Password input with show/hide toggle */}
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.inputLabel}>
            Password
            <span className={styles.required}>*</span>
          </label>
          <div className={`${styles.inputWrapper} ${focusedField === 'password' ? styles.focused : ''} ${password.length > 0 && password.length < 6 ? styles.invalid : ''}`}>
            <div className={styles.inputIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            </div>
            <input
              id="password"
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              required
              autoComplete="current-password"
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              className={styles.formInput}
              disabled={loading || isLocked}
              aria-describedby={password.length > 0 && password.length < 6 ? 'password-error' : undefined}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={togglePasswordVisibility}
              disabled={loading || isLocked}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              )}
            </button>
            <div className={styles.inputUnderline}></div>
            {password.length >= 6 && (
              <div className={styles.validIcon} aria-hidden="true">✓</div>
            )}
          </div>
          {password.length > 0 && password.length < 6 && (
            <span id="password-error" className={styles.fieldError}>
              Password must be at least 6 characters long
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
              🔒 Account locked for {formatLockTime(lockTimer)}
            </div>
          )}
        </div>

        {/* Error message component */}
        <ErrorMessage error={error} />

        {/* Submit button with enhanced states */}
        <button
          type="submit"
          disabled={loading || isLocked || !isFormValid}
          className={`${styles.submitButton} ${loading ? styles.loading : ''} ${!isFormValid ? styles.disabled : ''}`}
          aria-describedby="submit-status"
        >
          {loading ? (
            <>
              <span className={styles.spinner} aria-hidden="true"></span>
              <span>Signing in...</span>
            </>
          ) : isLocked ? (
            <>
              <span className={styles.lockIcon} aria-hidden="true">🔒</span>
              <span>Account Locked</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <span className={styles.buttonIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </span>
            </>
          )}
        </button>

        {/* Social login options */}
        <div className={styles.socialLogin}>
          <div className={styles.divider}>
            <span className={styles.dividerText}>Or continue with</span>
          </div>
          
          <div className={styles.socialButtons}>
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className={styles.socialButton}
              disabled={loading || isLocked}
              aria-label="Sign in with Google"
            >
              <svg viewBox="0 0 24 24" className={styles.socialIcon}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('discord')}
              className={styles.socialButton}
              disabled={loading || isLocked}
              aria-label="Sign in with Discord"
            >
              <svg viewBox="0 0 24 24" className={styles.socialIcon}>
                <path fill="#5865F2" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0188 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
              </svg>
              <span>Discord</span>
            </button>
          </div>
        </div>

        {/* Footer eliminat pentru a evita repetarea - va fi în LoginPage.jsx */}
      </form>
    </div>
  );
}
