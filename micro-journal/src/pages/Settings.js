import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JournalContext } from '../components/JournalProvider';
import { useUser } from '../providers/UserProvider';

function Settings() {
  const { clearAllData, saveAllData, isOnline } = useContext(JournalContext);
  const { logout } = useUser();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      clearAllData();
      setMessage('All data has been cleared');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSaveData = async () => {
    if (!isOnline) {
      setMessage('Cannot save data while offline');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setMessage('Saving data...');
    const success = await saveAllData();

    if (success) {
      setMessage('All data has been saved successfully');
    } else {
      setMessage('Failed to save data. Please try again.');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="page">
      <h1>Settings</h1>
      <div className="settings-container">
        <div className="settings-buttons">
          <button
            onClick={handleSaveData}
            disabled={!isOnline}
            className="btn btn-primary"
          >
            Save All Data
          </button>
          <button
            onClick={handleClearData}
            className="btn btn-danger"
          >
            Clear All Data
          </button>
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
          >
            Logout
          </button>
        </div>
        {message && <div className="alert alert-info">{message}</div>}
      </div>
    </div>
  );
}

export default Settings;
