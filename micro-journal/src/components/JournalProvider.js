import React, { createContext, useState, useEffect } from 'react';

const JournalContext = createContext();

const JournalProvider = ({ children }) => {
  const [journals, setJournals] = useState({});

  const handleSaveEntry = (date, newEntries) => {
    const formattedDate = date.toISOString().split('T')[0];
    setJournals((prevJournals) => {
      const updatedJournals = {
        ...prevJournals,
        [formattedDate]: newEntries,
      };
      console.log('Updated Journals:', updatedJournals);
      return updatedJournals;
    });
  };

  useEffect(() => {
    console.log('Journals updated:', journals);
  }, [journals]);

  return (
    <JournalContext.Provider value={{ journals, handleSaveEntry }}>
      {children}
    </JournalContext.Provider>
  );
};

export { JournalContext, JournalProvider };
