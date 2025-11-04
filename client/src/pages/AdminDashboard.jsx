import React, { useState, useEffect } from "react";
import api from '../api';
import "../index.css"

// GMT+3 datetime formatter
const formatToGMT3 = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-KE', {
    timeZone: 'Africa/Nairobi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }) + ' EAT';
};

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('tiers');
  const [tiers, setTiers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loyaltyRecords, setLoyaltyRecords] = useState([]);
  const [hotspotFeedbacks, setHotspotFeedbacks] = useState([]);
  const [homeInternetFeedbacks, setHomeInternetFeedbacks] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackSubTab, setFeedbackSubTab] = useState('hotspot'); // 'hotspot' or 'home_internet'
  const [tierAnalytics, setTierAnalytics] = useState([]);

  // Tier form state
  const [showTierForm, setShowTierForm] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
  const [tierForm, setTierForm] = useState({
    name: '',
    price: '',
    duration_days: '',
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
        fetchHotspotFeedbacks(),
        fetchHomeInternetFeedbacks(),
        fetchComplaints(),
        fetchTierAnalytics()
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
      const res = await api.get('/tiers?type=hotspot');
      setTiers(res.data);
    } catch(err) {
      console.error("Error fetching tiers:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch(err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchLoyaltyRecords = async () => {
    try {
      const res = await api.get('/loyalty/all');
      setLoyaltyRecords(res.data);
    } catch(err) {
      console.error("Error fetching loyalty records:", err);
    }
  };

  const fetchHotspotFeedbacks = async () => {
    try {
      const res = await api.get(`/feedbacks?user_id=${user.id}&subscription_type=hotspot`);
      setHotspotFeedbacks(res.data);
    } catch(err) {
      console.error("Error fetching hotspot feedbacks:", err);
    }
  };

  const fetchHomeInternetFeedbacks = async () => {
    try {
      const res = await api.get(`/feedbacks?user_id=${user.id}&subscription_type=home_internet`);
      setHomeInternetFeedbacks(res.data);
    } catch(err) {
      console.error("Error fetching home internet feedbacks:", err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await api.get(`/complaints?user_id=${user.id}`);
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  const fetchTierAnalytics = async () => {
    try {
      const res = await api.get('/analytics/tier-subscriptions?type=hotspot');
      setTierAnalytics(res.data);
    } catch(err) {
      console.error("Error fetching tier analytics:", err);
    }
  };

  const handleCreateTier = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tiers', {
        ...tierForm,
        speed_limit: 0,
        data_limit: 0,
        tier_type: 'hotspot',
        admin_id: user.id
      });
      alert('Hotspot tier created successfully!');
      setShowTierForm(false);
      setTierForm({ name: '', price: '', duration_days: '', description: '', tier_type: 'hotspot' });
      fetchTiers();
    } catch (err) {
      alert('Error creating tier: ' + err.message);
    }
  };

  const handleUpdateTier = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/tiers/${editingTier.id}`, {
        ...tierForm,
        speed_limit: 0,
        data_limit: 0,
        tier_type: 'hotspot',
        admin_id: user.id
      });
      alert('Hotspot tier updated successfully!');
      setEditingTier(null);
      setTierForm({ name: '', price: '', duration_days: '', description: '', tier_type: 'hotspot' });
      fetchTiers();
    } catch (err) {
      alert('Error updating tier: ' + err.message);
    }
  };

  const deleteTier = async (tierId) => {
    if (!window.confirm("Are you sure you want to delete this hotspot tier?")) return;
    try {
      await api.delete(`/tiers/${tierId}`, {
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
      description: tier.description,
      tier_type: 'hotspot'
    });
  };

  const disconnectUser = async (userId) => {
    if (!window.confirm("Disconnect this user from the network?")) return;
    try {
      await api.post(`/users/${userId}/disconnect`, {
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
      await api.patch(`/feedbacks/${feedbackId}/reply`, {
        admin_response: response,
        admin_id: user.id
      });
      alert('Response sent successfully!');
      // Refresh both feedback lists
      fetchHotspotFeedbacks();
      fetchHomeInternetFeedbacks();
    } catch (err) {
      alert('Error sending response: ' + err.message);
    }
  };

  const replyComplaint = async (id) => {
    const admin_response = prompt("Enter your response:");
    if (!admin_response) return;
    try {
      await api.patch(`/complaints/${id}/reply`, {
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
      await api.post('/communications/send', {
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
          <button
            onClick={() => setActiveTab('analytics')}
            style={{...styles.tab, ...(activeTab === 'analytics' ? styles.activeTab : {})}}
          >
            Analytics
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
                  setTierForm({ name: '', price: '', duration_days: '', description: '', tier_type: 'hotspot' });
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
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tiers.length === 0 ? (
                    <tr><td colSpan="5" style={{textAlign: 'center'}}>No tiers available</td></tr>
                  ) : (
                    tiers.map((tier) => (
                      <tr key={tier.id}>
                        <td>{tier.name}</td>
                        <td>KSH {tier.price}</td>
                        <td>{tier.duration_days} hrs</td>
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
                  {loyaltyRecords.length === 0 ? (
                    <tr><td colSpan="7" style={{textAlign: 'center'}}>No loyalty records found</td></tr>
                  ) : (
                    loyaltyRecords.map((record) => (
                      <tr key={record.id}>
                        <td>{record.user_id}</td>
                        <td>{record.user_name || 'N/A'}</td>
                        <td>{record.user_email || 'N/A'}</td>
                        <td>{record.phone_number || 'N/A'}</td>
                        <td>{record.points_earned || 0}</td>
                        <td>{record.points_redeemed || 0}</td>
                        <td><strong style={{color: '#10b981'}}>{record.balance || 0}</strong></td>
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

            {/* Sub-tabs for Hotspot and Home Internet */}
            <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid #334155'}}>
              <button
                onClick={() => setFeedbackSubTab('hotspot')}
                style={{
                  ...styles.subTab,
                  ...(feedbackSubTab === 'hotspot' ? styles.activeSubTab : {})
                }}
              >
                Hotspot Feedback
              </button>
              <button
                onClick={() => setFeedbackSubTab('home_internet')}
                style={{
                  ...styles.subTab,
                  ...(feedbackSubTab === 'home_internet' ? styles.activeSubTab : {})
                }}
              >
                Home Internet Feedback
              </button>
            </div>

            {/* Hotspot Feedback Section */}
            {feedbackSubTab === 'hotspot' && (
              <div className="card" style={{marginBottom: '2rem'}}>
                <h3>Hotspot User Feedback & Complaints</h3>
                <div style={styles.tableContainer}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Type</th>
                        <th>Subject</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Status</th>
                        <th>Admin Response</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotspotFeedbacks.length === 0 ? (
                        <tr><td colSpan="9" style={{textAlign: 'center'}}>No hotspot feedback or complaints yet</td></tr>
                      ) : (
                        hotspotFeedbacks.map((f) => (
                          <tr key={f.id}>
                            <td>{f.user_id}</td>
                            <td>
                              <span className={`badge ${f.type === 'feedback' ? 'badge-info' : 'badge-warning'}`}>
                                {f.type}
                              </span>
                            </td>
                            <td>{f.subject || '-'}</td>
                            <td>
                              {f.type === 'complaint' ? '-' : (f.rating ? (
                                <span style={{color: '#f59e0b'}}>
                                  {'⭐'.repeat(f.rating)}
                                </span>
                              ) : '-')}
                            </td>
                            <td>{f.comment || 'No comment'}</td>
                            <td>
                              <span className={`badge ${f.status === 'resolved' ? 'badge-success' : 'badge-warning'}`}>
                                {f.status}
                              </span>
                            </td>
                            <td>{f.admin_response || 'No response yet'}</td>
                            <td>{formatToGMT3(f.created_at)}</td>
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
            )}

            {/* Home Internet Feedback Section */}
            {feedbackSubTab === 'home_internet' && (
              <div className="card" style={{marginBottom: '2rem'}}>
                <h3>Home Internet User Feedback & Complaints</h3>
                <div style={styles.tableContainer}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Type</th>
                        <th>Subject</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Status</th>
                        <th>Admin Response</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {homeInternetFeedbacks.length === 0 ? (
                        <tr><td colSpan="9" style={{textAlign: 'center'}}>No home internet feedback or complaints yet</td></tr>
                      ) : (
                        homeInternetFeedbacks.map((f) => (
                          <tr key={f.id}>
                            <td>{f.user_id}</td>
                            <td>
                              <span className={`badge ${f.type === 'feedback' ? 'badge-info' : 'badge-warning'}`}>
                                {f.type}
                              </span>
                            </td>
                            <td>{f.subject || '-'}</td>
                            <td>
                              {f.type === 'complaint' ? '-' : (f.rating ? (
                                <span style={{color: '#f59e0b'}}>
                                  {'⭐'.repeat(f.rating)}
                                </span>
                              ) : '-')}
                            </td>
                            <td>{f.comment || 'No comment'}</td>
                            <td>
                              <span className={`badge ${f.status === 'resolved' ? 'badge-success' : 'badge-warning'}`}>
                                {f.status}
                              </span>
                            </td>
                            <td>{f.admin_response || 'No response yet'}</td>
                            <td>{formatToGMT3(f.created_at)}</td>
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
            )}

            {/* Legacy Complaints Section (if any exist in old Complaint table) */}
            {complaints.length > 0 && (
              <div className="card">
                <h3>Legacy Complaints (Old System)</h3>
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
                      {complaints.map((c) => (
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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
                      <option value="notification">In-App Notification</option>
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="both">Email & SMS</option>
                      <option value="all">All Channels (Notification + Email + SMS)</option>
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
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div style={styles.tabContent}>
            <h2>Hotspot Tier Analytics</h2>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>View subscription trends across different hotspot tiers</p>

            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '2rem' }}>Subscribers by Tier</h3>

              {tierAnalytics.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No tier data available</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* Bar Chart with Y-axis scale */}
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {/* Y-axis labels */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      paddingRight: '0.5rem',
                      height: '350px',
                      fontSize: '0.75rem',
                      color: '#94a3b8',
                      fontWeight: '500',
                      minWidth: '30px'
                    }}>
                      <div>15</div>
                      <div>12</div>
                      <div>9</div>
                      <div>6</div>
                      <div>3</div>
                      <div>0</div>
                    </div>

                    {/* Bar Chart */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-around',
                      height: '350px',
                      padding: '2rem 1rem',
                      backgroundColor: 'rgba(51, 65, 85, 0.3)',
                      borderRadius: '8px',
                      border: '1px solid rgba(71, 85, 105, 0.5)',
                      gap: '1rem',
                      flex: 1,
                      position: 'relative'
                    }}>
                      {/* Grid lines for reference */}
                      {[0, 3, 6, 9, 12, 15].map((value) => (
                        <div key={`grid-${value}`} style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: `${(value / 15) * 100}%`,
                          height: '1px',
                          backgroundColor: 'rgba(148, 163, 184, 0.1)',
                          pointerEvents: 'none'
                        }} />
                      ))}

                      {tierAnalytics.map((tier) => {
                        // Fixed scale: 0-15 users
                        const maxScale = 15;
                        // Scale to pixel height (max 280px for the bar)
                        const barHeightPx = (tier.active_subscribers / maxScale) * 280;
                        const finalBarHeight = Math.max(barHeightPx, 5); // Minimum 5px for visibility

                        return (
                        <div key={tier.tier_id} style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          flex: 1,
                          gap: '0.5rem'
                        }}>
                          {/* Bar */}
                          <div style={{
                            width: '100%',
                            height: `${finalBarHeight}px`,
                            backgroundColor: '#6366f1',
                            borderRadius: '4px 4px 0 0',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            position: 'relative'
                          }} title={`${tier.tier_name}: ${tier.active_subscribers} active subscribers`}>
                            {/* Subscriber count label on bar */}
                            <div style={{
                              position: 'absolute',
                              top: '-25px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              color: '#f1f5f9',
                              fontWeight: 'bold',
                              fontSize: '0.9rem',
                              whiteSpace: 'nowrap'
                            }}>
                              {tier.active_subscribers}
                            </div>
                          </div>

                          {/* Tier name label */}
                          <div style={{
                            textAlign: 'center',
                            fontSize: '0.85rem',
                            color: '#cbd5e1',
                            fontWeight: '500',
                            maxWidth: '100%',
                            wordWrap: 'break-word'
                          }}>
                            {tier.tier_name}
                          </div>

                          {/* Price label */}
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#94a3b8'
                          }}>
                            KSH {tier.price}
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Statistics Table */}
                  <div style={styles.tableContainer}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Tier Name</th>
                          <th>Price (KSH)</th>
                          <th>Duration (hrs)</th>
                          <th>Active Subscribers</th>
                          <th>Total Subscribers</th>
                          <th>Popularity %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tierAnalytics.map((tier) => {
                          const totalAllTiers = tierAnalytics.reduce((sum, t) => sum + t.active_subscribers, 0);
                          const popularityPercent = totalAllTiers > 0 ? ((tier.active_subscribers / totalAllTiers) * 100).toFixed(1) : 0;

                          return (
                            <tr key={tier.tier_id}>
                              <td><strong>{tier.tier_name}</strong></td>
                              <td>{tier.price}</td>
                              <td>{tier.duration_hours}</td>
                              <td style={{ color: '#10b981', fontWeight: 'bold' }}>{tier.active_subscribers}</td>
                              <td>{tier.total_subscribers}</td>
                              <td>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem'
                                }}>
                                  <div style={{
                                    width: '60px',
                                    height: '6px',
                                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                                    borderRadius: '3px',
                                    overflow: 'hidden'
                                  }}>
                                    <div style={{
                                      width: `${popularityPercent}%`,
                                      height: '100%',
                                      backgroundColor: '#6366f1',
                                      transition: 'width 0.3s ease'
                                    }} />
                                  </div>
                                  <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{popularityPercent}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                  }}>
                    <div style={{
                      padding: '1.5rem',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}>
                      <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Total Active Subscribers</div>
                      <div style={{ color: '#10b981', fontSize: '2rem', fontWeight: 'bold' }}>
                        {tierAnalytics.reduce((sum, t) => sum + t.active_subscribers, 0)}
                      </div>
                    </div>

                    <div style={{
                      padding: '1.5rem',
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(99, 102, 241, 0.3)'
                    }}>
                      <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Total All-Time Subscribers</div>
                      <div style={{ color: '#6366f1', fontSize: '2rem', fontWeight: 'bold' }}>
                        {tierAnalytics.reduce((sum, t) => sum + t.total_subscribers, 0)}
                      </div>
                    </div>

                    <div style={{
                      padding: '1.5rem',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                      <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Most Popular Tier</div>
                      <div style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {tierAnalytics.length > 0 && tierAnalytics.reduce((max, t) => t.active_subscribers > max.active_subscribers ? t : max).tier_name}
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
  subTab: {
    padding: '0.75rem 1.5rem',
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s',
  },
  activeSubTab: {
    color: '#6366f1',
    borderBottom: '2px solid #6366f1',
  },
};

export default AdminDashboard;
