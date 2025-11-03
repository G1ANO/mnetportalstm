import { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';

// Utility function to format datetime in GMT+3 (East Africa Time)
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
    hour12: false
  });
};

const FeedbackForm = ({ userId, notifications = [], subscriptionType = 'hotspot' }) => {
  const [form, setForm] = useState({
    type: 'feedback',
    subject: '',
    rating: 5,
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/feedbacks?user_id=${userId}`);
      // Keep only the 3 most recent submissions
      setSubmissions(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:5000/feedbacks', {
        user_id: userId,
        subscription_type: subscriptionType,
        ...form,
      });
      const message = form.type === 'feedback' ? 'Feedback submitted successfully!' : 'Complaint submitted successfully!';
      alert(message);
      setForm({ type: 'feedback', subject: '', rating: 5, comment: '' });
      fetchSubmissions(); // Refresh the list
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Failed to submit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Notifications Section */}
      {notifications.length > 0 && (
        <div className="card" style={{
          marginBottom: '2rem',
          backgroundColor: '#1e293b',
          borderLeft: '4px solid #6366f1',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}>
          <h3 style={{ color: '#818cf8', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Admin Notifications
          </h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                style={{
                  padding: '1rem',
                  marginBottom: '0.75rem',
                  backgroundColor: notif.status === 'unread' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(51, 65, 85, 0.5)',
                  borderRadius: '6px',
                  border: notif.status === 'unread' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(71, 85, 105, 0.5)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    fontWeight: '500'
                  }}>
                    {formatToGMT3(notif.created_at)} EAT
                  </span>
                  {notif.status === 'unread' && (
                    <span style={{
                      fontSize: '0.75rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '9999px',
                      fontWeight: '600'
                    }}>
                      NEW
                    </span>
                  )}
                </div>
                <p style={{ margin: 0, color: '#f1f5f9', lineHeight: '1.5', fontSize: '0.95rem' }}>{notif.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submission Form */}
      <div className="card">
        <h3>Submit Feedback or Complaint</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            >
              <option value="feedback">Feedback</option>
              <option value="complaint">Complaint</option>
            </select>
          </div>

          {form.type === 'complaint' && (
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Brief description of the issue"
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>
          )}

          {form.type === 'feedback' && (
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="rating">Overall App Rating (1-5)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input
                  id="rating"
                  type="number"
                  name="rating"
                  min="1"
                  max="5"
                  value={form.rating}
                  onChange={handleChange}
                  required
                  style={{
                    width: '80px',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
                <span style={{ fontSize: '1.5rem' }}>
                  {'⭐'.repeat(parseInt(form.rating))}
                </span>
              </div>
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="comment">
              {form.type === 'feedback' ? 'Comment' : 'Description'}
            </label>
            <textarea
              id="comment"
              name="comment"
              value={form.comment}
              onChange={handleChange}
              placeholder={form.type === 'feedback' ? 'Share your experience...' : 'Provide detailed information...'}
              rows="4"
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : `Submit ${form.type === 'feedback' ? 'Feedback' : 'Complaint'}`}
          </button>
        </form>
      </div>

      {/* Admin Responses Section */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Your Submissions & Admin Responses</h3>
        {loading ? (
          <p>Loading...</p>
        ) : submissions.length === 0 ? (
          <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No submissions yet.</p>
        ) : (
          <div style={styles.submissionsList}>
            {submissions.map((item) => (
              <div key={item.id} style={styles.submissionCard}>
                <div style={styles.submissionHeader}>
                  <span style={{
                    ...styles.typeBadge,
                    backgroundColor: item.type === 'feedback' ? '#10b981' : '#f59e0b'
                  }}>
                    {item.type === 'feedback' ? 'Feedback' : 'Complaint'}
                  </span>
                  <span style={styles.date}>{formatToGMT3(item.created_at)} EAT</span>
                </div>

                {item.subject && (
                  <h4 style={styles.subject}>{item.subject}</h4>
                )}

                {item.type === 'feedback' && item.rating && (
                  <div style={styles.rating}>
                    <strong>Rating:</strong> {'⭐'.repeat(item.rating)} ({item.rating}/5)
                  </div>
                )}

                <p style={styles.comment}><strong>Your message:</strong> {item.comment}</p>

                <div style={styles.statusBadge}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    backgroundColor: item.status === 'resolved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                    color: item.status === 'resolved' ? '#10b981' : '#fbbf24',
                    border: item.status === 'resolved' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(251, 191, 36, 0.4)'
                  }}>
                    {item.status === 'resolved' ? 'Resolved' : 'Pending'}
                  </span>
                </div>

                {item.admin_response && (
                  <div style={styles.adminResponse}>
                    <div style={styles.adminResponseHeader}>
                      <strong>Admin Response:</strong>
                      {item.updated_at && (
                        <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                          {formatToGMT3(item.updated_at)} EAT
                        </span>
                      )}
                    </div>
                    <p style={styles.adminResponseText}>{item.admin_response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
  },
  submissionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem',
  },
  submissionCard: {
    padding: '1rem',
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderRadius: '8px',
    border: '1px solid rgba(71, 85, 105, 0.5)',
  },
  submissionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  typeBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'white',
  },
  date: {
    fontSize: '0.875rem',
    color: '#94a3b8',
  },
  subject: {
    margin: '0.5rem 0',
    fontSize: '1.125rem',
    color: '#f1f5f9',
  },
  rating: {
    marginBottom: '0.5rem',
    fontSize: '0.95rem',
    color: '#cbd5e1',
  },
  comment: {
    margin: '0.75rem 0',
    color: '#cbd5e1',
    lineHeight: '1.5',
  },
  statusBadge: {
    marginTop: '0.75rem',
  },
  adminResponse: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderLeft: '4px solid #6366f1',
    borderRadius: '4px',
    border: '1px solid rgba(99, 102, 241, 0.3)',
  },
  adminResponseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
    color: '#f1f5f9',
  },
  adminResponseText: {
    margin: '0.5rem 0 0 0',
    color: '#e0e7ff',
    lineHeight: '1.6',
  },
};

export default FeedbackForm;

