import { useState } from 'react';
import { Plus, X, Loader2, DollarSign } from 'lucide-react';

const TierForm = ({ onTierAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: 'month',
    description: '',
    benefits: '',
    is_popular: false,
    features: ['']
  });