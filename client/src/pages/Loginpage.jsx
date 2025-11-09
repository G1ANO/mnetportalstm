import React, { useState } from 'react';
import api from '../api';
import '../index.css';
import './auth.css';

export const LoginPage = ({ onLogin, onGoToRegister }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call the real login API
      const response = await api.post('/login', {
        identifier,
        password
      });

      if (response.status === 200) {
        const userData = response.data.user;

        // Extract first name from full name
        const firstName = userData.name ? userData.name.split(' ')[0] : 'User';

        onLogin({
          username: firstName,
          email: userData.email,
          isAdmin: userData.role === 'admin',
          id: userData.id
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer} className="auth-page-container">
      <div style={styles.loginContainer} className="auth-container">
        <div className="card auth-card" style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.iconContainer} className="auth-icon-container">
              <svg
                style={styles.icon}
                className="auth-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                />
              </svg>
            </div>
            <h2 style={styles.title} className="auth-title">Welcome Back</h2>
            <p style={styles.subtitle} className="auth-subtitle">Sign in to your WiFi Portal account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger auth-alert" style={styles.errorAlert}>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div style={styles.formGroup} className="auth-form-group">
              <label htmlFor="identifier">Email or Phone Number</label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email or phone number"
                required
              />
            </div>

            <div style={styles.formGroup} className="auth-form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary auth-submit-button"
              style={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span style={styles.spinner}></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div style={styles.footer} className="auth-footer">
            <p style={styles.footerText} className="auth-footer-text">
              Don't have an account?{' '}
              <button onClick={onGoToRegister} className="btn-link" style={styles.registerLink}>
                Create Account
              </button>
            </p>
          </div>
        </div>

        {/* Bottom Info */}
        <p style={styles.bottomText}>
          &copy; 2025 Mnet WiFi Portal. All rights reserved.
        </p>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
  },
  loginContainer: {
    width: '100%',
    maxWidth: '450px',
    padding: '0 1rem',
  },
  card: {
    padding: '2.5rem',
    marginBottom: '1.5rem',
  },
  '@media (max-width: 768px)': {
    pageContainer: {
      padding: '1rem',
    },
    card: {
      padding: '1.5rem',
    },
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  iconContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    marginBottom: '1.5rem',
  },
  icon: {
    width: '40px',
    height: '40px',
    color: 'white',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '1rem',
  },
  demoAlert: {
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
  },
  errorAlert: {
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  submitButton: {
    width: '100%',
    padding: '0.875rem',
    fontSize: '1rem',
    fontWeight: '600',
    marginTop: '0.5rem',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  footer: {
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #334155',
    textAlign: 'center',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: '0.875rem',
    marginBottom: '0',
  },
  registerLink: {
    padding: '0',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  bottomText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: '0.875rem',
  },
};
