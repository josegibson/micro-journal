import React from 'react';
import { useUser } from '../providers/UserProvider';

function Profile() {
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="page">
      <h1>Profile</h1>
      <div className="profile-container">
        <div className="profile-buttons">
          <div className="info-tile">
            <span>Username</span>
            <span>{user?.username || 'Not available'}</span>
          </div>
          <div className="info-tile">
            <span>User ID</span>
            <span>{user?.userId}</span>
          </div>
        </div>
        <button onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  );
}

export default Profile;
