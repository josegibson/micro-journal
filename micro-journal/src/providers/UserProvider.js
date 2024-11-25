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
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : { userId: 'default-user', username: 'Guest' };
    } catch (error) {
      console.error('Failed to access localStorage:', error);
      return { userId: 'default-user', username: 'Guest' };
    }
  });

  const updateUser = (newUser) => {
    try {
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  const logout = () => {
    setUser({ userId: 'default-user', username: 'Guest' });
    localStorage.removeItem('user');
    localStorage.removeItem('journal_entries'); // Clear journal entries
  };

  const value = {
    user,
    updateUser,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 