// src/components/BulletTextArea.js
import React, { useEffect, useRef, useState } from "react";
import { useApp } from '../providers/AppProvider';

function BulletTextArea({ date }) {
  const { getEntriesForDate, handleSaveEntry } = useApp();
  const [entries, setEntries] = useState([]);
  const inputRefs = useRef([]);
  const [focusIndex, setFocusIndex] = useState(null);

  const focusInput = (index) => {
    const input = inputRefs.current[index];
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  };

  const handleKeyActions = (key, event, arrayIndex) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleEnterKey(arrayIndex);
    } else if (event.key === "Backspace" && entries[arrayIndex].value === "" && arrayIndex > 0) {
      event.preventDefault();
      const updatedEntries = entries.filter(entry => entry.key !== key);
      setEntries(updatedEntries);
      handleSaveEntry(new Date(date), updatedEntries);
    }
  };

  const handleEnterKey = (index) => {
    if (entries[index].value.trim()) {
      const updatedEntries = [...entries];
      if (index === entries.length - 1) {
        updatedEntries.push({ key: Date.now(), value: '' });
        setEntries(updatedEntries);
        handleSaveEntry(new Date(date), updatedEntries);
      }
      focusInput(index + 1);
    }
  };

  const adjustTextAreaHeight = (textarea) => {
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight
  };

  const handleEntryChange = (key, value, index) => {
    const updatedEntries = entries.map(entry => 
      entry.key === key ? { ...entry, value } : entry
    );

    if (updatedEntries[updatedEntries.length - 1].value.trim() !== '') {
      updatedEntries.push({ key: Date.now(), value: '' });
    }

    setEntries(updatedEntries);

    // Adjust the height of the current textarea
    adjustTextAreaHeight(inputRefs.current[index]);
  };

  const handleBlur = () => {
    const nonEmptyEntries = entries.filter((entry, index) => 
      entry.value.trim() !== '' || index === entries.length - 1
    );
    setEntries(nonEmptyEntries);
    handleSaveEntry(new Date(date), nonEmptyEntries);
  };

  useEffect(() => {
    if (date) {
      const loadEntries = async () => {
        const initialEntries = await getEntriesForDate(new Date(date));
        setEntries(initialEntries);
      };
      loadEntries();
    }
  }, [date, getEntriesForDate]);

  useEffect(() => {
    if (focusIndex !== null) {
      focusInput(focusIndex);
      setFocusIndex(null);
    }
  }, [entries, focusIndex]);

  useEffect(() => {
    // Adjust height for all textareas on initial load
    entries.forEach((_, index) => {
      if (inputRefs.current[index]) {
        adjustTextAreaHeight(inputRefs.current[index]);
      }
    });
  }, [entries]);

  return (
    <div className="bullet-container">
      {entries.map((entry, index) => (
        <div key={entry.key} className="bullet-item">
          <textarea
            ref={el => inputRefs.current[index] = el}
            className="text-input"
            value={entry.value}
            onChange={e => handleEntryChange(entry.key, e.target.value, index)}
            onKeyDown={e => handleKeyActions(entry.key, e, index)}
            onBlur={handleBlur}
            placeholder="New Bullet Point..."
            rows={1}
            style={{ overflowY: 'auto' }} // Allow vertical scrollbar
          />
        </div>
      ))}
    </div>
  );
}

export default BulletTextArea;