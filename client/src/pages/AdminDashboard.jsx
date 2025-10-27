import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../index.css"

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('tiers');
  const [tiers, setTiers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loyaltyRecords, setLoyaltyRecords] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tier form state
  const [showTierForm, setShowTierForm] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
  const [tierForm, setTierForm] = useState({
    name: '',
    price: '',
    duration_days: '',
    speed_limit: '',
    data_limit: '',
    description: '',
    tier_type: 'hotspot'
  });

  // Communication form state
  const [commForm, setCommForm] = useState({
    message: '',
    channel: 'email',
    recipients: 'all',
    specificUsers: []
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
        fetchLoyaltyRecords(),
        fetchFeedbacks(),
        fetchComplaints()
      ]);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTiers = async () => {
    try {
      // Fetch only hotspot tiers
      const res = await axios.get('http://localhost:5000/tiers?type=hotspot');
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
      setLoyaltyRecords(res.data);
    } catch(err) {
      console.error("Error fetching loyalty records:", err);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/feedbacks');
      setFeedbacks(res.data);
    } catch(err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/complaints?user_id=${user.id}`);
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  const handleCreateTier = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/tiers', {
        ...tierForm,
        tier_type: 'hotspot',
        admin_id: user.id
      });
      alert('Hotspot tier created successfully!');
      setShowTierForm(false);
      setTierForm({ name: '', price: '', duration_days: '', speed_limit: '', data_limit: '', description: '', tier_type: 'hotspot' });
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
        tier_type: 'hotspot',
        admin_id: user.id
      });
      alert('Hotspot tier updated successfully!');
      setEditingTier(null);
      setTierForm({ name: '', price: '', duration_days: '', speed_limit: '', data_limit: '', description: '', tier_type: 'hotspot' });
      fetchTiers();
    } catch (err) {
      alert('Error updating tier: ' + err.message);
    }
  };

  const deleteTier = async (tierId) => {
    if (!window.confirm("Are you sure you want to delete this hotspot tier?")) return;
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
      data_limit: tier.data_limit,
      description: tier.description,
      tier_type: 'hotspot'
    });
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

  const replyToFeedback = async (feedbackId) => {
    const response = prompt("Enter your response to this feedback:");
    if (!response) return;
    try {
      await axios.patch(`http://localhost:5000/feedbacks/${feedbackId}/reply`, {
        admin_response: response,
        admin_id: user.id
      });
      alert('Response sent successfully!');
      fetchFeedbacks();
    } catch (err) {
      alert('Error sending response: ' + err.message);
    }
  };

  const replyComplaint = async (id) => {
    const admin_response = prompt("Enter your response:");
    if (!admin_response) return;
    try {
      await axios.patch(`http://localhost:5000/complaints/${id}/reply`, {
        admin_response,
        admin_id: user.id,
      });
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to reply to complaint.");
    }
  };

  const handleSendCommunication = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/communications/send', {
        ...commForm,
        admin_id: user.id
      });
      alert('Message sent successfully!');
      setCommForm({ message: '', channel: 'email', recipients: 'all', specificUsers: [] });
    } catch (err) {
      alert('Error sending message: ' + err.message);
    }
  };

  if (!user) {
    return <p className="loading-text">Loading user data...</p>;
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div className="container">
        <h1 style={styles.title}>Admin Dashboard - Hotspot Management</h1>
        <p style={styles.subtitle}>Manage hotspot plans and subscriptions</p>

        {/* Tab Navigation */}
        <div style={styles.tabContainer}>
          <button
            onClick={() => setActiveTab('tiers')}
            style={{...styles.tab, ...(activeTab === 'tiers' ? styles.activeTab : {})}}
          >
            Hotspot Plans
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{...styles.tab, ...(activeTab === 'users' ? styles.activeTab : {})}}
          >
            Active Users
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
          <button
            onClick={() => setActiveTab('communication')}
            style={{...styles.tab, ...(activeTab === 'communication' ? styles.activeTab : {})}}
          >
            Communications
          </button>
        </div>

        {/* Hotspot Plans Tab */}
        {activeTab === 'tiers' && (
          <div style={styles.tabContent}>
            <div style={styles.sectionHeader}>
              <h2>Manage Hotspot Plans</h2>
              <button
                onClick={() => {
                  setShowTierForm(!showTierForm);
                  setEditingTier(null);
                  setTierForm({ name: '', price: '', duration_days: '', speed_limit: '', data_limit: '', description: '', tier_type: 'hotspot' });
                }}
                className="btn-primary"
              >
                {showTierForm ? 'Cancel' : '+ Add New Plan'}
              </button>
            </div>

            {(showTierForm || editingTier) && (
              <div className="card" style={styles.formCard}>
                <h3>{editingTier ? 'Edit Hotspot Plan' : 'Create New Hotspot Plan'}</h3>
                <form onSubmit={editingTier ? handleUpdateTier : handleCreateTier} style={styles.form}>
                  <div style={styles.formGrid}>
                    <div>
                      <label className="form-label">Tier Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={tierForm.name}
                        onChange={(e) => setTierForm({...tierForm, name: e.target.value})}
                        placeholder="e.g., 1 Hour Plan"
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
                        placeholder="e.g., 10"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Duration (hours) *</label>
                      <input
                        type="number"
                        className="form-input"
                        value={tierForm.duration_days}
                        onChange={(e) => setTierForm({...tierForm, duration_days: e.target.value})}
                        placeholder="e.g., 1"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label">Speed Limit (Mbps)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={tierForm.speed_limit}
                        onChange={(e) => setTierForm({...tierForm, speed_limit: e.target.value})}
                        placeholder="e.g., 50"
                      />
                    </div>
                    <div>
                      <label className="form-label">Data Limit (MB)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={tierForm.data_limit}
                        onChange={(e) => setTierForm({...tierForm, data_limit: e.target.value})}
                        placeholder="e.g., 1000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-input"
                      value={tierForm.description}
                      onChange={(e) => setTierForm({...tierForm, description: e.target.value})}
                      placeholder="Brief description of this plan"
                      rows="3"
                    />
                  </div>
                  <div style={styles.formActions}>
                    <button type="submit" className="btn-primary">
                      {editingTier ? 'Update Tier' : 'Create Tier'}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setShowTierForm(false);
                        setEditingTier(null);
                        setTierForm({ name: '', price: '', duration_days: '', speed_limit: '', data_limit: '', description: '' });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div style={styles.tableContainer}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Duration</th>
                    <th>Speed</th>
                    <th>Data Limit</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tiers.length === 0 ? (
                    <tr><td colSpan="7" style={{textAlign: 'center'}}>No tiers available</td></tr>
                  ) : (
                    tiers.map((tier) => (
                      <tr key={tier.id}>
                        <td>{tier.name}</td>
                        <td>KSH {tier.price}</td>
                        <td>{tier.duration_days} hrs</td>
                        <td>{tier.speed_limit || 'N/A'} Mbps</td>
                        <td>{tier.data_limit || 'Unlimited'} MB</td>
                        <td>{tier.description || 'N/A'}</td>
                        <td>
                          <button onClick={() => startEditTier(tier)} className="btn-sm btn-secondary" style={{marginRight: '0.5rem'}}>
                            Edit
                          </button>
                          <button onClick={() => deleteTier(tier.id)} className="btn-sm btn-danger">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Active Users Tab */}
        {activeTab === 'users' && (
          <div style={styles.tabContent}>
            <h2>Active Users</h2>
            <div style={styles.tableContainer}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Device ID</th>
                    <th>Subscription</th>
                    <th>Activated</th>
                    <th>Activity</th>
                    <th>Usage (MB)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan="10" style={{textAlign: 'center'}}>No users found</td></tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.name || 'N/A'}</td>
                        <td>{u.email}</td>
                        <td>{u.phone_number || 'N/A'}</td>
                        <td>{u.device_id || 'N/A'}</td>
                        <td>{u.subscription_tier || 'None'}</td>
                        <td>{u.activated_at ? new Date(u.activated_at).toLocaleString() : 'N/A'}</td>
                        <td>
                          <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                            {u.status === 'active' ? 'Online' : 'Offline'}
                          </span>
                        </td>
                        <td>{u.usage_mb || 0} MB</td>
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Loyalty Program Tab */}
        {activeTab === 'loyalty' && (
          <div style={styles.tabContent}>
            <h2>Loyalty Program Records</h2>
            <div style={styles.tableContainer}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Device ID</th>
                    <th>Points Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {loyaltyRecords.length === 0 ? (
                    <tr><td colSpan="6" style={{textAlign: 'center'}}>No loyalty records found</td></tr>
                  ) : (
                    loyaltyRecords.map((record) => (
                      <tr key={record.user_id}>
                        <td>{record.user_id}</td>
                        <td>{record.user_name || 'N/A'}</td>
                        <td>{record.user_email || 'N/A'}</td>
                        <td>{record.phone_number || 'N/A'}</td>
                        <td>{record.device_id || 'N/A'}</td>
                        <td><strong>{record.points_earned || 0}</strong> points</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Feedback & Complaints Tab */}
        {activeTab === 'feedback' && (
          <div style={styles.tabContent}>
            <h2>Feedback & Complaints</h2>

            {/* Ratings Section */}
            <div className="card" style={{marginBottom: '2rem'}}>
              <h3>Service Ratings</h3>
              <div style={styles.tableContainer}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Tier</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.length === 0 ? (
                      <tr><td colSpan="6" style={{textAlign: 'center'}}>No feedback yet</td></tr>
                    ) : (
                      feedbacks.map((f) => (
                        <tr key={f.id}>
                          <td>{f.user_id}</td>
                          <td>{f.tier_id}</td>
                          <td>
                            <span style={{color: '#f59e0b'}}>
                              {'⭐'.repeat(f.rating)}
                            </span>
                          </td>
                          <td>{f.comment || 'No comment'}</td>
                          <td>{f.created_at ? new Date(f.created_at).toLocaleDateString() : 'N/A'}</td>
                          <td>
                            <button onClick={() => replyToFeedback(f.id)} className="btn-sm btn-primary">
                              Reply
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Complaints Section */}
            <div className="card">
              <h3>User Complaints</h3>
              <div style={styles.tableContainer}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Description</th>
                      <th>User ID</th>
                      <th>Status</th>
                      <th>Response</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.length === 0 ? (
                      <tr><td colSpan="6" style={{textAlign: 'center'}}>No complaints</td></tr>
                    ) : (
                      complaints.map((c) => (
                        <tr key={c.id}>
                          <td>{c.subject}</td>
                          <td>{c.description}</td>
                          <td>{c.user_id}</td>
                          <td>
                            <span className={`badge ${c.status === 'resolved' ? 'badge-success' : 'badge-warning'}`}>
                              {c.status}
                            </span>
                          </td>
                          <td>{c.admin_response || 'No response yet'}</td>
                          <td>
                            <button onClick={() => replyComplaint(c.id)} className="btn-sm btn-primary">
                              Reply
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Communication Tab */}
        {activeTab === 'communication' && (
          <div style={styles.tabContent}>
            <h2>General Communications</h2>
            <div className="card">
              <h3>Send Mass Communication</h3>
              <form onSubmit={handleSendCommunication} style={styles.form}>
                <div>
                  <label className="form-label">Message *</label>
                  <textarea
                    className="form-input"
                    value={commForm.message}
                    onChange={(e) => setCommForm({...commForm, message: e.target.value})}
                    placeholder="Type your message here..."
                    rows="6"
                    required
                  />
                </div>
                <div style={styles.formGrid}>
                  <div>
                    <label className="form-label">Channel *</label>
                    <select
                      className="form-input"
                      value={commForm.channel}
                      onChange={(e) => setCommForm({...commForm, channel: e.target.value})}
                    >
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="both">Both (Email & SMS)</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Recipients *</label>
                    <select
                      className="form-input"
                      value={commForm.recipients}
                      onChange={(e) => setCommForm({...commForm, recipients: e.target.value})}
                    >
                      <option value="all">All Users</option>
                      <option value="active">Active Users Only</option>
                      <option value="specific">Specific Users</option>
                    </select>
                  </div>
                </div>
                {commForm.recipients === 'specific' && (
                  <div>
                    <label className="form-label">User IDs (comma-separated)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., 1, 5, 12, 23"
                      onChange={(e) => setCommForm({...commForm, specificUsers: e.target.value.split(',').map(id => id.trim())})}
                    />
                  </div>
                )}
                <button type="submit" className="btn-primary">
                  📧 Send Message
                </button>
              </form>
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
    marginTop: '2rem',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  formCard: {
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
  },
  tableContainer: {
    overflowX: 'auto',
  },
};

export default AdminDashboard;
