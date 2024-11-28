import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../providers/AppProvider';

function Settings() {
  const { clearAllData, isOnline, logout, user } = useApp();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setIsLoading(true);
      try {
        await clearAllData();
        setMessage('All data has been cleared successfully');
      } catch (error) {
        setMessage('Failed to clear data. Please try again.');
      } finally {
        setIsLoading(false);
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="page">
      <h1>Settings</h1>
      <div className="settings-container">

        <div className="buttons-container">
          <button
            onClick={() => navigate('/profile')}
            className="btn btn-primary"
          >
            Profile
          </button>

          <button
            onClick={handleClearData}
            className="btn btn-danger"
            disabled={isLoading}
          >
            {isLoading ? 'Clearing...' : 'Clear All Data'}
          </button>

          <button
            onClick={handleLogout}
            className="btn btn-warning"
          >
            Logout
          </button>
        </div>
        <div className="settings-info">
          {message && (
            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
              {message}
            </div>
          )}

          {!isOnline && (
            <div className="alert alert-warning">
              You are currently offline. Some features may be limited.
            </div>
          )}
          <p className='text-center'>© 2024 Micro Journal</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
