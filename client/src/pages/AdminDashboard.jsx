import React, { useState, useEffect } from "react";
import axios from 'axios';
import TierForm from '../components/TierForm';
import "../index.css"

const AdminDashboard = ({ user }) => {
  const [tiers, setTiers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (user && user.id) {
      fetchData();
    }
    
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchTiers(), fetchComplaints()]);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };


  const fetchTiers = async () => {
     try {
      const res = await axios.get('http://localhost:5000/tiers');
      setTiers(res.data);
    } catch(err) {
         console.error("Error fetching tiers:", err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/complaints`);
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  const deleteTier  = async (tierId) => {
    if (!window.confirm("Are you sure you want to delete this tier?")) return;

    try {
      await axios.delete(`http://localhost:5000/tiers/${tierId}`, {
        data: { admin_id: user.id },
      });
      fetchTiers();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete tier.");
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

  if (!user) {
    return <p className="loading-text">Loading user data...</p>;
  }

  if (loading) {
    return <p className="loading-text">Loading dashboard data...</p>;
  }


  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <section className="tier-section">
        <h3>Manage Subscription Tiers</h3>
        <TierForm adminId={user.id} onTierAdded={fetchTiers} />

  <div className="tier-cards">
    {tiers.length === 0 ? (
            <p>No tiers available yet.</p>
          ) : (

    tiers.map((tier) => (
      <div key={tier.id} className="tier-card">
        <h4>{tier.name}</h4>
        <p>{tier.description}</p>
        <p>Price: ${tier.price}</p>
        <p>Duration: {tier.duration_days} days</p>
        <p>Speed: {tier.speed_limit} Mbps</p>
        <p>Data: {tier.data_limit} MB</p>
        <div className="card-buttons">
                <button onClick={() => deleteTier(tier.id)} className="delete-btn">Delete</button>
              </div>
      </div>
    ))
   )}
  </div>
      </section>

      <section className="complaints-section">
        <h3>User Complaints</h3>
        <div className="table-container">
          {complaints.length === 0 ? (
            <p>No complaints at the moment.</p>
          ) : (  
    <table>
      <thead>
        <tr>
          <th>Subject</th>
          <th>User</th>
          <th>Status</th>
          <th>Response</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {complaints.map(c => (
          <tr key={c.id}>
            <td>{c.subject}</td>
            <td>{c.user_id}</td>
            <td>
                <span className={`status-badge ${c.status?.toLowerCase() || ""}`}>
              
                {c.status}
              </span>
            </td>
            <td>{c.admin_response || '-'}</td>
            <td>
             <button className="reply-btn" onClick={() => replyComplaint(c.id)}>Reply</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
      )}
  </div>
</section>
</div>
  );
};

export default AdminDashboard;
