import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../providers/AppProvider';

function Profile() {
  const { user, logout, isOnline } = useApp();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogout = () => {
    logout();
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="page">
      <div className="profile-header">
        <button onClick={handleBack} className="btn btn-link">
          ← Back
        </button>
        <h1>Profile</h1>
      </div>

      <div className="profile-container">
        <div className="profile-info">
          <div className="info-group">
            <label>Username</label>
            <div className="info-value">{user?.username}</div>
          </div>

          <div className="info-group">
            <label>User ID</label>
            <div className="info-value">{user?.userId}</div>
          </div>

          <div className="info-group">
            <label>Status</label>
            <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button
            onClick={handleLogout}
            className="btn btn-danger"
          >
            Logout
          </button>
        </div>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}
      </div>

      <div className="profile-footer">
        <p>Last login: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default Profile;
