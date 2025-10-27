import { useState } from "react";
import { LoginPage } from "./pages/Loginpage";
import Register from "./pages/Register";
import { HomePage } from "./pages/Home";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');

  console.log('App rendering - user:', user, 'currentPage:', currentPage);

  const handleLogin = (userData) => {
    setUser(userData);
    // Store user in localStorage for navbar
    localStorage.setItem('username', userData.username);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('isAdmin', userData.isAdmin);
    // Redirect users to dashboard, admins to home
    setCurrentPage(userData.isAdmin ? 'home' : 'dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAdmin');
    setCurrentPage('login');
  };

  const goToRegister = () => {
    setCurrentPage('register');
  };

  const goToLogin = () => {
    setCurrentPage('login');
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Login/Register flow
  if (!user) {
    console.log('Rendering login/register page');
    if (currentPage === 'register') {
      return <Register onGoToLogin={goToLogin} />;
    }
    return <LoginPage onLogin={handleLogin} onGoToRegister={goToRegister} />;
  }

  console.log('Rendering main app with navbar');

  // Logged in - show navbar and content
  return (
    <div>
      {/* Navigation Bar */}
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <div style={styles.navLeft}>
            <div style={styles.logo}>
              <svg style={styles.logoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
              <span style={styles.logoText}>Mnet Portal</span>
            </div>
          </div>

          <div style={styles.navCenter}>
            {!user.isAdmin && (
              <button
                onClick={() => navigateTo('home')}
                style={{...styles.navLink, ...(currentPage === 'home' ? styles.navLinkActive : {})}}
              >
                🏠 Home Internet
              </button>
            )}
            <button
              onClick={() => navigateTo('dashboard')}
              style={{...styles.navLink, ...(currentPage === 'dashboard' ? styles.navLinkActive : {})}}
            >
              {user.isAdmin ? '📊 Admin Dashboard' : '📶 Mnet Hotspot'}
            </button>
            {user.isAdmin && (
              <button
                onClick={() => navigateTo('admin')}
                style={{...styles.navLink, ...(currentPage === 'admin' ? styles.navLinkActive : {})}}
              >
                ⚙️ Admin Panel
              </button>
            )}
          </div>

          <div style={styles.navRight}>
            <span style={styles.username}>Welcome, {user.username}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              <svg style={styles.logoutIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div style={styles.content}>
        {currentPage === 'home' && <HomePage user={{...user, id: 1}} onLogout={handleLogout} />}
        {currentPage === 'dashboard' && !user.isAdmin && <UserDashboard user={{...user, id: 1}} />}
        {currentPage === 'dashboard' && user.isAdmin && <AdminDashboard user={{...user, id: 1}} />}
        {currentPage === 'admin' && user.isAdmin && <AdminDashboard user={{...user, id: 1}} />}
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    color: '#6366f1',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #6366f1 0%, #10b981 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  navCenter: {
    display: 'flex',
    gap: '0.5rem',
    flex: 1,
    justifyContent: 'center',
  },
  navLink: {
    background: 'transparent',
    border: 'none',
    color: '#cbd5e1',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  navLinkActive: {
    background: 'rgba(99, 102, 241, 0.1)',
    color: '#6366f1',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  username: {
    color: '#94a3b8',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  logoutIcon: {
    width: '16px',
    height: '16px',
  },
  content: {
    minHeight: 'calc(100vh - 80px)',
  },
};

export default App;
