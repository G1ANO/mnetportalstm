import React from 'react';
import axios from 'axios';

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
