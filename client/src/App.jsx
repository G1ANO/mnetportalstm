import { useState, useEffect } from "react";
import axios from "axios";
import { LoginPage } from "./pages/Loginpage";
import Register from "./pages/Register";
import { HomePage } from "./pages/Home";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import HomeInternetPanel from "./pages/admin/HomeInternetPanel";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [unreadCount, setUnreadCount] = useState(0);

  console.log('App rendering - user:', user, 'currentPage:', currentPage);

  // Restore user session from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedPage = localStorage.getItem('currentPage');

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // Restore the page they were on, or default to dashboard
        setCurrentPage(storedPage || 'dashboard');
      } catch (err) {
        console.error('Error restoring user session:', err);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('currentPage');
      }
    }
  }, []); // Run only once on mount

  const handleLogin = (userData) => {
    setUser(userData);
    // Store complete user object in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    // Also store individual fields for backward compatibility
    localStorage.setItem('username', userData.username);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('isAdmin', userData.isAdmin);
    // Redirect both users and admins to dashboard
    setCurrentPage('dashboard');
    localStorage.setItem('currentPage', 'dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    // Clear all user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('currentPage');
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
    // Save current page to localStorage for persistence on reload
    if (user) {
      localStorage.setItem('currentPage', page);
    }
  };

  // Fetch notifications for non-admin users
  useEffect(() => {
    if (user && !user.isAdmin) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user || user.isAdmin) return;
    try {
      const res = await axios.get(`http://localhost:5000/notifications?user_id=${user.id}`);
      const unread = res.data.filter(n => n.status === 'unread').length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handleBellClick = async () => {
    if (!user || user.isAdmin) return;
    // Mark all as read
    try {
      await axios.patch(`http://localhost:5000/notifications/mark-all-read?user_id=${user.id}`);
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
    // Signal to UserDashboard to switch to feedback tab
    localStorage.setItem('switchToFeedbackTab', 'true');
    // Always navigate to dashboard (Hotspot page) where feedback tab is
    // This ensures the user lands on the correct page regardless of where they are
    if (currentPage !== 'dashboard') {
      navigateTo('dashboard');
    } else {
      // If already on dashboard, trigger a re-render to switch tabs
      localStorage.setItem('switchToFeedbackTab', 'true');
      window.dispatchEvent(new Event('storage'));
    }
  };

  // Login/Register flow
  if (!user) {
    console.log('Rendering login/register page');
    if (currentPage === 'register') {
      return <Register onGoToLogin={goToLogin} onRegisterSuccess={handleLogin} />;
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
                Home Internet
              </button>
            )}
            <button
              onClick={() => navigateTo('dashboard')}
              style={{...styles.navLink, ...(currentPage === 'dashboard' ? styles.navLinkActive : {})}}
            >
              {user.isAdmin ? 'Admin Dashboard' : 'Mnet Hotspot'}
            </button>
            {user.isAdmin && (
              <button
                onClick={() => navigateTo('homeInternetPanel')}
                style={{...styles.navLink, ...(currentPage === 'homeInternetPanel' ? styles.navLinkActive : {})}}
              >
                Home Internet Panel
              </button>
            )}
          </div>

          <div style={styles.navRight}>
            <span style={styles.username}>Welcome, {user.username}</span>

            {/* Notification Bell - Only for non-admin users */}
            {!user.isAdmin && (
              <div
                style={{
                  ...styles.notificationBell,
                  ...(unreadCount > 0 ? styles.notificationBellActive : {})
                }}
                onClick={handleBellClick}
                title={unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'No new notifications'}
              >
                <svg
                  style={styles.bellIcon}
                  fill={unreadCount > 0 ? "#fbbf24" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span style={styles.notificationBadge}>{unreadCount}</span>
                )}
              </div>
            )}

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
        {currentPage === 'home' && <HomePage user={user} onLogout={handleLogout} />}
        {currentPage === 'dashboard' && !user.isAdmin && <UserDashboard user={user} />}
        {currentPage === 'dashboard' && user.isAdmin && <AdminDashboard user={user} />}
        {currentPage === 'homeInternetPanel' && user.isAdmin && <HomeInternetPanel user={user} />}
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
  notificationBell: {
    position: 'relative',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    border: '1px solid rgba(99, 102, 241, 0.1)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBellActive: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    border: '1px solid rgba(251, 191, 36, 0.3)',
    animation: 'bellRing 2s ease-in-out infinite',
  },
  bellIcon: {
    width: '20px',
    height: '20px',
    color: '#cbd5e1',
    transition: 'all 0.3s ease',
  },
  notificationBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: '#ef4444',
    color: 'white',
    borderRadius: '50%',
    minWidth: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.65rem',
    fontWeight: '700',
    border: '2px solid #1e293b',
    padding: '0 4px',
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
