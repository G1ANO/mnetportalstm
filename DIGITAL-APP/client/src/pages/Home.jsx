import React from 'react';

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
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to {connectionDetails.networkName}</h1>
      <h2 style={styles.subHeading}>Hello, {user.username}</h2>

      {/* ADMIN DASHBOARD */}
      {user.isAdmin && (
        <div style={styles.adminPanel}>
          <h3>Admin Dashboard</h3>
          <p>Manage users, subscriptions, and feedback here.</p>
          <ul>
            <li>View and manage all users</li>
            <li>Create or update subscription tiers</li>
            <li>Review user feedback and ratings</li>
            <li>Disconnect users violating policy</li>
          </ul>
        </div>
      )}

      {/* USER SECTION */}
      {!user.isAdmin && (
        <div style={styles.userSection}>
          <div style={styles.card}>
            <h3>Connection Info</h3>
            <p><strong>Speed:</strong> {connectionDetails.speed}</p>
            <p><strong>Data Used:</strong> {connectionDetails.dataUsed}</p>
            <p><strong>Session Time:</strong> {connectionDetails.sessionTime}</p>
          </div>

          <div style={styles.card}>
            <h3>Loyalty Program</h3>
            <p><strong>Points:</strong> {loyalty.points}</p>
            <p><strong>Next Reward:</strong> {loyalty.nextReward}</p>
          </div>
        </div>
      )}

      <button onClick={onLogout} style={styles.logoutButton}>
        Logout
      </button>

      <footer style={styles.footer}>
        <p>&copy; 2025 Mnet Hotspot — Stay Connected, Stay Rewarded </p>
      </footer>
    </div>
  );
};

