import { useRef, useContext, useEffect } from "react";
import { JournalContext } from './JournalProvider';

export const useBulletEntries = (date, entries, setEntries) => {
  const { journals, handleSaveEntry } = useContext(JournalContext);
  const inputRefs = useRef([]);

  useEffect(() => {
    const dateStr = new Date(date).toISOString().split('T')[0];
    const journalEntries = journals[dateStr] || [''];
    setEntries(journalEntries);
  }, [journals, date, setEntries]);

  const handleEntryChange = (index, value) => {
    setEntries((prevEntries) => {
      const updatedEntries = [...prevEntries];
      updatedEntries[index] = value;
      handleSaveEntry(new Date(date), updatedEntries);
      return updatedEntries;
    });
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

  const handleKeyActions = (index, event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (entries[index]) {
        const updatedEntries = [...entries];
        updatedEntries[index] = entries[index];
        if (index === entries.length - 1) {
          updatedEntries.push('');
        }
        setEntries(updatedEntries);
        handleSaveEntry(new Date(date), updatedEntries);
        focusInput(index + 1);
      }
    } else if (event.key === "Backspace" && entries[index] === "" && index > 0) {
      event.preventDefault();
      const updatedEntries = entries.filter((_, i) => i !== index);
      setEntries(updatedEntries);
      handleSaveEntry(new Date(date), updatedEntries);
      focusInput(index - 1);
    }
  };

  return {
    inputRefs,
    handleEntryChange,
    handleKeyActions,
  };
}; 