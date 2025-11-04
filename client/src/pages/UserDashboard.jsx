import { useState, useEffect } from "react";
import api from "../api";
import FeedbackForm from "../components/FeedbackForm";
import "../index.css";

// Utility function to format datetime in GMT+3 (East Africa Time)
const formatToGMT3 = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  // Convert to GMT+3 by adding 3 hours
  const gmt3Date = new Date(date.getTime() + (3 * 60 * 60 * 1000));
  return gmt3Date.toLocaleString('en-KE', {
    timeZone: 'Africa/Nairobi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

const UserDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('plans');
  const [subscriptions, setSubscriptions] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [loyalty, setLoyalty] = useState({ points_earned: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedRedeemTier, setSelectedRedeemTier] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    console.log('UserDashboard: Received user prop:', user);
    console.log('UserDashboard: user.id =', user?.id);
    if (user && user.id) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchSubscription(),
        fetchTiers(),
        fetchLoyalty(),
        fetchNotifications()
      ]);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      // Fetch all hotspot subscriptions (ordered by date, most recent first)
      const res = await api.get(`/subscriptions?user_id=${user.id}&type=hotspot`);
      // Keep up to 3 most recent subscriptions for history
      setSubscriptions(res.data.slice(0, 3));
    } catch (err) {
      console.error("Error fetching subscription:", err);
    }
  };

  const fetchTiers = async () => {
    try {
      // Fetch only hotspot tiers
      const res = await api.get("/tiers?type=hotspot");
      setTiers(res.data);
    } catch (err) {
      console.error("Error fetching tiers:", err);
    }
  };

  const fetchLoyalty = async () => {
    try {
      const res = await api.get(`/loyalty?user_id=${user.id}`);
      setLoyalty(res.data);
    } catch (err) {
      console.error("Error fetching loyalty:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get(`/notifications?user_id=${user.id}`);
      setNotifications(res.data);
      // Count unread notifications
      const unread = res.data.filter(n => n.status === 'unread').length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.patch(`/notifications/mark-all-read?user_id=${user.id}`);
      fetchNotifications(); // Refresh notifications
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

  const handleBellClick = () => {
    setActiveTab('feedback'); // Switch to feedback tab where notifications will be shown
    markAllNotificationsRead(); // Mark all as read when bell is clicked
  };

  // Check if we should auto-switch to feedback tab (when bell is clicked from navbar)
  useEffect(() => {
    const checkAndSwitchToFeedback = () => {
      const shouldSwitchToFeedback = localStorage.getItem('switchToFeedbackTab');
      if (shouldSwitchToFeedback === 'true') {
        setActiveTab('feedback');
        localStorage.removeItem('switchToFeedbackTab'); // Clear the signal
      }
    };

    // Check on mount
    checkAndSwitchToFeedback();

    // Listen for storage events (when bell is clicked while already on dashboard)
    window.addEventListener('storage', checkAndSwitchToFeedback);

    return () => {
      window.removeEventListener('storage', checkAndSwitchToFeedback);
    };
  }, []);

  const handleSubscribe = async (tierId) => {
    // Check if there's an active subscription
    const activeSubscription = subscriptions.find(sub => sub.status === 'active');

    if (activeSubscription) {
      // Calculate time remaining
      const endDate = new Date(activeSubscription.end_date);
      const now = new Date();
      const timeRemaining = endDate - now;
      const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

      // Show detailed confirmation dialog
      const confirmMessage = `⚠️ SUBSCRIPTION OVERRIDE WARNING ⚠️\n\n` +
        `You currently have an active subscription:\n` +
        `Plan: ${activeSubscription.tier_name}\n` +
        `Time Remaining: ${hoursRemaining} hours and ${minutesRemaining} minutes\n` +
        `Expires: ${formatToGMT3(activeSubscription.end_date)} EAT\n\n` +
        `If you continue, your current subscription will be REPLACED immediately and the remaining time will be lost.\n\n` +
        `Do you want to proceed with the new subscription?`;

      if (!window.confirm(confirmMessage)) {
        return; // User cancelled
      }
    } else {
      // No active subscription, just confirm normally
      if (!window.confirm("Subscribe to this plan?")) return;
    }

    try {
      await api.post('/subscriptions', {
        user_id: user.id,
        tier_id: tierId
      });
      alert('Subscription successful!');
      fetchSubscription();
    } catch (err) {
      alert('Error subscribing: ' + err.message);
    }
  };

  const handleRedeemPoints = async (tierId) => {
    if (!tierId) {
      alert('Please select a package to redeem');
      return;
    }

    // Find the selected tier
    const selectedTier = tiers.find(t => t.id === parseInt(tierId));
    if (!selectedTier) {
      alert('Invalid package selected');
      return;
    }

    // Calculate points required: 70 points per shilling
    const pointsRequired = selectedTier.price * 70;

    // Check if user has enough points
    if (loyalty.balance < pointsRequired) {
      alert(`Insufficient points!\n\nRequired: ${pointsRequired} points\nYou have: ${loyalty.balance} points\nYou need ${pointsRequired - loyalty.balance} more points`);
      return;
    }

    // Confirm redemption
    const confirmMessage = `🎁 REDEEM SUBSCRIPTION\n\n` +
      `Package: ${selectedTier.name}\n` +
      `Price: ${selectedTier.price} KSH\n` +
      `Points Required: ${pointsRequired} points\n` +
      `Your Balance: ${loyalty.balance} points\n` +
      `Remaining After: ${loyalty.balance - pointsRequired} points\n\n` +
      `Do you want to redeem this package?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      const response = await api.post('/loyalty/redeem', {
        user_id: user.id,
        tier_id: tierId
      });
      alert(`${response.data.message}\n\nPoints Used: ${response.data.points_used}\nRemaining Balance: ${response.data.remaining_balance}`);
      fetchLoyalty();
      fetchSubscription();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      alert('Error redeeming points: ' + errorMsg);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div className="container">
        {/* Header with Circular Logo */}
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </div>
          <h1 style={styles.heading}>Mnet Portal</h1>
          <p style={styles.subHeading}>Your WiFi Hotspot Dashboard</p>
        </div>

        {/* Tab Navigation */}
        <div style={styles.tabContainer}>
          <button
            onClick={() => setActiveTab('plans')}
            style={{...styles.tab, ...(activeTab === 'plans' ? styles.activeTab : {})}}
          >
            View Plans
          </button>
          <button
            onClick={() => setActiveTab('myplan')}
            style={{...styles.tab, ...(activeTab === 'myplan' ? styles.activeTab : {})}}
          >
            My Plan
          </button>
          <button
            onClick={() => setActiveTab('loyalty')}
            style={{...styles.tab, ...(activeTab === 'loyalty' ? styles.activeTab : {})}}
          >
            Loyalty Program
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            style={{...styles.tab, ...(activeTab === 'feedback' ? styles.activeTab : {})}}
          >
            Feedback & Complaints
          </button>
        </div>

        {/* View Plans Tab */}
        {activeTab === 'plans' && (
          <div style={styles.tabContent}>
            <h2>Available Plans</h2>
            <div style={styles.plansGrid}>
              {tiers.length === 0 ? (
                <p>No plans available at the moment.</p>
              ) : (
                tiers.map((tier) => (
                  <div key={tier.id} className="card" style={styles.planCard}>
                    <div style={styles.planHeader}>
                      <h3>{tier.name}</h3>
                      <div style={styles.price}>
                        <span style={styles.priceAmount}>KSH {tier.price}</span>
                        <span style={styles.priceDuration}>/ {tier.duration_days} hrs</span>
                      </div>
                    </div>
                    <div style={styles.planDetails}>
                      {tier.description && <p style={styles.description}>{tier.description}</p>}
                    </div>
                    <button
                      onClick={() => handleSubscribe(tier.id)}
                      className="btn-primary"
                      style={{width: '100%'}}
                    >
                      Subscribe Now
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* My Plan Tab */}
        {activeTab === 'myplan' && (
          <div style={styles.tabContent}>
            <h2>My Subscription History</h2>
            {subscriptions.length > 0 ? (
              <div style={styles.subscriptionHistory}>
                {subscriptions.map((subscription, index) => (
                  <div key={subscription.id} className="card" style={index === 0 && subscription.status === 'active' ? styles.activeSubscriptionCard : {}}>
                    {index === 0 && subscription.status === 'active' && (
                      <div style={styles.currentBadge}>Current Plan</div>
                    )}
                    <div style={styles.subscriptionGrid}>
                      <div style={styles.statItem}>
                        <span style={styles.statLabel}>Plan Type</span>
                        <span style={styles.statValue}>{subscription.tier_name || 'N/A'}</span>
                      </div>
                      <div style={styles.statItem}>
                        <span style={styles.statLabel}>Status</span>
                        <span className={`badge ${subscription.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                          {subscription.status}
                        </span>
                      </div>
                      <div style={styles.statItem}>
                        <span style={styles.statLabel}>Started</span>
                        <span style={styles.statValue}>
                          {formatToGMT3(subscription.start_date)} EAT
                        </span>
                      </div>
                      <div style={styles.statItem}>
                        <span style={styles.statLabel}>
                          {subscription.status === 'active' ? 'Expires' : 'Ended'}
                        </span>
                        <span style={styles.statValue}>
                          {formatToGMT3(subscription.end_date)} EAT
                        </span>
                      </div>
                      <div style={styles.statItem}>
                        <span style={styles.statLabel}>Duration</span>
                        <span style={styles.statValue}>
                          {subscription.start_date && subscription.end_date ? (() => {
                            const start = new Date(subscription.start_date);
                            const end = new Date(subscription.end_date);
                            const duration = end - start;
                            const hours = Math.floor(duration / (1000 * 60 * 60));
                            const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
                            return `${hours}h ${minutes}m`;
                          })() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info">
                <p>You currently have no subscription history.</p>
                <button onClick={() => setActiveTab('plans')} className="btn-primary" style={{marginTop: '1rem'}}>
                  View Available Plans
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loyalty Program Tab */}
        {activeTab === 'loyalty' && (
          <div style={styles.tabContent}>
            <h2>Loyalty Program</h2>
            <div className="card">
              <div style={styles.loyaltyContainer}>
                <div style={styles.loyaltyPoints}>
                  <div style={styles.pointsCircle}>
                    <span style={styles.pointsNumber}>{loyalty.balance || 0}</span>
                    <span style={styles.pointsLabel}>Points</span>
                  </div>
                </div>
                <div style={styles.loyaltyInfo}>
                  <h3>Your Loyalty Points</h3>
                  <p><strong>Total Earned:</strong> {loyalty.points_earned || 0} points</p>
                  <p><strong>Available Balance:</strong> {loyalty.balance || 0} points</p>
                  <p><strong>Redeemed:</strong> {loyalty.points_redeemed || 0} points</p>

                  <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                  }}>
                    <h4 style={{marginBottom: '0.5rem', color: '#818cf8'}}>Redeem Points for Packages</h4>
                    <p style={{fontSize: '0.875rem', color: '#cbd5e1', marginBottom: '1rem'}}>
                      Earn 10 points per KSH spent • Redeem at 70 points per KSH
                    </p>

                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#f1f5f9'}}>
                      Select Package:
                    </label>
                    <select
                      value={selectedRedeemTier}
                      onChange={(e) => setSelectedRedeemTier(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        marginBottom: '1rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        backgroundColor: '#334155',
                        color: '#f1f5f9'
                      }}
                    >
                      <option value="">Select a package</option>
                      {tiers.map(tier => {
                        const pointsRequired = tier.price * 70;
                        const canAfford = loyalty.balance >= pointsRequired;
                        return (
                          <option key={tier.id} value={tier.id}>
                            {tier.name} - {tier.price} KSH ({pointsRequired} points) {!canAfford ? 'Insufficient points' : 'Eligible'}
                          </option>
                        );
                      })}
                    </select>

                    {selectedRedeemTier && (
                      <div style={{
                        marginBottom: '1rem',
                        padding: '0.75rem',
                        backgroundColor: 'rgba(51, 65, 85, 0.5)',
                        borderRadius: '4px',
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                      }}>
                        {(() => {
                          const tier = tiers.find(t => t.id === parseInt(selectedRedeemTier));
                          if (!tier) return null;
                          const pointsRequired = tier.price * 70;
                          const canAfford = loyalty.balance >= pointsRequired;
                          return (
                            <>
                              <p style={{margin: '0.25rem 0', color: '#f1f5f9'}}><strong>Package:</strong> {tier.name}</p>
                              <p style={{margin: '0.25rem 0', color: '#f1f5f9'}}><strong>Price:</strong> {tier.price} KSH</p>
                              <p style={{margin: '0.25rem 0', color: '#f1f5f9'}}><strong>Points Required:</strong> {pointsRequired}</p>
                              <p style={{margin: '0.25rem 0', color: '#f1f5f9'}}><strong>Your Balance:</strong> {loyalty.balance}</p>
                              {canAfford ? (
                                <p style={{margin: '0.25rem 0', color: '#10b981'}}><strong>After Redemption:</strong> {loyalty.balance - pointsRequired} points</p>
                              ) : (
                                <p style={{margin: '0.25rem 0', color: '#ef4444'}}><strong>Need:</strong> {pointsRequired - loyalty.balance} more points</p>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}

                    <button
                      onClick={() => handleRedeemPoints(selectedRedeemTier)}
                      className="btn-primary"
                      disabled={!selectedRedeemTier || !loyalty.balance || loyalty.balance === 0}
                      style={{width: '100%'}}
                    >
                      Redeem Package
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback & Complaints Tab */}
        {activeTab === 'feedback' && (
          <div style={styles.tabContent}>
            <h2>Feedback & Complaints</h2>
            <FeedbackForm userId={user.id} notifications={notifications} subscriptionType="hotspot" />
          </div>
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
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    gap: '1rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
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
    color: '#fff',
  },
  heading: {
    fontSize: '2.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
  },
  subHeading: {
    fontSize: '1.125rem',
    color: '#94a3b8',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  tabContainer: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    borderBottom: '2px solid rgba(99, 102, 241, 0.2)',
    paddingBottom: '0.5rem',
  },
  tab: {
    padding: '0.75rem 1.5rem',
    background: 'transparent',
    border: 'none',
    color: '#cbd5e1',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    borderRadius: '0.5rem 0.5rem 0 0',
    transition: 'all 0.2s',
  },
  activeTab: {
    background: 'rgba(99, 102, 241, 0.1)',
    color: '#6366f1',
    borderBottom: '2px solid #6366f1',
  },
  tabContent: {
    marginTop: '2rem',
  },
  plansGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem',
  },
  planCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  planHeader: {
    borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
    paddingBottom: '1rem',
  },
  price: {
    marginTop: '0.5rem',
  },
  priceAmount: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#10b981',
  },
  priceDuration: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    marginLeft: '0.5rem',
  },
  planDetails: {
    flex: 1,
  },
  description: {
    marginTop: '0.5rem',
    color: '#94a3b8',
    fontSize: '0.875rem',
  },
  subscriptionHistory: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginTop: '1.5rem',
  },
  activeSubscriptionCard: {
    border: '2px solid #10b981',
    position: 'relative',
  },
  currentBadge: {
    position: 'absolute',
    top: '-12px',
    right: '20px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#fff',
    padding: '0.25rem 1rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)',
  },
  subscriptionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
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
    fontSize: '1.125rem',
    fontWeight: '600',
  },
  loyaltyContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '2rem',
    alignItems: 'center',
  },
  loyaltyPoints: {
    display: 'flex',
    justifyContent: 'center',
  },
  pointsCircle: {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #10b981 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
  },
  pointsNumber: {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#fff',
  },
  pointsLabel: {
    fontSize: '0.875rem',
    color: '#fff',
    opacity: 0.9,
  },
  loyaltyInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  gridSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem',
  },
};

export default UserDashboard;
