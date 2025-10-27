import { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';
import FeedbackForm from '../components/FeedbackForm';
import ComplaintForm from '../components/ComplaintForm';

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
      // Fetch home internet tiers only
      const tiersRes = await axios.get('http://localhost:5000/tiers?type=home_internet');
      setHomeTiers(tiersRes.data);

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

  // Styles object
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
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '0.5rem',
    },
    subHeading: {
      fontSize: '1.125rem',
      color: '#94a3b8',
    },
    tabContainer: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
      flexWrap: 'wrap',
    },
    tab: {
      padding: '1rem 1.5rem',
      background: 'transparent',
      border: 'none',
      color: '#94a3b8',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      borderBottom: '2px solid transparent',
      marginBottom: '-2px',
      transition: 'all 0.3s ease',
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
      fontSize: '1.875rem',
      fontWeight: '700',
      color: '#f1f5f9',
      marginBottom: '0.5rem',
    },
    sectionDescription: {
      fontSize: '1rem',
      color: '#94a3b8',
    },
    loading: {
      textAlign: 'center',
      padding: '3rem',
      color: '#94a3b8',
      fontSize: '1.125rem',
    },
    plansGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
    },
    planCard: {
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    planHeader: {
      marginBottom: '1.5rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
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
    planBody: {
      padding: '1.5rem',
    },
    planFeatures: {
      marginTop: '1rem',
    },
    planFeature: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    feature: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 0',
      color: '#cbd5e1',
    },
    featureIcon: {
      width: '20px',
      height: '20px',
      color: '#10b981',
    },
    featureText: {
      color: '#cbd5e1',
      fontSize: '0.95rem',
    },
    period: {
      fontSize: '1rem',
      fontWeight: '400',
      color: 'rgba(255, 255, 255, 0.8)',
    },
    whatsappBtn: {
      width: '100%',
      marginTop: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
      padding: '0.875rem 1.5rem',
      fontSize: '1rem',
      fontWeight: '600',
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
    subscriptionCard: {
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
      border: '2px solid #10b981',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '0.5rem 1rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: '600',
      marginBottom: '1rem',
    },
    statusActive: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#fff',
    },
    statusInactive: {
      background: 'rgba(239, 68, 68, 0.2)',
      color: '#ef4444',
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginTop: '1.5rem',
    },
    detailItem: {
      padding: '1rem',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
    },
    detailRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '0.5rem',
    },
    detailLabel: {
      fontSize: '0.875rem',
      color: '#94a3b8',
      marginBottom: '0.5rem',
    },
    detailValue: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#f1f5f9',
    },
    changeBtn: {
      marginTop: '1.5rem',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    loyaltyContainer: {
      textAlign: 'center',
      padding: '2rem',
    },
    pointsCircle: {
      width: '200px',
      height: '200px',
      margin: '0 auto 2rem',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
    },
    pointsNumber: {
      fontSize: '3rem',
      fontWeight: '800',
      color: '#fff',
    },
    pointsLabel: {
      fontSize: '0.875rem',
      color: 'rgba(255, 255, 255, 0.9)',
      marginTop: '0.5rem',
    },
    pointsBreakdown: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
    },
    breakdownItem: {
      padding: '1rem',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
    },
    breakdownLabel: {
      display: 'block',
      fontSize: '0.875rem',
      color: '#94a3b8',
      marginBottom: '0.5rem',
    },
    breakdownValue: {
      display: 'block',
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#10b981',
    },
    redeemBtn: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      padding: '0.875rem 2rem',
      fontSize: '1rem',
      fontWeight: '600',
      border: 'none',
      borderRadius: '8px',
      color: '#fff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    feedbackGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
    },
    footer: {
      marginTop: '4rem',
      paddingTop: '2rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center',
      color: '#94a3b8',
      fontSize: '0.875rem',
    },
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
          <h1 style={styles.heading}>Home Internet</h1>
          <p style={styles.subHeading}>Reliable high-speed internet for your home</p>
        </div>

        {/* Tab Navigation */}
        <div style={styles.tabContainer}>
          <button
            onClick={() => setActiveTab('plans')}
            style={{...styles.tab, ...(activeTab === 'plans' ? styles.tabActive : {})}}
          >
            Home Internet Plans
          </button>
          <button
            onClick={() => setActiveTab('myplan')}
            style={{...styles.tab, ...(activeTab === 'myplan' ? styles.tabActive : {})}}
          >
            My Connection
          </button>
          <button
            onClick={() => setActiveTab('loyalty')}
            style={{...styles.tab, ...(activeTab === 'loyalty' ? styles.tabActive : {})}}
          >
            Loyalty Program
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            style={{...styles.tab, ...(activeTab === 'feedback' ? styles.tabActive : {})}}
          >
            Feedback & Complaints
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
                          <span>Speed: {tier.speed_limit} Mbps</span>
                        </div>
                        <div style={styles.feature}>
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
                    Redeem Points
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
                  <FeedbackForm userId={user.id} tiers={homeTiers} />
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">File a Complaint</h3>
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
