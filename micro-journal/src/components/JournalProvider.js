import React, { createContext, useEffect, useState } from 'react';


const JournalContext = createContext();

const JournalProvider = ({ children }) => {
  const [journals, setJournals] = useState({});  // Renamed to journals

  const handleSaveEntry = (date, newEntries) => {
    const formattedDate = date.toISOString().split('T')[0];
    setJournals((prevJournals) => ({
      ...prevJournals,
      [formattedDate]: newEntries,
    }));
  };

const fetchJournalByDate = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    if (!journals[formattedDate]) {
        setJournals((prevJournals) => ({
            ...prevJournals,
            [formattedDate]: [],
        }));
    }
    return journals[formattedDate] || [];
};

    useEffect(() => {
        console.log('Journals updated:', journals);
    }, [journals]);

  return (
    <JournalContext.Provider value={{ journals, handleSaveEntry, fetchJournalByDate }}>
      {children}
    </JournalContext.Provider>
  );
};

export { JournalContext, JournalProvider };
