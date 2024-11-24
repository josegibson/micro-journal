// src/components/BulletTextArea.js
import React, { useRef, useEffect, useContext } from "react";
import { JournalContext } from './JournalProvider';
import { useNavigate } from 'react-router-dom';


// Split handlers into custom hook for better organization
const useBulletEntries = (initialEntries, onSave) => {
  const inputRefs = useRef([]);
  
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

  const handleEntryChange = (index, value) => {
    const updatedEntries = [...initialEntries];
    updatedEntries[index] = value;
    onSave(updatedEntries);
  };

  const handleKeyActions = (index, event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (initialEntries[index].trim()) {
        const updatedEntries = [...initialEntries];
        updatedEntries[index] = initialEntries[index].trim();
        if (index === initialEntries.length - 1) {
          updatedEntries.push('');
        }
        onSave(updatedEntries);
        focusInput(index + 1);
      }
    } else if (event.key === "Backspace" && initialEntries[index] === "" && index > 0) {
      event.preventDefault();
      const updatedEntries = initialEntries.filter((_, i) => i !== index);
      onSave(updatedEntries);
      focusInput(index - 1);
    }
  };

  return {
    inputRefs,
    handleEntryChange,
    handleKeyActions,
  };
};

function BulletTextArea() {
  const navigate = useNavigate();
  const { journals, handleSaveEntry } = useContext(JournalContext);
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];
  const entries = journals[formattedToday] || [''];

  const { inputRefs, handleEntryChange, handleKeyActions } = useBulletEntries(
    entries,
    (updatedEntries) => handleSaveEntry(today, updatedEntries)
  );

  // Auto-adjust height effect
  useEffect(() => {
    inputRefs.current.forEach(textarea => {
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    });
  }, [entries]); // Only re-run when entries change

  const handleFocus = (index) => {
    if (window.innerWidth <= 768) { // Only navigate on mobile devices
      navigate(`/entry/${formattedToday}/${index}`);
    } else {
      inputRefs.current[index].focus(); // Focus the textarea directly on desktops
    }
  };

  const handleBlur = (index) => {
    // Check if the last entry is not empty and add a new empty entry
    if (index === entries.length - 1 && entries[index].trim() !== '') {
      const updatedEntries = [...entries, ''];
      handleSaveEntry(today, updatedEntries);
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
            onBlur={() => handleBlur(index)}
            placeholder="New Bullet Point..."
            rows={1}
          />
        </div>
      ))}
    </div>
  );
}

export default BulletTextArea;