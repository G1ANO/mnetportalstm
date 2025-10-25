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
     const handleSubscribe = (tier) => {
    if (onSubscribe) {
      onSubscribe(tier);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 font-medium">Error loading subscription tiers</p>
        <p className="text-red-600 text-sm mt-2">{error}</p>
        <button 
          onClick={fetchTiers}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (tiers.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600 text-lg">No subscription tiers available yet.</p>
        {isAdmin && (
          <p className="text-gray-500 text-sm mt-2">Add your first tier using the form above.</p>
        )}
      </div>
    );
  }
