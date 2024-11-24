import React, { createContext, useReducer } from 'react';
import { useJournalSync } from '../hooks/useJournalSync';

const JournalContext = createContext();

const actionTypes = {
  SAVE_ENTRY: 'SAVE_ENTRY',
  SET_ENTRIES: 'SET_ENTRIES',
  CLEAR_ENTRIES: 'CLEAR_ENTRIES',
};

const journalReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SAVE_ENTRY:
    case actionTypes.SET_ENTRIES:
      const { date, entries } = action.payload;
      return {
        ...state,
        journals: {
          ...state.journals,
          [date]: entries,
        },
      };
    case actionTypes.CLEAR_ENTRIES:
      return {
        ...state,
        journals: {},
      };
    default:
      return state;
  }
};

const initialState = {
  journals: {},
};

const JournalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(journalReducer, initialState);
  const { isOnline, isSyncing, error, fetchEntries, saveEntries, clearAllEntries } = useJournalSync();

  const handleSaveEntry = async (date, newEntries) => {
    const formattedDate = date.toISOString().split('T')[0];
    
    dispatch({
      type: actionTypes.SAVE_ENTRY,
      payload: { date: formattedDate, entries: newEntries },
    });

    if (isOnline) {
      await saveEntries(formattedDate, newEntries);
    }
  };

  const getEntriesForDate = async (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    
    // If we already have the entries in state, use those
    if (state.journals[formattedDate]) {
      return state.journals[formattedDate];
    }

    // Otherwise fetch from backend if online
    if (isOnline) {
      const entries = await fetchEntries(formattedDate);
      if (entries) {
        dispatch({
          type: actionTypes.SET_ENTRIES,
          payload: { date: formattedDate, entries },
        });
        return entries;
      }
    }
    
    // Return default empty entry if offline or fetch failed
    return [{ key: Date.now(), value: '' }];
  };

  const clearAllData = async () => {
    dispatch({ type: actionTypes.CLEAR_ENTRIES });
    if (isOnline) {
      await clearAllEntries();
    }
  };

  const saveAllData = async () => {
    if (!isOnline) return false;
    
    try {
      const entries = Object.entries(state.journals);
      for (const [date, journalEntries] of entries) {
        await saveEntries(date, journalEntries);
      }
      return true;
    } catch (error) {
      console.error('Failed to save all data:', error);
      return false;
    }
  };

  return (
    <JournalContext.Provider
      value={{
        journals: state.journals,
        handleSaveEntry,
        getEntriesForDate,
        isOnline,
        isSyncing,
        error,
        clearAllData,
        saveAllData,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export { JournalContext, JournalProvider };
