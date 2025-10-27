import { useState, useEffect } from "react";
import axios from "axios";
import FeedbackForm from "../components/FeedbackForm";
import ComplaintForm from "../components/ComplaintForm";
import LoyaltyPanel from "../components/LoyaltyPanel";
import NotificationPanel from "../components/NotificationPanel";
import "../index.css";

const UserDashboard = ({ user }) => {
  const [subscription, setSubscription] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [loyalty, setLoyalty] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchSubscription();
    fetchTiers();
    fetchLoyalty();
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    const fetchSubscription = () =>{
    axios
      .get(`http://localhost:5000/subscriptions?user_id=${user.id}`)
      .then((res) => {
        if (res.data.length > 0) setSubscription(res.data[0]);
      })
      .catch((err) => console.error(err));
  };

    const fetchTiers = () => {
    axios
      .get("http://localhost:5000/tiers")
      .then((res) => setTiers(res.data))
      .catch((err) => console.error(err));
  };

  const fetchLoyalty = () => {
    axios
      .get(`http://localhost:5000/loyalty?user_id=${user.id}`)
      .then((res) => setLoyalty(res.data))
      .catch((err) => console.error(err));
  };

  const fetchNotifications = () => {
    axios
      .get(`http://localhost:5000/notifications?user_id=${user.id}`)
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <div style={styles.pageContainer}>
      <div className="container">
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome, {user.name}!</h2>
          <p style={styles.subtitle}>Manage your WiFi subscription and account</p>
        </div>

        {/* Subscription Section */}
        <section style={styles.section}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Your Subscription</h3>
              <p className="card-description">Current plan details</p>
            </div>
            {subscription ? (
              <div style={styles.subscriptionGrid}>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Plan</span>
                  <span style={styles.statValue}>{subscription.tier_name}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Status</span>
                  <span className="badge badge-success">{subscription.status}</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>Start Date</span>
                  <span style={styles.statValue}>
                    {new Date(subscription.start_date).toLocaleDateString()}
                  </span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statLabel}>End Date</span>
                  <span style={styles.statValue}>
                    {new Date(subscription.end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="alert alert-info">
                You currently have no active subscription.
              </div>
            )}
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2" style={styles.gridSection}>
          {/* Feedback Section */}
          <section>
            <h3 style={styles.sectionTitle}>Submit Feedback</h3>
            <FeedbackForm userId={user.id} tiers={tiers} />
          </section>

          {/* Complaint Section */}
          <section>
            <h3 style={styles.sectionTitle}>File a Complaint</h3>
            <ComplaintForm userId={user.id} />
          </section>
        </div>

        {/* Loyalty Section */}
        {loyalty && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Loyalty Points</h3>
            <LoyaltyPanel loyalty={loyalty} />
          </section>
        )}

        {/* Notifications Section */}
        {notifications.length > 0 && (
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Notifications</h3>
            <NotificationPanel notifications={notifications} />
          </section>
        )}
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
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#94a3b8',
  },
  section: {
    marginBottom: '2rem',
  },
  gridSection: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: '1rem',
  },
  subscriptionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: 'rgba(99, 102, 241, 0.05)',
    borderRadius: '0.5rem',
    border: '1px solid rgba(99, 102, 241, 0.1)',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  statValue: {
    color: '#f1f5f9',
    fontSize: '1rem',
    fontWeight: '600',
  },
};

export default UserDashboard;
