import React from 'react';
import axios from 'axios';
import TierForm from '../components/TierForm';

const AdminDashboard = ({ user }) => {
  const [tiers, setTiers] = useState([]);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchTiers();
    fetchComplaints();
  }, []);

  const fetchTiers = () => {
    axios.get('http://localhost:5000/tiers')
      .then(res => setTiers(res.data))
      .catch(err => console.error(err));
  };

  const fetchComplaints = () => {
    axios.get(`http://localhost:5000/complaints?user_id=${user.id}`)
      .then(res => setComplaints(res.data))
      .catch(err => console.error(err));
  };

  const deleteTier = (tierId) => {
    axios
      .delete(`http://localhost:5000/tiers/${tierId}`, { data: { admin_id: user.id } })
      .then(() => fetchTiers())
      .catch(err => alert(err.response.data.error));
  };



  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <section className="tier-section">
        <h3>Manage Subscription Tiers</h3>
        <TierForm adminId={user.id} onTierAdded={fetchTiers} />

  <div className="tier-cards">
    {tiers.map(tier => (
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
    ))}
  </div>
      </section>

      <section className="complaints-section">
        <h3>User Complaints</h3>
      </section>
    </div>
  );
};

export default AdminDashboard;
