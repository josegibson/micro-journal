import React from 'react';
import { useUser } from '../providers/UserProvider';

function Profile() {
  const { userId, logout } = useUser();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="page">
      <h1>Profile</h1>
      <div className="profile-container">
        <p><strong>User ID:</strong> {userId}</p>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
