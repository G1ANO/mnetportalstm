import React from "react";
import axios from "axios";
import FeedbackForm from "../components/FeedbackForm";
import ComplaintForm from "../components/ComplaintForm";
import LoyaltyPanel from "../components/LoyaltyPanel";
import NotificationPanel from "../components/NotificationPanel";
import "../styles/App.css"

const UserDashboard = ({ user }) => {
  const [subscription, setSubscription] = useState(null);
  const [tiers, setTiers] = useState([]);
  const [loyalty, setLoyalty] = useState(null);
  const [notifications, setNotifications] = useState([]);


  useEffect(() => {
    fetchSubscription();
    fetchTiers();
    fetchLoyalty();
    fetchNotifications();
  }, []);

    const fetchSubscription = () =>{
    axios
      .get(`http://localhost:5000/subscriptions?user_id=${user.id}`)
      .then((res) => {
        if (res.data.length > 0) setSubscription(res.data[0]);
      })
      .catch((err) => console.error(err));
  };

    const fetchTiers = () => {
    axios
      .get("http://localhost:5000/tiers")
      .then((res) => setTiers(res.data))
      .catch((err) => console.error(err));
  };

  const fetchLoyalty = () => {
    axios
      .get(`http://localhost:5000/loyalty?user_id=${user.id}`)
      .then((res) => setLoyalty(res.data))
      .catch((err) => console.error(err));
  };

  const fetchNotifications = () => {
    axios
      .get(`http://localhost:5000/notifications?user_id=${user.id}`)
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error(err));
  };

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
        <FeedbackForm userId = {user.id} tiers={tiers}/>
      </section>

      <section className="complaint-section">
        <h3>File a Complaint</h3>
        <ComplaintForm userId={user.id} />
      </section>

      {loyalty &&(
      <section className="loyalty-section">
        <h3>Loyalty Points</h3>
        <LoyaltyPanel loyalty={loyalty} />
      </section>
      )}

     {notifications.length > 0 &&(
      <section className="notification-section">
        <h3>Notifications</h3>
        <NotificationPanel notifications={notifications} />
      </section>
     )}
    </div>
  );
};

export default UserDashboard;
