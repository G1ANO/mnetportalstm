// UserDashboard.jsx
import React from "react";

const UserDashboard = ({ user }) => {
  return (
    <div className="user-dashboard">
      <h2 className="dashboard-title">Welcome, {user.name}!</h2>

      <section className="subscription-section">
        <h3>Your Subscription</h3>
      </section>

      <section className="feedback-section">
        <h3>Submit Feedback</h3>
      </section>

      <section className="complaint-section">
        <h3>File a Complaint</h3>
      </section>

      <section className="loyalty-section">
        <h3>Loyalty Points</h3>
      </section>

      <section className="notification-section">
        <h3>Notifications</h3>
      </section>
    </div>
  );
};

export default UserDashboard;
