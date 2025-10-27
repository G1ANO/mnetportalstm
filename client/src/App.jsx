import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/Loginpage";
import Register from "./pages/Register";
import { HomePage } from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const goToRegister = () => {
    setCurrentPage('register');
  };

  const goToLogin = () => {
    setCurrentPage('login');
  };

  // Simple page routing without react-router for now
  if (!user) {
    if (currentPage === 'register') {
      return <Register onGoToLogin={goToLogin} />;
    }
    return <LoginPage onLogin={handleLogin} onGoToRegister={goToRegister} />;
  }

  return <HomePage user={user} onLogout={handleLogout} />;
}

export default App;
