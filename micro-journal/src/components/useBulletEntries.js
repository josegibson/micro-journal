import { useRef, useContext, useEffect } from "react";
import { JournalContext } from './JournalProvider';

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].value !== arr2[i].value) return false;
  }
  return true;
}

export const useBulletEntries = (date, entries, setEntries) => {
  const { journals, handleSaveEntry } = useContext(JournalContext);
  const inputRefs = useRef([]);

  useEffect(() => {
    const dateStr = new Date(date).toISOString().split('T')[0];
    const journalEntries = journals[dateStr] || [{ key: Date.now(), value: '' }];

    if (!arraysEqual(journalEntries, entries)) {
      setEntries(journalEntries);
    }
  }, [journals, date, setEntries]);

  const handleEntryChange = (key, value) => {
    let updatedEntries = entries.map(entry => 
      entry.key === key ? { ...entry, value } : entry
    );

    // Remove the entry if it is emptied and not the last one
    if (value === '' && updatedEntries.length > 1) {
      updatedEntries = updatedEntries.filter(entry => entry.key !== key);
      focusInput(updatedEntries.length - 1);
    }

    // Ensure the last entry is always an empty string
    if (updatedEntries[updatedEntries.length - 1].value.trim() !== '') {
      updatedEntries.push({ key: Date.now(), value: '' });
    }

    handleSaveEntry(new Date(date), updatedEntries);
    setEntries(updatedEntries);
  };

  const focusInput = (index, position = 'end') => {
    setTimeout(() => {
      const input = inputRefs.current[index];
      if (input) {
        input.focus();
        if (position === 'end') {
          input.setSelectionRange(input.value.length, input.value.length);
        }
      }
    }, 0);
  };

  const handleKeyActions = (key, event) => {
    const index = entries.findIndex(entry => entry.key === key);
    if (event.key === "Enter") {
      event.preventDefault();
      if (entries[index].value) {
        const updatedEntries = [...entries];
        if (index === entries.length - 1) {
          updatedEntries.push({ key: Date.now(), value: '' });
        }
        handleSaveEntry(new Date(date), updatedEntries);
        setEntries(updatedEntries);
        focusInput(index + 1);
      }
    } else if (event.key === "Backspace" && entries[index].value === "" && index > 0) {
      event.preventDefault();
      const updatedEntries = entries.filter(entry => entry.key !== key);
      handleSaveEntry(new Date(date), updatedEntries);
      setEntries(updatedEntries);
      focusInput(index - 1);
    }
  };

  return {
    inputRefs,
    handleEntryChange,
    handleKeyActions,
  };
}; 