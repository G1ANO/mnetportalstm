import React from "react";
import axios from "axios";

const UserDashboard = ({ user }) => {
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/subscriptions?user_id=${user.id}`)
      .then((res) => {
        if (res.data.length > 0) setSubscription(res.data[0]);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="user-dashboard">
      <h2 className="dashboard-title">Welcome, {user.name}!</h2>

      <section className="subscription-section">
        <h3>Your Subscription</h3>
        {subscription ? (
          <div className="subscription-card">
            <p><strong>Plan:</strong> {subscription.tier_name}</p>
            <p><strong>Status:</strong> {subscription.status}</p>
            <p><strong>Start:</strong> {new Date(subscription.start_date).toLocaleDateString()}</p>
            <p><strong>End:</strong> {new Date(subscription.end_date).toLocaleDateString()}</p>
          </div>
        ) : (
          <p>You currently have no active subscription.</p>
        )}
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
