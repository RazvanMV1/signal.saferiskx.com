import React, { useState, useRef, useEffect } from 'react';
import { register } from '../services/authService';
import ErrorMessage from '../../../components/common/ErrorMessage';
import styles from '../styles/LoginForm.module.css';

export default function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const lockIntervalRef = useRef(null);

  // Validation patterns
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const namePattern = /^[a-zA-Z\s]{2,30}$/;
  const MAX_ATTEMPTS = 3;
  const LOCK_DURATION = 600; // 10 minutes in seconds

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const getPasswordStrengthText = (score) => {
    switch (score) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return 'Weak';
    }
  };

  const getPasswordStrengthColor = (score) => {
    switch (score) {
      case 0:
      case 1:
        return '#ef4444';
      case 2:
        return '#f97316';
      case 3:
        return '#eab308';
      case 4:
        return '#22c55e';
      default:
        return '#ef4444';
    }
  };

  // Form validation
  const isEmailValid = emailPattern.test(email);
  const isFirstNameValid = namePattern.test(firstName.trim());
  const isLastNameValid = namePattern.test(lastName.trim());
  const passwordStrength = calculatePasswordStrength(password);
  const isPasswordStrong = passwordStrength >= 3;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const isFormValid = isEmailValid && isFirstNameValid && isLastNameValid && 
                     isPasswordStrong && passwordsMatch && termsAccepted && !isLocked;

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

  // Auto-focus first name field on mount
  useEffect(() => {
    if (firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(`Too many failed attempts. Please wait ${Math.ceil(lockTimer / 60)} minutes.`);
      return;
    }

    if (!isFormValid) {
      setError('Please fill all fields correctly and accept the terms.');
      return;
    }

    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const data = await register(firstName.trim(), lastName.trim(), email.trim(), password);
      setLoading(false);
      
      if (data.error) {
        setError(data.error);
        setAttempts(prev => {
          const newAttempts = prev + 1;
          if (newAttempts >= MAX_ATTEMPTS) {
            setIsLocked(true);
            setLockTimer(LOCK_DURATION);
            setError('Too many failed attempts. Registration temporarily locked for 10 minutes.');
          }
          return newAttempts;
        });
      } else {
        setSuccess(true);
        setAttempts(0);
        
        // Store user data if needed
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        // Redirect after success
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    } catch (err) {
      setLoading(false);
      console.error('Registration error:', err);
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

  // Success message component
  if (success) {
    return (
      <div className={styles.formContainer}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <div className={styles.successContent}>
            <h3>Account Created Successfully!</h3>
            <p>Welcome to SafeRiskX! Redirecting to your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm} noValidate>
        
        {/* Name fields row */}
        <div className={styles.nameRow}>
          {/* First Name input */}
          <div className={styles.inputGroup}>
            <label htmlFor="firstName" className={styles.inputLabel}>
              First Name
              <span className={styles.required}>*</span>
            </label>
            <div className={`${styles.inputWrapper} ${focusedField === 'firstName' ? styles.focused : ''} ${firstName && !isFirstNameValid ? styles.invalid : ''}`}>
              <div className={styles.inputIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <input
                id="firstName"
                ref={firstNameRef}
                type="text"
                placeholder="First Name"
                value={firstName}
                required
                autoComplete="given-name"
                onChange={e => setFirstName(e.target.value)}
                onFocus={() => setFocusedField('firstName')}
                onBlur={() => setFocusedField(null)}
                onKeyDown={e => handleKeyDown(e, lastNameRef)}
                className={styles.formInput}
                disabled={loading || isLocked}
              />
              <div className={styles.inputUnderline}></div>
              {firstName && isFirstNameValid && (
                <div className={styles.validIcon} aria-hidden="true">✓</div>
              )}
            </div>
            {firstName && !isFirstNameValid && (
              <span className={styles.fieldError}>
                Name must be 2-30 characters, letters only
              </span>
            )}
          </div>

          {/* Last Name input */}
          <div className={styles.inputGroup}>
            <label htmlFor="lastName" className={styles.inputLabel}>
              Last Name
              <span className={styles.required}>*</span>
            </label>
            <div className={`${styles.inputWrapper} ${focusedField === 'lastName' ? styles.focused : ''} ${lastName && !isLastNameValid ? styles.invalid : ''}`}>
              <div className={styles.inputIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <input
                id="lastName"
                ref={lastNameRef}
                type="text"
                placeholder="Last Name"
                value={lastName}
                required
                autoComplete="family-name"
                onChange={e => setLastName(e.target.value)}
                onFocus={() => setFocusedField('lastName')}
                onBlur={() => setFocusedField(null)}
                onKeyDown={e => handleKeyDown(e, emailRef)}
                className={styles.formInput}
                disabled={loading || isLocked}
              />
              <div className={styles.inputUnderline}></div>
              {lastName && isLastNameValid && (
                <div className={styles.validIcon} aria-hidden="true">✓</div>
              )}
            </div>
            {lastName && !isLastNameValid && (
              <span className={styles.fieldError}>
                Name must be 2-30 characters, letters only
              </span>
            )}
          </div>
        </div>

        {/* Email input */}
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.inputLabel}>
            Email Address
            <span className={styles.required}>*</span>
          </label>
          <div className={`${styles.inputWrapper} ${focusedField === 'email' ? styles.focused : ''} ${email && !isEmailValid ? styles.invalid : ''}`}>
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
            />
            <div className={styles.inputUnderline}></div>
            {email && isEmailValid && (
              <div className={styles.validIcon} aria-hidden="true">✓</div>
            )}
          </div>
          {email && !isEmailValid && (
            <span className={styles.fieldError}>
              Please enter a valid email address
            </span>
          )}
        </div>

        {/* Password input with strength meter */}
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.inputLabel}>
            Password
            <span className={styles.required}>*</span>
          </label>
          <div className={`${styles.inputWrapper} ${focusedField === 'password' ? styles.focused : ''} ${password.length > 0 && passwordStrength < 3 ? styles.invalid : ''}`}>
            <div className={styles.inputIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            </div>
            <input
              id="password"
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={password}
              required
              autoComplete="new-password"
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              onKeyDown={e => handleKeyDown(e, confirmPasswordRef)}
              className={styles.formInput}
              disabled={loading || isLocked}
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
            {password.length >= 8 && isPasswordStrong && (
              <div className={styles.validIcon} aria-hidden="true">✓</div>
            )}
          </div>
          
          {/* Password strength meter */}
          {password.length > 0 && (
            <div className={styles.passwordStrength}>
              <div className={styles.strengthMeter}>
                <div 
                  className={styles.strengthFill}
                  style={{ 
                    width: `${(passwordStrength / 4) * 100}%`,
                    backgroundColor: getPasswordStrengthColor(passwordStrength)
                  }}
                ></div>
              </div>
              <span 
                className={styles.strengthText}
                style={{ color: getPasswordStrengthColor(passwordStrength) }}
              >
                {getPasswordStrengthText(passwordStrength)}
              </span>
            </div>
          )}

          {/* Password requirements */}
          {password.length > 0 && (
            <div className={styles.passwordRequirements}>
              <div className={`${styles.requirement} ${password.length >= 8 ? styles.met : ''}`}>
                {password.length >= 8 ? '✓' : '○'} At least 8 characters
              </div>
              <div className={`${styles.requirement} ${/[A-Z]/.test(password) ? styles.met : ''}`}>
                {/[A-Z]/.test(password) ? '✓' : '○'} One uppercase letter
              </div>
              <div className={`${styles.requirement} ${/[0-9]/.test(password) ? styles.met : ''}`}>
                {/[0-9]/.test(password) ? '✓' : '○'} One number
              </div>
              <div className={`${styles.requirement} ${/[^A-Za-z0-9]/.test(password) ? styles.met : ''}`}>
                {/[^A-Za-z0-9]/.test(password) ? '✓' : '○'} One special character
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password input */}
        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword" className={styles.inputLabel}>
            Confirm Password
            <span className={styles.required}>*</span>
          </label>
          <div className={`${styles.inputWrapper} ${focusedField === 'confirmPassword' ? styles.focused : ''} ${confirmPassword.length > 0 && !passwordsMatch ? styles.invalid : ''}`}>
            <div className={styles.inputIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            </div>
            <input
              id="confirmPassword"
              ref={confirmPasswordRef}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              required
              autoComplete="new-password"
              onChange={e => setConfirmPassword(e.target.value)}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField(null)}
              className={styles.formInput}
              disabled={loading || isLocked}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={toggleConfirmPasswordVisibility}
              disabled={loading || isLocked}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
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
            {confirmPassword.length > 0 && passwordsMatch && (
              <div className={styles.validIcon} aria-hidden="true">✓</div>
            )}
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <span className={styles.fieldError}>
              Passwords do not match
            </span>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={e => setTermsAccepted(e.target.checked)}
              className={styles.checkboxInput}
              disabled={loading || isLocked}
              required
            />
            <span className={styles.checkboxCustom}></span>
            <span className={styles.checkboxText}>
              I agree to the{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className={styles.termsLink}>
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className={styles.termsLink}>
                Privacy Policy
              </a>
              <span className={styles.required}>*</span>
            </span>
          </label>
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
              🔒 Registration locked for {formatLockTime(lockTimer)}
            </div>
          )}
        </div>

        {/* Error message component */}
        <ErrorMessage error={error} />

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || isLocked || !isFormValid}
          className={`${styles.submitButton} ${loading ? styles.loading : ''} ${!isFormValid ? styles.disabled : ''}`}
        >
          {loading ? (
            <>
              <span className={styles.spinner} aria-hidden="true"></span>
              <span>Creating Account...</span>
            </>
          ) : isLocked ? (
            <>
              <span className={styles.lockIcon} aria-hidden="true">🔒</span>
              <span>Registration Locked</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <span className={styles.buttonIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </span>
            </>
          )}
        </button>

        {/* Social Login */}
        <div className={styles.socialSection}>
          <div className={styles.divider}>
            <span>Or continue with</span>
          </div>
          <div className={styles.socialButtons}>
            <button
              type="button"
              onClick={() => handleSocialLogin('discord')}
              className={`${styles.socialButton} ${styles.discordButton}`}
              disabled={loading || isLocked}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Discord
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className={`${styles.socialButton} ${styles.googleButton}`}
              disabled={loading || isLocked}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>
        </div>

        {/* Footer links */}
        <div className={styles.formFooter}>
          <div className={styles.footerLinks}>
            <a href="/login" className={styles.loginLink}>
              Already have an account? <span>Sign in</span>
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}