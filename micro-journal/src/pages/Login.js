import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../providers/UserProvider';

function Login() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { updateUserId } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    console.log('Login attempt started');
    console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);
    
    if (!username.trim()) {
      console.log('Empty username, returning');
      return;
    }

    try {
      console.log('Making fetch request...');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`Failed to create/login user: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      console.log('Updating user ID:', data.userId);
      updateUserId(data.userId);
      
      console.log('Navigating to new-entry');
      navigate('/new-entry');
    } catch (err) {
      console.error('Detailed login error:', {
        message: err.message,
        stack: err.stack,
        type: err.name
      });
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