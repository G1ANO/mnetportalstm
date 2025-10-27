import React from 'react';

const LoyaltyPanel = ({ loyalty }) => {
  if (!loyalty) {
    return (
      <div className="card">
        <h3>Loyalty Program</h3>
        <p style={{ color: '#94a3b8' }}>Loading loyalty information...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1rem', color: '#f1f5f9' }}>🎁 Loyalty Program</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0.75rem',
          background: 'rgba(16, 185, 129, 0.05)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(16, 185, 129, 0.1)'
        }}>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Points Balance</span>
          <span style={{ color: '#10b981', fontSize: '1rem', fontWeight: '600' }}>
            {loyalty.points || 0}
          </span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0.75rem',
          background: 'rgba(99, 102, 241, 0.05)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(99, 102, 241, 0.1)'
        }}>
          <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Tier</span>
          <span style={{ color: '#6366f1', fontSize: '1rem', fontWeight: '600' }}>
            {loyalty.tier || 'Bronze'}
          </span>
        </div>
        {loyalty.nextReward && (
          <div style={{
            padding: '0.75rem',
            background: 'rgba(251, 191, 36, 0.05)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(251, 191, 36, 0.1)',
            marginTop: '0.5rem'
          }}>
            <p style={{ color: '#fbbf24', fontSize: '0.875rem', margin: 0 }}>
              🎯 Next Reward: {loyalty.nextReward}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyPanel;
