import React, { useState } from 'react';

export const LoginPage = ({ onLogin, onGoToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === 'admin@mnet.com' && password === 'admin123') {
      onLogin({ username: 'Admin', email, isAdmin: true });
    } else if (email && password) {
      onLogin({ username: 'User', email, isAdmin: false });
    } else {
      alert('Please enter valid credentials');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <p>Admin: admin@mnet.com / admin123</p>

      <form onSubmit={handleLogin} style={styles.form}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>Login</button>
      </form>

      <p>
        You have no account?{' '}
        <button onClick={onGoToRegister} style={styles.linkButton}>
          Register here
        </button>
      </p>
    </div>
  );
};
