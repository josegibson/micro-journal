// src/components/BulletTextArea.js
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { useBulletEntries } from './useBulletEntries';
import { JournalContext } from './JournalProvider';

function BulletTextArea({ date }) {
  const navigate = useNavigate();
  const { getEntriesForDate } = useContext(JournalContext);
  const [entries, setEntries] = useState([]);
  const { inputRefs, handleEntryChange, handleKeyActions } = useBulletEntries(date, entries, setEntries);

  useEffect(() => {
    console.log("Fetching entries for date:", date);
    const initialEntries = getEntriesForDate(new Date(date));
    console.log("Fetched entries:", initialEntries);
    setEntries(initialEntries);
  }, [date, getEntriesForDate]);

  useEffect(() => {
    inputRefs.current.forEach(textarea => {
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    });
  }, [entries]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      const firstTextarea = inputRefs.current[0];
      firstTextarea.focus();
      firstTextarea.setSelectionRange(firstTextarea.value.length, firstTextarea.value.length);
    }
  }, [inputRefs]);

  const handleFocus = (key) => {
    const index = entries.findIndex(entry => entry.key === key);
    if (window.innerWidth <= 768) {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      navigate(`/entry/${formattedDate}/${index}`);
    } else {
      const textarea = inputRefs.current[index];
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      }
    }
  };

  return (
    <div className="bullet-container">
      {entries
        .filter((entry, index) => entry.value !== '' || index === entries.length - 1)
        .map((entry, index) => (
          <div key={entry.key} className="bullet-item">
            <textarea
              ref={el => inputRefs.current[index] = el}
              className="text-input"
              value={entry.value}
              onChange={e => handleEntryChange(entry.key, e.target.value)}
              onKeyDown={e => handleKeyActions(entry.key, e)}
              onFocus={() => handleFocus(entry.key)}
              placeholder="New Bullet Point..."
              rows={1}
            />
          </div>
        ))}
    </div>
  );
}

export default BulletTextArea;