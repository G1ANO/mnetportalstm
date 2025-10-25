import { useState, useEffect } from 'react';
import { Loader2, Star, Check, Trash2 } from 'lucide-react';

const TierList = ({ onSubscribe, isAdmin = false }) => {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tiers');
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription tiers');
      }
      
      const data = await response.json();
      setTiers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tiers:', err);
    } finally {
      setLoading(false);
    }
  };
    const handleDelete = async (tierId) => {
    if (!window.confirm('Are you sure you want to delete this tier? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(tierId);
      const response = await fetch(`/api/tiers/${tierId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete tier');
      }

      setTiers(tiers.filter(tier => tier.id !== tierId));
    } catch (err) {
      alert('Error deleting tier: ' + err.message);
      console.error('Error deleting tier:', err);
    } finally {
      setDeletingId(null);
    }
  };
  