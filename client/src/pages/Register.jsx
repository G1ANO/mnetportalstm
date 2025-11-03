import { useState } from "react";
import axios from "axios";
import '../index.css';

export default function Register({ onGoToLogin, onRegisterSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Register the user
      const registerRes = await axios.post('http://localhost:5000/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        phone_number: form.phone_number
      });

      if (registerRes.status === 201) {
        // Registration successful - now log them in automatically
        alert("Registration successful! Logging you in...");

        // Extract first name from full name
        const firstName = form.name ? form.name.split(' ')[0] : 'User';

        // Auto-login the newly registered user with ID from backend response
        const userData = {
          id: registerRes.data.user_id,
          username: firstName,
          email: form.email,
          isAdmin: false
        };

        console.log('Register: Sending user data to handleLogin:', userData);
        console.log('Register: Backend response:', registerRes.data);
        console.log('TIMESTAMP:', new Date().toISOString());

        if (onRegisterSuccess) {
          onRegisterSuccess(userData);
        } else if (onGoToLogin) {
          onGoToLogin();
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMsg = err.response?.data?.error || "Registration failed. Please try again.";
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.registerContainer}>
        <div className="card" style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.iconContainer}>
              <svg
                style={styles.icon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h2 style={styles.title}>Create Account</h2>
            <p style={styles.subtitle}>Join Mnet WiFi Portal today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger" style={styles.errorAlert}>
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="phone_number">Phone Number</label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span style={styles.spinner}></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Already have an account?{' '}
              <button
                onClick={onGoToLogin}
                className="btn-link"
                style={styles.loginLink}
              >
                Sign In
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
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
  },
  registerContainer: {
    width: '100%',
    maxWidth: '500px',
  },
  card: {
    padding: '2.5rem',
    marginBottom: '1.5rem',
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
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
  formGroup: {
    marginBottom: '1.25rem',
  },
  errorAlert: {
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
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
  loginLink: {
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