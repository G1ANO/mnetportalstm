import React, { useState } from 'react';
import './feedback.css';

const Feedback = () => {
  const [feedbackType, setFeedbackType] = useState('feedback'); // 'feedback' or 'complaint'
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedbackText.trim()) {
      setMessageType('error');
      setSubmitMessage('Please enter your feedback or complaint.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        type: feedbackType,
        content: feedbackText,
        rating: feedbackType === 'feedback' ? rating : null,
        timestamp: new Date().toISOString(),
      };

      // Replace with your actual API endpoint
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessageType('success');
        setSubmitMessage(
          feedbackType === 'feedback'
            ? 'Thank you for your feedback!'
            : 'Your complaint has been submitted. We will review it shortly.'
        );
        setFeedbackText('');
        setRating(5);
        setFeedbackType('feedback');
      } else {
        setMessageType('error');
        setSubmitMessage('Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessageType('error');
      setSubmitMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-container">
      <div className="feedback-card">
        <h2>Share Your Feedback</h2>

        <form onSubmit={handleSubmit} className="feedback-form">
          {/* Feedback Type Selection */}
          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="feedback-type-selector">
              <label className="radio-label">
                <input
                  type="radio"
                  name="feedbackType"
                  value="feedback"
                  checked={feedbackType === 'feedback'}
                  onChange={(e) => setFeedbackType(e.target.value)}
                />
                <span>Feedback</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="feedbackType"
                  value="complaint"
                  checked={feedbackType === 'complaint'}
                  onChange={(e) => setFeedbackType(e.target.value)}
                />
                <span>Complaint</span>
              </label>
            </div>
          </div>

          {/* Rating (only for feedback) */}
          {feedbackType === 'feedback' && (
            <div className="form-group">
              <label className="form-label">Rating</label>
              <div className="rating-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${rating >= star ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                    title={`${star} star${star > 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Text */}
          <div className="form-group">
            <label htmlFor="feedbackText" className="form-label">
              {feedbackType === 'feedback' ? 'Your Feedback' : 'Complaint Details'}
            </label>
            <textarea
              id="feedbackText"
              className="feedback-textarea"
              placeholder={
                feedbackType === 'feedback'
                  ? 'Tell us what you think about our service...'
                  : 'Please describe your complaint in detail...'
              }
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows="6"
              maxLength="1000"
            />
            <div className="char-count">
              {feedbackText.length}/1000 characters
            </div>
          </div>

          {/* Submit Message */}
          {submitMessage && (
            <div className={`submit-message ${messageType}`}>
              {submitMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;

