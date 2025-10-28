import { useState, useEffect } from "react";
import axios from "axios";
import FeedbackForm from "../components/FeedbackForm";
import ComplaintForm from "../components/ComplaintForm";
import "../index.css";

const UserDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('plans');
  const [subscription, setSubscription] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [loyalty, setLoyalty] = useState({ points_earned: 0, balance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchSubscription(),
        fetchTiers(),
        fetchLoyalty()
      ]);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      // Only fetch hotspot subscriptions
      const res = await axios.get(`http://localhost:5000/subscriptions?user_id=${user.id}&type=hotspot`);
      if (res.data.length > 0) setSubscription(res.data[0]);
    } catch (err) {
      console.error("Error fetching subscription:", err);
    }
  };

  const fetchTiers = async () => {
    try {
      // Fetch only hotspot tiers
      const res = await axios.get("http://localhost:5000/tiers?type=hotspot");
      setTiers(res.data);
    } catch (err) {
      console.error("Error fetching tiers:", err);
    }
  };

  const fetchLoyalty = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/loyalty?user_id=${user.id}`);
      setLoyalty(res.data);
    } catch (err) {
      console.error("Error fetching loyalty:", err);
    }
  };

  const handleSubscribe = async (tierId) => {
    if (!window.confirm("Subscribe to this plan?")) return;
    try {
      await axios.post('http://localhost:5000/subscriptions', {
        user_id: user.id,
        tier_id: tierId
      });
      alert('Subscription successful!');
      fetchSubscription();
    } catch (err) {
      alert('Error subscribing: ' + err.message);
    }
  };

  const handleRedeemPoints = async () => {
    if (!window.confirm(`Redeem ${loyalty.balance} points?`)) return;
    try {
      await axios.post('http://localhost:5000/loyalty/redeem', {
        user_id: user.id,
        points: loyalty.balance
      });
      alert('Points redeemed successfully!');
      fetchLoyalty();
    } catch (err) {
      alert('Error redeeming points: ' + err.message);
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
        <h1 style={styles.title}>Mnet Hotspot</h1>

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
            <h2>My Subscription Details</h2>
            {subscription ? (
              <div className="card">
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
                    <span style={styles.statLabel}>Time In</span>
                    <span style={styles.statValue}>
                      {subscription.start_date ? new Date(subscription.start_date).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Time Expected Out</span>
                    <span style={styles.statValue}>
                      {subscription.end_date ? new Date(subscription.end_date).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="alert alert-info">
                <p>You currently have no active subscription.</p>
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
                  <button
                    onClick={handleRedeemPoints}
                    className="btn-primary"
                    disabled={!loyalty.balance || loyalty.balance === 0}
                    style={{marginTop: '1rem'}}
                  >
                    Redeem Points
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback & Complaints Tab */}
        {activeTab === 'feedback' && (
          <div style={styles.tabContent}>
            <h2>Feedback & Complaints</h2>
            <div className="grid grid-cols-2" style={styles.gridSection}>
              <div className="card">
                <h3>Submit Feedback</h3>
                <FeedbackForm userId={user.id} tiers={tiers} />
              </div>
              <div className="card">
                <h3>File a Complaint</h3>
                <ComplaintForm userId={user.id} />
              </div>
            </div>
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
