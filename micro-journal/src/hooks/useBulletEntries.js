import { useRef, useContext, useState, useEffect } from "react";
import { JournalContext } from '../providers/JournalProvider';

// New hook for handling keyboard actions
const useKeyboardActions = (entries, setEntries, handleSaveEntry, formattedDate, focusInput) => {
  const handleKeyActions = (key, event) => {
    const index = entries.findIndex(entry => entry.key === key);
    if (event.key === "Enter") {
      event.preventDefault();
      if (entries[index].value.trim()) {
        const updatedEntries = [...entries];
        if (index === entries.length - 1) {
          updatedEntries.push({ key: Date.now(), value: '' });
          setEntries(updatedEntries);
          handleSaveEntry(new Date(formattedDate), updatedEntries);
        }
        focusInput(index + 1);
      }
    } else if (event.key === "Backspace" && entries[index].value === "" && index > 0) {
      event.preventDefault();
      const updatedEntries = entries.filter(entry => entry.key !== key);
      setEntries(updatedEntries);
      handleSaveEntry(new Date(formattedDate), updatedEntries);
      focusInput(index - 1);
    }
  };

  return { handleKeyActions };
};

export const useBulletEntries = (formattedDate) => {
  const { getEntriesForDate, handleSaveEntry } = useContext(JournalContext);
  const [entries, setEntries] = useState([]);
  const inputRefs = useRef([]);

  const focusInput = (index) => {
    setTimeout(() => {
      const input = inputRefs.current[index];
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }, 0);
  };

  const { handleKeyActions } = useKeyboardActions(entries, setEntries, handleSaveEntry, formattedDate, focusInput);

  useEffect(() => {
    if (formattedDate) {
      const loadEntries = async () => {
        const initialEntries = await getEntriesForDate(new Date(formattedDate));
        setEntries(initialEntries);
      };
      loadEntries();
    }
  }, [formattedDate, getEntriesForDate]);

  const handleEntryChange = (key, value) => {
    let updatedEntries = entries.map(entry => 
      entry.key === key ? { ...entry, value } : entry
    );

    // Remove empty entries except the last one
    if (updatedEntries.length > 1) {
      updatedEntries = updatedEntries.filter((entry, index) => 
        index === updatedEntries.length - 1 || entry.value.trim() !== ''
      );
    }

    // Add new empty entry if the last one is not empty
    if (updatedEntries[updatedEntries.length - 1].value.trim() !== '') {
      updatedEntries.push({ key: Date.now(), value: '' });
    }

    setEntries(updatedEntries);
    handleSaveEntry(new Date(formattedDate), updatedEntries);
  };

  return {
    entries,
    setEntries,
    inputRefs,
    handleEntryChange,
    handleKeyActions,
    focusInput
  };
}; 