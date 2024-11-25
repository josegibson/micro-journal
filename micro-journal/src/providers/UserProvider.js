import React, { createContext, useContext, useState, useCallback } from 'react';
import { handleError } from '../utils/errorHandler';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Failed to access localStorage:', error);
      return null;
    }
  });

  const updateUser = (newUser) => {
    try {
      if (newUser && typeof newUser.userId === 'number') {
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
      } else {
        throw new Error('Invalid user data');
      }
    } catch (error) {
      console.error(handleError(error, 'Failed to save user data.'));
    }
  };

  const logout = useCallback(() => {
    // Clear user data
    setUser(null);
    localStorage.removeItem('user');
    
    // Clear any stored tokens or auth data
    localStorage.removeItem('authToken');
    
    // Force reload to clear any in-memory state
    window.location.href = '/login';
  }, []);

  // Ensure userId is always a number or null
  const value = {
    user: user || null,
    userId: user?.userId || null,
    updateUser,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 