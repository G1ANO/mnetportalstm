import React from 'react';

const AdminDashboard = ({ user }) => {
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <section className="tier-section">
        <h3>Manage Subscription Tiers</h3>
      </section>

      <section className="complaints-section">
        <h3>User Complaints</h3>
      </section>
    </div>
  );
};

export default AdminDashboard;
