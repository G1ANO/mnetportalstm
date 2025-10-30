import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../../index.css"

const HomeInternetPanel = ({ user }) => {
  const [activeTab, setActiveTab] = useState('tiers');
  const [tiers, setTiers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loyaltyRecords, setLoyaltyRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tier form state
  const [showTierForm, setShowTierForm] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
  const [tierForm, setTierForm] = useState({
    name: '',
    price: '',
    duration_days: '',
    speed_limit: '',
    description: '',
    tier_type: 'home_internet'
  });

  useEffect(() => {
    if (user && user.id) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchTiers(),
        fetchUsers(),
        fetchLoyaltyRecords()
      ]);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTiers = async () => {
    try {
      // Fetch only home_internet tiers
      const res = await axios.get('http://localhost:5000/tiers?type=home_internet');
      setTiers(res.data);
    } catch(err) {
      console.error("Error fetching tiers:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/users');
      setUsers(res.data);
    } catch(err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchLoyaltyRecords = async () => {
    try {
      const res = await axios.get('http://localhost:5000/loyalty/all');
      // Fetch user details for each loyalty record
      const recordsWithUsers = await Promise.all(
        res.data.map(async (record) => {
          try {
            const userRes = await axios.get(`http://localhost:5000/users/${record.user_id}`);
            return {
              ...record,
              user: userRes.data
            };
          } catch (err) {
            return {
              ...record,
              user: { name: 'Unknown', email: 'N/A', phone: 'N/A' }
            };
          }
        })
      );
      setLoyaltyRecords(recordsWithUsers);
    } catch(err) {
      console.error("Error fetching loyalty records:", err);
    }
  };

  const disconnectUser = async (userId) => {
    if (!window.confirm("Disconnect this user from the network?")) return;
    try {
      await axios.post(`http://localhost:5000/users/${userId}/disconnect`, {
        admin_id: user.id
      });
      alert('User disconnected successfully!');
      fetchUsers();
    } catch (err) {
      alert('Error disconnecting user: ' + err.message);
    }
  };



  const handleCreateTier = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/tiers', {
        ...tierForm,
        tier_type: 'home_internet',
        admin_id: user.id
      });
      alert('Home Internet tier created successfully!');
      setShowTierForm(false);
      setTierForm({ name: '', price: '', duration_days: '', speed_limit: '', description: '', tier_type: 'home_internet' });
      fetchTiers();
    } catch (err) {
      alert('Error creating tier: ' + err.message);
    }
  };

  const handleUpdateTier = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/tiers/${editingTier.id}`, {
        ...tierForm,
        tier_type: 'home_internet',
        admin_id: user.id
      });
      alert('Home Internet tier updated successfully!');
      setEditingTier(null);
      setTierForm({ name: '', price: '', duration_days: '', speed_limit: '', description: '', tier_type: 'home_internet' });
      fetchTiers();
    } catch (err) {
      alert('Error updating tier: ' + err.message);
    }
  };

  const deleteTier = async (tierId) => {
    if (!window.confirm("Are you sure you want to delete this home internet tier?")) return;
    try {
      await axios.delete(`http://localhost:5000/tiers/${tierId}`, {
        data: { admin_id: user.id },
      });
      fetchTiers();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete tier.");
    }
  };

  const startEditTier = (tier) => {
    setEditingTier(tier);
    setTierForm({
      name: tier.name,
      price: tier.price,
      duration_days: tier.duration_days,
      speed_limit: tier.speed_limit,
      description: tier.description,
      tier_type: 'home_internet'
    });
    setShowTierForm(false);
  };



  if (!user) {
    return <p className="loading-text">Loading user data...</p>;
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="spinner"></div>
        <p>Loading home internet panel data...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div className="container">
        <h1 style={styles.title}>Home Internet Panel</h1>
        <p style={styles.subtitle}>Manage home internet plans and subscriptions</p>

        {/* Tab Navigation */}
        <div style={styles.tabContainer}>
          <button
            onClick={() => setActiveTab('tiers')}
            style={{...styles.tab, ...(activeTab === 'tiers' ? styles.activeTab : {})}}
          >
            Home Internet Plans
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{...styles.tab, ...(activeTab === 'users' ? styles.activeTab : {})}}
          >
            Subscribers
          </button>
          <button
            onClick={() => setActiveTab('loyalty')}
            style={{...styles.tab, ...(activeTab === 'loyalty' ? styles.activeTab : {})}}
          >
            Loyalty Program
          </button>
        </div>

        {/* Home Internet Plans Tab */}
        {activeTab === 'tiers' && (
          <div style={styles.tabContent}>
            <div style={styles.sectionHeader}>
              <h2>Manage Home Internet Plans</h2>
              <button
                onClick={() => {
                  setShowTierForm(!showTierForm);
                  setEditingTier(null);
                  setTierForm({ name: '', price: '', duration_days: '', speed_limit: '', description: '', tier_type: 'home_internet' });
                }}
                className="btn-primary"
              >
                {showTierForm ? 'Cancel' : '+ Add New Plan'}
              </button>
            </div>

            {(showTierForm || editingTier) && (
              <div className="card" style={styles.formCard}>
                <h3>{editingTier ? 'Edit Home Internet Plan' : 'Create New Home Internet Plan'}</h3>
                <form onSubmit={editingTier ? handleUpdateTier : handleCreateTier} style={styles.form}>
                  <div style={styles.formGrid}>
                    <div>
                      <label className="form-label">Plan Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={tierForm.name}
                        onChange={(e) => setTierForm({...tierForm, name: e.target.value})}
                        placeholder="e.g., Home Internet 10 Mbps"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Price (KSH) *</label>
                      <input
                        type="number"
                        className="form-input"
                        value={tierForm.price}
                        onChange={(e) => setTierForm({...tierForm, price: e.target.value})}
                        placeholder="e.g., 1000"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Duration (Days) *</label>
                      <input
                        type="number"
                        className="form-input"
                        value={tierForm.duration_days}
                        onChange={(e) => setTierForm({...tierForm, duration_days: e.target.value})}
                        placeholder="e.g., 30 (monthly)"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Speed (Mbps) *</label>
                      <input
                        type="number"
                        className="form-input"
                        value={tierForm.speed_limit}
                        onChange={(e) => setTierForm({...tierForm, speed_limit: e.target.value})}
                        placeholder="e.g., 10"
                        required
                      />
                    </div>
                  </div>
                  <div style={{marginTop: '1rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px'}}>
                    <p style={{margin: 0, color: '#10b981', fontSize: '0.9rem'}}>
                      ℹ️ <strong>Unlimited Data:</strong> Home Internet plans come with unlimited data by default.
                    </p>
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-input"
                      value={tierForm.description}
                      onChange={(e) => setTierForm({...tierForm, description: e.target.value})}
                      placeholder="Describe this home internet plan..."
                      rows="3"
                    />
                  </div>
                  <div style={styles.formActions}>
                    <button type="submit" className="btn-primary">
                      {editingTier ? 'Update Plan' : 'Create Plan'}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setShowTierForm(false);
                        setEditingTier(null);
                        setTierForm({ name: '', price: '', duration_days: '', speed_limit: '', description: '', tier_type: 'home_internet' });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tiers Table */}
            <div className="card" style={{marginTop: '1.5rem'}}>
              {tiers.length === 0 ? (
                <p style={styles.emptyState}>No home internet plans yet. Create one to get started!</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Plan Name</th>
                      <th>Price (KSH)</th>
                      <th>Duration (Days)</th>
                      <th>Speed (Mbps)</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiers.map(tier => (
                      <tr key={tier.id}>
                        <td>{tier.id}</td>
                        <td><strong>{tier.name}</strong></td>
                        <td>{tier.price}</td>
                        <td>{tier.duration_days}</td>
                        <td><span style={{color: '#10b981', fontWeight: '600'}}>{tier.speed_limit} Mbps</span></td>
                        <td>{tier.description || '-'}</td>
                        <td>
                          <div style={{display: 'flex', gap: '0.5rem'}}>
                            <button
                              onClick={() => startEditTier(tier)}
                              className="btn-secondary"
                              style={{padding: '0.25rem 0.75rem', fontSize: '0.875rem'}}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteTier(tier.id)}
                              className="btn-danger"
                              style={{padding: '0.25rem 0.75rem', fontSize: '0.875rem'}}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div style={styles.tabContent}>
            <h2>Home Internet Subscribers</h2>
            <div className="card" style={{marginTop: '1rem'}}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                          {u.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => disconnectUser(u.id)}
                          className="btn-sm btn-danger"
                          disabled={u.status !== 'active'}
                        >
                          Disconnect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Loyalty Tab */}
        {activeTab === 'loyalty' && (
          <div style={styles.tabContent}>
            <h2>Loyalty Program Overview</h2>
            <div className="card" style={{marginTop: '1rem'}}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Points Earned</th>
                    <th>Points Redeemed</th>
                    <th>Balance Points</th>
                  </tr>
                </thead>
                <tbody>
                  {loyaltyRecords.map(record => (
                    <tr key={record.id}>
                      <td>{record.user_id}</td>
                      <td>{record.user?.name || 'N/A'}</td>
                      <td>{record.user?.email || 'N/A'}</td>
                      <td>{record.user?.phone || 'N/A'}</td>
                      <td>{record.points_earned}</td>
                      <td>{record.points_redeemed}</td>
                      <td><strong style={{color: '#10b981'}}>{record.balance}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    padding: '2rem 0',
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
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#94a3b8',
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
    animation: 'fadeIn 0.3s ease-in',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  formCard: {
    marginBottom: '2rem',
  },
  form: {
    marginTop: '1rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem',
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  tiersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem',
  },
  tierCard: {
    position: 'relative',
  },
  tierHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '1rem',
  },
  tierName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#f1f5f9',
    margin: 0,
  },
  tierBadge: {
    background: '#10b981',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  tierPrice: {
    marginBottom: '1rem',
  },
  currency: {
    fontSize: '1rem',
    color: '#94a3b8',
    marginRight: '0.25rem',
  },
  amount: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#10b981',
  },
  period: {
    fontSize: '1rem',
    color: '#94a3b8',
    marginLeft: '0.25rem',
  },
  tierDescription: {
    color: '#cbd5e1',
    marginBottom: '1rem',
    lineHeight: '1.5',
  },
  tierDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem',
    padding: '1rem',
    background: 'rgba(16, 185, 129, 0.1)',
    borderRadius: '0.5rem',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  detailLabel: {
    color: '#94a3b8',
    fontSize: '0.875rem',
  },
  detailValue: {
    color: '#f1f5f9',
    fontWeight: '600',
    fontSize: '0.875rem',
  },
  tierActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  emptyState: {
    textAlign: 'center',
    color: '#94a3b8',
    padding: '3rem',
    fontSize: '1.1rem',
  },
  rating: {
    fontSize: '1rem',
  },
};

export default HomeInternetPanel;

