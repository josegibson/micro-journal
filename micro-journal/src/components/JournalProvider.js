import React, { createContext, useReducer } from 'react';

const JournalContext = createContext();

const actionTypes = {
  SAVE_ENTRY: 'SAVE_ENTRY',
};

const loadFromLocalStorage = () => {
  try {
    const savedJournals = localStorage.getItem('journals');
    return savedJournals ? JSON.parse(savedJournals) : {};
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return {};
  }
};

const journalReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SAVE_ENTRY:
      const { date, entries } = action.payload;
      const newState = {
        ...state,
        journals: {
          ...state.journals,
          [date]: entries,
        },
      };
      // Save to localStorage
      localStorage.setItem('journals', JSON.stringify(newState.journals));
      return newState;
    default:
      return state;
  }
};

const initialState = {
  journals: loadFromLocalStorage(),
};

const JournalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(journalReducer, initialState);

  const handleSaveEntry = (date, newEntries) => {
    const formattedDate = date.toISOString().split('T')[0];
    dispatch({
      type: actionTypes.SAVE_ENTRY,
      payload: { date: formattedDate, entries: newEntries },
    });
  };

  const getEntriesForDate = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    return state.journals[formattedDate] || [{ key: Date.now(), value: '' }];
  };

  return (
    <JournalContext.Provider
      value={{
        journals: state.journals,
        handleSaveEntry,
        getEntriesForDate,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export { JournalContext, JournalProvider };
