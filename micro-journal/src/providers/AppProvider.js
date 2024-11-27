import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { saveEntriesToBackend, fetchEntriesFromBackend, clearEntriesFromBackend } from '../utils/api';

const AppContext = createContext();
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Action Types
const actionTypes = {
  SAVE_ENTRY: 'SAVE_ENTRY',
  SET_ENTRIES: 'SET_ENTRIES',
  CLEAR_ENTRIES: 'CLEAR_ENTRIES',
  SET_USER: 'SET_USER',
  CLEAR_USER: 'CLEAR_USER',
  SET_ONLINE: 'SET_ONLINE'
};

// Initial State
const initialState = {
  journals: {},
  user: (() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Failed to load initial user from localStorage:', error);
      return null;
    }
  })(),
  isOnline: navigator.onLine
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SAVE_ENTRY:
    case actionTypes.SET_ENTRIES:
      return {
        ...state,
        journals: {
          ...state.journals,
          [action.payload.date]: action.payload.entries,
        },
      };
      
    case actionTypes.CLEAR_ENTRIES:
      return {
        ...state,
        journals: {},
      };

    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload
      };

    case actionTypes.CLEAR_USER:
      return {
        ...state,
        user: null
      };

    case actionTypes.SET_ONLINE:
      return {
        ...state,
        isOnline: action.payload
      };

    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Network status
  useEffect(() => {
    const handleOnline = () => dispatch({ type: actionTypes.SET_ONLINE, payload: true });
    const handleOffline = () => dispatch({ type: actionTypes.SET_ONLINE, payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // User Management
  const updateUser = useCallback((userData) => {
    try {
      if (userData && (typeof userData.userId === 'number' || typeof userData.userId === 'string')) {
        dispatch({ type: actionTypes.SET_USER, payload: userData });
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        throw new Error('Invalid user data');
      }
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_USER });
    dispatch({ type: actionTypes.CLEAR_ENTRIES });
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }, []);

  // Journal Management
  const handleSaveEntry = useCallback(async (date, newEntries) => {
    const formattedDate = date.toISOString().split('T')[0];
    
    dispatch({
      type: actionTypes.SAVE_ENTRY,
      payload: { date: formattedDate, entries: newEntries },
    });

    if (state.isOnline && state.user) {
      await saveEntriesToBackend(API_BASE_URL, state.user.userId, formattedDate, newEntries);
    }
  }, [state.isOnline, state.user]);

  const getEntriesForDate = useCallback(async (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    
    if (state.journals[formattedDate]) {
      return state.journals[formattedDate];
    }

    if (state.isOnline && state.user) {
      const entries = await fetchEntriesFromBackend(API_BASE_URL, state.user.userId, formattedDate);
      if (entries) {
        dispatch({
          type: actionTypes.SET_ENTRIES,
          payload: { date: formattedDate, entries },
        });
        return entries;
      }
    }
    
    return [{ key: Date.now(), value: '' }];
  }, [state.journals, state.isOnline, state.user]);

  const clearAllData = useCallback(async () => {
    dispatch({ type: actionTypes.CLEAR_ENTRIES });
    
    if (state.isOnline && state.user) {
      await clearEntriesFromBackend(API_BASE_URL, state.user.userId);
    }
  }, [state.isOnline, state.user]);

  const value = {
    journals: state.journals,
    user: state.user,
    isOnline: state.isOnline,
    handleSaveEntry,
    getEntriesForDate,
    clearAllData,
    updateUser,
    logout
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 