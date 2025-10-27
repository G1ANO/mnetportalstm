import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Fetch username from localStorage or API
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    // Alternatively, fetch from API:
    // fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left side - Username */}
        <div className="navbar-left">
          <span className="username">
            {username ? `Welcome, ${username}` : 'Guest'}
          </span>
        </div>

        {/* Right side - Navigation Links */}
        <div className="navbar-right">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

