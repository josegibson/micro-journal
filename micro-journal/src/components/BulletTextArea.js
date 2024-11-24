// src/components/BulletTextArea.js
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { useBulletEntries } from './useBulletEntries';
import { JournalContext } from './JournalProvider';

function BulletTextArea({ date }) {
  const navigate = useNavigate();
  const { getEntriesForDate } = useContext(JournalContext);
  const [entries, setEntries] = useState(() => getEntriesForDate(new Date(date)));
  const { inputRefs, handleEntryChange, handleKeyActions } = useBulletEntries(date, entries, setEntries);

  useEffect(() => {
    inputRefs.current.forEach(textarea => {
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    });
  }, [entries]);

  const handleFocus = (index) => {
    if (window.innerWidth <= 768) {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      navigate(`/entry/${formattedDate}/${index}`);
    } else {
      inputRefs.current[index].focus();
    }
  };

  return (
    <div className="bullet-container">
      {entries.map((entry, index) => (
        <div key={index} className="bullet-item">
          <textarea
            ref={el => inputRefs.current[index] = el}
            className="text-input"
            value={entry}
            onChange={e => handleEntryChange(index, e.target.value)}
            onKeyDown={e => handleKeyActions(index, e)}
            onFocus={() => handleFocus(index)}
            placeholder="New Bullet Point..."
            rows={1}
          />
        </div>
      ))}
    </div>
  );
}

export default BulletTextArea;