import { useState, useEffect, memo } from 'react';
import { Loader2, Star, Check, Trash2 } from 'lucide-react';

const TierList = ({ onSubscribe, isAdmin = false }) => {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

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
    setConfirmDelete(tierId);
  };

  const confirmDeleteTier = async () => {
    const tierId = confirmDelete;
    setConfirmDelete(null);

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
      setError('Error deleting tier: ' + err.message);
      console.error('Error deleting tier:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
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

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Choose Your Plan
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the subscription tier that best fits your needs. All plans include our core features with additional benefits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {tiers.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            onSubscribe={handleSubscribe}
            onDelete={handleDelete}
            isAdmin={isAdmin}
            deletingId={deletingId}
          />
        ))}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this tier? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={cancelDelete}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTier}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TierCard = memo(({ tier, onSubscribe, onDelete, isAdmin, deletingId }) => {
  return (
    <div
      className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
        tier.is_popular ? 'ring-2 ring-blue-500' : 'border border-gray-200'
      }`}
    >
      {tier.is_popular && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg flex items-center gap-1">
          <Star className="w-4 h-4 fill-current" />
          Popular
        </div>
      )}

      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {tier.name}
        </h3>

        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900">
            ${tier.price}
          </span>
          <span className="text-gray-500 ml-2">
            /{tier.duration || 'month'}
          </span>
        </div>

        <p className="text-gray-600 mb-6 min-h-[60px]">
          {tier.description}
        </p>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
          <ul className="space-y-2">
            {tier.features && tier.features.length > 0 ? (
              tier.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 text-sm italic">No features listed</li>
            )}
          </ul>
        </div>

        {tier.benefits && (
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">
              Additional Benefits:
            </h4>
            <p className="text-gray-600 text-sm">{tier.benefits}</p>
          </div>
        )}

        <div className="flex gap-2">
          {!isAdmin && (
            <button
              onClick={() => onSubscribe(tier)}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                tier.is_popular
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Subscribe Now
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => onDelete(tier.id)}
              disabled={deletingId === tier.id}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletingId === tier.id ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default TierList;
