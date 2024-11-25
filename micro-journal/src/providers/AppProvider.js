import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

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
  user: null,
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
      if (userData && typeof userData.userId === 'number') {
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
      try {
        const response = await fetch(`${API_BASE_URL}/journals/${formattedDate}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'user-id': state.user.userId.toString()
          },
          body: JSON.stringify({ entries: newEntries }),
        });

        if (!response.ok) throw new Error('Failed to save entries');
      } catch (error) {
        console.error('Failed to sync entries:', error);
      }
    }
  }, [state.isOnline, state.user]);

  const getEntriesForDate = useCallback(async (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    
    if (state.journals[formattedDate]) {
      return state.journals[formattedDate];
    }

    if (state.isOnline && state.user) {
      try {
        const response = await fetch(`${API_BASE_URL}/journals/${formattedDate}`, {
          headers: { 'user-id': state.user.userId.toString() }
        });
        
        if (response.ok) {
          const entries = await response.json();
          dispatch({
            type: actionTypes.SET_ENTRIES,
            payload: { date: formattedDate, entries },
          });
          return entries;
        }
      } catch (error) {
        console.error('Failed to fetch entries:', error);
      }
    }
    
    return [{ key: Date.now(), value: '' }];
  }, [state.journals, state.isOnline, state.user]);

  const clearAllData = useCallback(async () => {
    dispatch({ type: actionTypes.CLEAR_ENTRIES });
    
    if (state.isOnline && state.user) {
      try {
        const response = await fetch(`${API_BASE_URL}/journals`, {
          method: 'DELETE',
          headers: {
            'user-id': state.user.userId.toString()
          }
        });

        if (!response.ok) throw new Error('Failed to clear entries');
      } catch (error) {
        console.error('Failed to clear remote data:', error);
      }
    }
  }, [state.isOnline, state.user]);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        updateUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to load user from localStorage:', error);
    }
  }, [updateUser]);

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