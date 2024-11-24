import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => {
    try {
      return localStorage.getItem('userId') || 'default-user';
    } catch (error) {
      console.error('Failed to access localStorage:', error);
      return 'default-user';
    }
  });

  const updateUserId = (newUserId) => {
    try {
      setUserId(newUserId);
      localStorage.setItem('userId', newUserId);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  const logout = () => {
    setUserId('default-user');
    localStorage.removeItem('userId');
    localStorage.removeItem('journal_entries'); // Clear journal entries
  };

  const value = {
    userId,
    updateUserId,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 