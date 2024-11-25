import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../providers/UserProvider';

function Login() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { updateUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim()) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create/login user: ${response.status}`);
      }

      const data = await response.json();
      updateUser({ userId: data.userId, username: data.username });
      
      navigate('/new-entry');
    } catch (err) {
      setError('Failed to login. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Micro Journal</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
          <button type="submit">Start Journaling</button>
        </form>
      </div>
    </div>
  );
}

export default Login; 