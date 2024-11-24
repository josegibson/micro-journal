import React, { createContext, useReducer } from 'react';

const JournalContext = createContext();

const actionTypes = {
  SAVE_ENTRY: 'SAVE_ENTRY',
};

const journalReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SAVE_ENTRY:
      const { date, entries } = action.payload;
      return {
        ...state,
        journals: {
          ...state.journals,
          [date]: entries,
        },
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

  const handleSaveEntry = (date, newEntries) => {
    const formattedDate = date.toISOString().split('T')[0];
    const existingEntries = state.journals[formattedDate] || [];

    if (JSON.stringify(existingEntries) !== JSON.stringify(newEntries)) {
      dispatch({
        type: actionTypes.SAVE_ENTRY,
        payload: { date: formattedDate, entries: newEntries },
      });
    }
  };

  const getEntriesForDate = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    return state.journals[formattedDate] || [''];
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
