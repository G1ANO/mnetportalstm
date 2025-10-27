import { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';
import { FeedbackForm } from '../components/FeedbackForm';
import { ComplaintForm } from '../components/ComplaintForm';

export const HomePage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('plans');
  const [homeTiers, setHomeTiers] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loyalty, setLoyalty] = useState({ points_earned: 0, balance: 0, points_redeemed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch home internet tiers (monthly plans)
      const tiersRes = await axios.get('http://localhost:5000/tiers');
      // Filter for home internet plans (monthly plans with higher speeds)
      const homeInternetPlans = tiersRes.data.filter(tier =>
        tier.duration_days >= 720 || tier.name.toLowerCase().includes('home')
      );
      setHomeTiers(homeInternetPlans);

      // Fetch user subscription
      const subRes = await axios.get(`http://localhost:5000/subscriptions?user_id=${user.id}`);
      if (subRes.data && subRes.data.length > 0) {
        setSubscription(subRes.data[0]);
      }

      // Fetch loyalty points
      const loyaltyRes = await axios.get(`http://localhost:5000/loyalty?user_id=${user.id}`);
      if (loyaltyRes.data) {
        setLoyalty(loyaltyRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppRequest = () => {
    const message = encodeURIComponent(
      `Hello! I would like to request a Home Internet connection.\n\nName: ${user.username}\nEmail: ${user.email || user.userEmail}`
    );
    const whatsappUrl = `https://wa.me/254700000000?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleChangeSubscription = () => {
    setActiveTab('plans');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRedeemPoints = async () => {
    if (loyalty.balance === 0) {
      alert('You have no points to redeem!');
      return;
    }

    if (window.confirm(`Redeem ${loyalty.balance} points?`)) {
      try {
        await axios.post('http://localhost:5000/loyalty/redeem', {
          user_id: user.id,
          points: loyalty.balance
        });
        alert('Points redeemed successfully!');
        fetchData();
      } catch (error) {
        console.error('Error redeeming points:', error);
        alert('Failed to redeem points');
      }
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div className="container">
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <h1 style={styles.heading}>🏠 Home Internet</h1>
          <p style={styles.subHeading}>Reliable high-speed internet for your home</p>
        </div>

        {/* Tab Navigation */}
        <div style={styles.tabContainer}>
          <button
            onClick={() => setActiveTab('plans')}
            style={{...styles.tab, ...(activeTab === 'plans' ? styles.tabActive : {})}}
          >
            📶 Home Internet Plans
          </button>
          <button
            onClick={() => setActiveTab('myplan')}
            style={{...styles.tab, ...(activeTab === 'myplan' ? styles.tabActive : {})}}
          >
            📋 My Connection
          </button>
          <button
            onClick={() => setActiveTab('loyalty')}
            style={{...styles.tab, ...(activeTab === 'loyalty' ? styles.tabActive : {})}}
          >
            🎁 Loyalty Program
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            style={{...styles.tab, ...(activeTab === 'feedback' ? styles.tabActive : {})}}
          >
            💬 Feedback & Complaints
          </button>
        </div>

        {/* Tab Content */}
        <div style={styles.tabContent}>
          {/* HOME INTERNET PLANS TAB */}
          {activeTab === 'plans' && (
            <div>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Available Home Internet Plans</h2>
                <p style={styles.sectionDescription}>Choose the perfect plan for your home</p>
              </div>

              {loading ? (
                <div style={styles.loading}>Loading plans...</div>
              ) : homeTiers.length === 0 ? (
                <div className="card">
                  <p style={{textAlign: 'center', color: '#94a3b8'}}>
                    No home internet plans available yet. Check back soon!
                  </p>
                </div>
              ) : (
                <div style={styles.plansGrid}>
                  {homeTiers.map((tier) => (
                    <div key={tier.id} className="card" style={styles.planCard}>
                      <div style={styles.planHeader}>
                        <h3 style={styles.planName}>{tier.name}</h3>
                        <div style={styles.planPrice}>
                          <span style={styles.currency}>KSH</span>
                          <span style={styles.amount}>{tier.price}</span>
                          <span style={styles.period}>/month</span>
                        </div>
                      </div>
                      <div style={styles.planFeatures}>
                        <div style={styles.feature}>
                          <span style={styles.featureIcon}>⚡</span>
                          <span>Speed: {tier.speed_limit} Mbps</span>
                        </div>
                        <div style={styles.feature}>
                          <span style={styles.featureIcon}>📊</span>
                          <span>Data: {tier.data_limit >= 1000 ? `${tier.data_limit/1000} GB` : `${tier.data_limit} MB`}</span>
                        </div>
                        <div style={styles.feature}>
                          <span style={styles.featureIcon}>📝</span>
                          <span>{tier.description}</span>
                        </div>
                      </div>
                      <button
                        onClick={handleWhatsAppRequest}
                        className="btn-primary"
                        style={styles.whatsappBtn}
                      >
                        <svg style={styles.whatsappIcon} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        Request via WhatsApp
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MY CONNECTION TAB */}
          {activeTab === 'myplan' && (
            <div>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>My Home Internet Connection</h2>
                <p style={styles.sectionDescription}>View your current connection details</p>
              </div>

              {subscription ? (
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">📡 Active Connection</h3>
                  </div>
                  <div style={styles.connectionDetails}>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Plan Type:</span>
                      <span style={styles.detailValue}>{subscription.tier_name || 'N/A'}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Status:</span>
                      <span className={`badge ${subscription.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                        {subscription.status}
                      </span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Time In:</span>
                      <span style={styles.detailValue}>
                        {subscription.start_date ? new Date(subscription.start_date).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Time Expected Out:</span>
                      <span style={styles.detailValue}>
                        {subscription.end_date ? new Date(subscription.end_date).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleChangeSubscription}
                    className="btn-secondary"
                    style={{marginTop: '1.5rem', width: '100%'}}
                  >
                    🔄 Change Subscription
                  </button>
                </div>
              ) : (
                <div className="card">
                  <div style={{textAlign: 'center', padding: '2rem'}}>
                    <p style={{color: '#94a3b8', marginBottom: '1.5rem'}}>
                      You don't have an active home internet connection yet.
                    </p>
                    <button
                      onClick={handleWhatsAppRequest}
                      className="btn-primary"
                      style={styles.whatsappBtn}
                    >
                      <svg style={styles.whatsappIcon} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Request Connection via WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LOYALTY PROGRAM TAB */}
          {activeTab === 'loyalty' && (
            <div>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Loyalty Program</h2>
                <p style={styles.sectionDescription}>Earn points and get rewards</p>
              </div>

              <div className="card">
                <div style={styles.loyaltyContainer}>
                  <div style={styles.pointsCircle}>
                    <span style={styles.pointsNumber}>{loyalty.balance || 0}</span>
                    <span style={styles.pointsLabel}>Available Points</span>
                  </div>

                  <div style={styles.pointsBreakdown}>
                    <div style={styles.breakdownItem}>
                      <span style={styles.breakdownLabel}>Total Earned:</span>
                      <span style={styles.breakdownValue}>{loyalty.points_earned || 0}</span>
                    </div>
                    <div style={styles.breakdownItem}>
                      <span style={styles.breakdownLabel}>Available Balance:</span>
                      <span style={styles.breakdownValue}>{loyalty.balance || 0}</span>
                    </div>
                    <div style={styles.breakdownItem}>
                      <span style={styles.breakdownLabel}>Redeemed:</span>
                      <span style={styles.breakdownValue}>{loyalty.points_redeemed || 0}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleRedeemPoints}
                    className="btn-primary"
                    style={{marginTop: '2rem', width: '100%'}}
                    disabled={loyalty.balance === 0}
                  >
                    🎁 Redeem Points
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FEEDBACK & COMPLAINTS TAB */}
          {activeTab === 'feedback' && (
            <div>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Feedback & Complaints</h2>
                <p style={styles.sectionDescription}>We value your feedback</p>
              </div>

              <div style={styles.feedbackGrid}>
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">📝 Submit Feedback</h3>
                  </div>
                  <FeedbackForm userId={user.id} />
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">📢 File a Complaint</h3>
                  </div>
                  <ComplaintForm userId={user.id} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <p>&copy; 2025 Mnet Home Internet — Connecting Homes, Building Communities</p>
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
    textAlign: 'center',
    marginBottom: '3rem',
  },
  iconContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    marginBottom: '1.5rem',
    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
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
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subHeading: {
    fontSize: '1.25rem',
    color: '#94a3b8',
  },
  tabContainer: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    borderBottom: '2px solid #334155',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '0.75rem 1.5rem',
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    color: '#10b981',
    borderBottomColor: '#10b981',
  },
  tabContent: {
    minHeight: '400px',
  },
  sectionHeader: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: '0.5rem',
  },
  sectionDescription: {
    color: '#94a3b8',
    fontSize: '1rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#94a3b8',
    fontSize: '1.125rem',
  },
  plansGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  planCard: {
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
  },
  planHeader: {
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #334155',
  },
  planName: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: '1rem',
  },
  planPrice: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.25rem',
  },
  currency: {
    fontSize: '1rem',
    color: '#94a3b8',
  },
  amount: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#10b981',
  },
  period: {
    fontSize: '1rem',
    color: '#94a3b8',
  },
  planFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: '#cbd5e1',
  },
  featureIcon: {
    fontSize: '1.25rem',
  },
  whatsappBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    background: '#25D366',
    borderColor: '#25D366',
  },
  whatsappIcon: {
    width: '20px',
    height: '20px',
  },
  connectionDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: 'rgba(99, 102, 241, 0.05)',
    borderRadius: '0.5rem',
  },
  detailLabel: {
    color: '#94a3b8',
    fontSize: '1rem',
    fontWeight: '500',
  },
  detailValue: {
    color: '#f1f5f9',
    fontSize: '1rem',
    fontWeight: '600',
  },
  loyaltyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
  },
  pointsCircle: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2rem',
    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
  },
  pointsNumber: {
    fontSize: '3rem',
    fontWeight: '700',
    color: 'white',
  },
  pointsLabel: {
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: '0.5rem',
  },
  pointsBreakdown: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  breakdownItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    background: 'rgba(99, 102, 241, 0.05)',
    borderRadius: '0.5rem',
  },
  breakdownLabel: {
    color: '#94a3b8',
  },
  breakdownValue: {
    color: '#10b981',
    fontWeight: '600',
  },
  feedbackGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  footer: {
    marginTop: '3rem',
    paddingTop: '2rem',
    borderTop: '1px solid #334155',
    textAlign: 'center',
    color: '#64748b',
  },
};
