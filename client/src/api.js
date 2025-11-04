import axios from 'axios';

// Use environment variable for API URL
// In development: http://127.0.0.1:5000
// In production: https://your-backend.onrender.com (set in Vercel)
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log the API URL in development for debugging
if (import.meta.env.DEV) {
  console.log('API URL:', API_URL);
}

export default api;

