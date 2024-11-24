import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JournalContext } from '../components/JournalProvider';

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

function BulletEntryPage() {
  const { date, index } = useParams();
  const navigate = useNavigate();
  const { getEntriesForDate, handleSaveEntry } = useContext(JournalContext);
  const formattedDate = new Date(date).toISOString().split('T')[0];
  const parsedIndex = parseInt(index, 10);
  const [entries, setEntries] = useState(() => getEntriesForDate(new Date(date)));
  const [entry, setEntry] = useState(entries[parsedIndex] || '');
  const textareaRef = useRef(null);

  useEffect(() => {
    const journalEntries = getEntriesForDate(new Date(date));

    // Prevent unnecessary state updates
    if (!arraysEqual(journalEntries, entries)) {
      setEntries(journalEntries);
      setEntry(journalEntries[parsedIndex] || '');
    }
  }, [getEntriesForDate, date, parsedIndex, entries]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [entry]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  };

  const handleSave = () => {
    const updatedEntries = [...entries];
    if (parsedIndex >= 0 && parsedIndex < updatedEntries.length) {
      updatedEntries[parsedIndex] = entry;
    } else if (parsedIndex === updatedEntries.length) {
      updatedEntries.push(entry);
    }

    if (updatedEntries[updatedEntries.length - 1].trim() !== '') {
      updatedEntries.push('');
    }

    handleSaveEntry(new Date(date), updatedEntries);
    navigate(-1);
  };

  const handleChange = (e) => {
    setEntry(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="fullscreen-textarea">
      <textarea
        ref={textareaRef}
        value={entry}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Edit your entry..."
        rows={1}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default BulletEntryPage; 