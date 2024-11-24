import React, { createContext, useState, useEffect } from 'react';

const JournalContext = createContext();

const JournalProvider = ({ children }) => {
  const [journals, setJournals] = useState({});
  const [theme, setTheme] = useState('light');

  const handleSaveEntry = (date, newEntries) => {
    const formattedDate = date.toISOString().split('T')[0];
    setJournals((prevJournals) => ({
      ...prevJournals,
      [formattedDate]: newEntries,
    }));
  };

  const getEntriesForDate = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    return journals[formattedDate] || [''];
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <JournalContext.Provider value={{ journals, handleSaveEntry, getEntriesForDate, theme, toggleTheme }}>
      {children}
    </JournalContext.Provider>
  );
};

export { JournalContext, JournalProvider };
