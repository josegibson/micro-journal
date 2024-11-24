// src/components/BulletTextArea.js
import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useBulletEntries } from '../hooks/useBulletEntries';

function BulletTextArea({ date }) {
  const navigate = useNavigate();
  const { 
    entries, 
    inputRefs, 
    handleEntryChange, 
    handleKeyActions,
    focusInput 
  } = useBulletEntries(date);

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
      focusInput(0);
    }
  }, []);

  const handleFocus = (key) => {
    const index = entries.findIndex(entry => entry.key === key);
    if (window.innerWidth <= 768) {
      navigate(`/entry/${date}/${index}`);
    } else {
      focusInput(index);
    }
  };

  return (
    <div className="bullet-container">
      {entries.map((entry, index) => (
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