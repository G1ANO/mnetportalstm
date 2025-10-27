import React from 'react';
import '../index.css';

export const HomePage = ({ user, onLogout }) => {
  const connectionDetails = {
    networkName: "Mnet Hotspot",
    speed: "50 Mbps",
    dataUsed: "1.2 GB",
    sessionTime: "2 hours 14 min",
  };

  const loyalty = {
    points: user.isAdmin ? "∞ (Admin Access)" : "120",
    nextReward: user.isAdmin ? "N/A" : "Free 1GB after 200 points",
  };

  return (
    <div style={styles.pageContainer}>
      <div className="container">
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
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
                  d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                />
              </svg>
            </div>
            <h1 style={styles.heading}>Welcome to {connectionDetails.networkName}</h1>
            <p style={styles.subHeading}>Hello, {user.username}!</p>
          </div>
          <button onClick={onLogout} className="btn-secondary" style={styles.logoutButton}>
            <svg
              style={styles.buttonIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>

        {/* ADMIN DASHBOARD */}
        {user.isAdmin && (
          <div className="card" style={styles.adminPanel}>
            <div className="card-header">
              <h3 className="card-title">Admin Dashboard</h3>
              <p className="card-description">Manage users, subscriptions, and feedback</p>
            </div>
            <div style={styles.adminGrid}>
              <div style={styles.adminCard}>
                <div style={styles.adminCardIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h4>User Management</h4>
                <p>View and manage all users</p>
              </div>
              <div style={styles.adminCard}>
                <div style={styles.adminCardIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h4>Subscription Tiers</h4>
                <p>Create or update plans</p>
              </div>
              <div style={styles.adminCard}>
                <div style={styles.adminCardIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h4>User Feedback</h4>
                <p>Review ratings and comments</p>
              </div>
              <div style={styles.adminCard}>
                <div style={styles.adminCardIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h4>Policy Enforcement</h4>
                <p>Disconnect violating users</p>
              </div>
            </div>
          </div>
        )}

        {/* USER SECTION */}
        {!user.isAdmin && (
          <div className="grid grid-cols-2" style={styles.userSection}>
            <div className="card">
              <div className="card-header">
                <div style={styles.cardIconSmall}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="card-title">Connection Info</h3>
              </div>
              <div style={styles.statsGrid}>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Speed</span>
                  <span style={styles.statValue}>{connectionDetails.speed}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Data Used</span>
                  <span style={styles.statValue}>{connectionDetails.dataUsed}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Session Time</span>
                  <span style={styles.statValue}>{connectionDetails.sessionTime}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div style={styles.cardIconSmall}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="card-title">Loyalty Program</h3>
              </div>
              <div style={styles.statsGrid}>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Your Points</span>
                  <span style={styles.statValue}>{loyalty.points}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Next Reward</span>
                  <span style={styles.statValue}>{loyalty.nextReward}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={styles.footer}>
          <p>&copy; 2025 Mnet Hotspot — Stay Connected, Stay Rewarded</p>
        </footer>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    paddingTop: '2rem',
    paddingBottom: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '3rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  headerContent: {
    flex: 1,
    textAlign: 'center',
  },
  iconContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    marginBottom: '1.5rem',
    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
  },
  icon: {
    width: '50px',
    height: '50px',
    color: 'white',
  },
  heading: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '0.5rem',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subHeading: {
    fontSize: '1.25rem',
    color: '#94a3b8',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  buttonIcon: {
    width: '20px',
    height: '20px',
  },
  adminPanel: {
    marginBottom: '2rem',
  },
  adminGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  adminCard: {
    padding: '1.5rem',
    background: 'rgba(99, 102, 241, 0.05)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    borderRadius: '0.75rem',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  adminCardIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '0.5rem',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    color: 'white',
  },
  userSection: {
    marginBottom: '2rem',
  },
  cardIconSmall: {
    width: '40px',
    height: '40px',
    borderRadius: '0.5rem',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    color: 'white',
  },
  statsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    background: 'rgba(99, 102, 241, 0.05)',
    borderRadius: '0.5rem',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: '0.875rem',
  },
  statValue: {
    color: '#f1f5f9',
    fontSize: '1rem',
    fontWeight: '600',
  },
  footer: {
    marginTop: '3rem',
    paddingTop: '2rem',
    borderTop: '1px solid #334155',
    textAlign: 'center',
    color: '#64748b',
  },
};
