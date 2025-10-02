'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setError('');
      const response = await api.login(email, password);
  
      console.log("Full login response:", response);
  
      if (response.token?.idToken) {
        login(response.token.idToken);
      }
  
      // Persist admin_id
      try {
        let adminId = response?.user?.uid
        console.log(response.user);

        if (adminId) {
          localStorage.setItem('admin_id', String(adminId));
        }
      } catch (_) {
        // ignore persistence errors silently
      }
  
      router.push("/dashboard");
    } catch (err) {
      if (err.message === "Unauthorized" || err.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (err.message === "not found" || err.status === 404) {
        setError("User not found. Please check your email.");
      } else if (err.message === "Network error" || err.status === 0) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }
    
    setIsLoading(true);
    await handleLogin();
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) {
      setError(''); // Clear error when user starts typing
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <img 
              src="/logo.png" 
              alt="Logo" 
              className={styles.logo}
            />
          </div>
          <h2 className={styles.title}>
            Sign in to your account
          </h2>
          <p className={styles.subtitle}>
            Undergraduation.com CRM Dashboard
          </p>
        </div>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={styles.input}
              placeholder="Email address"
              value={email}
              onChange={handleInputChange(setEmail)}
            />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={styles.input}
              placeholder="Password"
              value={password}
              onChange={handleInputChange(setPassword)}
            />
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.options}>
            <div className={styles.checkboxGroup}>
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className={styles.checkbox}
              />
              <label htmlFor="remember-me" className={styles.checkboxLabel}>
                Remember me
              </label>
            </div>

            <a href="#" className={styles.forgotPassword}>
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? (
              <>
                <svg className={styles.loadingSpinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"></path>
                </svg>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>

          <div className={styles.divider}>
            <div className={styles.dividerLine}>
              <span className={styles.dividerText}>Demo Credentials</span>
            </div>
          </div>
          
          <div className={styles.demoCredentials}>
            <p>Email: lucasrpg.silva@gmail.com</p>
            <p>Password: 123456</p>
          </div>
          </form>
        </div>
    </div>
  );
};