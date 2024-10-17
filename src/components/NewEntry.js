import React, { useState, useRef, useEffect } from 'react';

function NewEntry({ handleSaveEntry: parentHandleSaveEntry }) {
  const [entries, setEntries] = useState(['']);
  const inputRefs = useRef([]);

  const handleSaveEntry = (index) => {
    if (entries[index].trim() !== '') {
      if (index === entries.length - 1) {
        setEntries([...entries, '']);
      }
      // Call the parent handleSaveEntry function
      parentHandleSaveEntry(entries);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default action (new line)
      handleSaveEntry(index);
      // Move focus to the next item
      setTimeout(() => {
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
        }
      }, 0);
    } else if (event.key === 'Backspace' && entries[index] === '') {
      event.preventDefault(); // Prevent the default action (deleting)
      if (index > 0) {
        inputRefs.current[index - 1].focus();
        setEntries(entries.filter((_, i) => i !== index));
      }
    }
  };

  const handleChange = (index, event) => {
    const newEntries = [...entries];
    newEntries[index] = event.target.value;
    setEntries(newEntries);
    adjustHeight(event.target);
  };

  const adjustHeight = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    // Ensure the last input is always focused if it's empty
    if (entries.length > 0 && entries[entries.length - 1] === '') {
      inputRefs.current[entries.length - 1].focus();
    }
  }, [entries]);

  return (
    <div className="new-entry">
      <div className="new-entry-title">
        <h4 className='date'>Today's date</h4>
        <h2 className='day'>Weekday</h2>
      </div>
      <ul className="bullet-list">
        {entries.map((entry, index) => (
          <li key={index}>
            <textarea
              ref={el => inputRefs.current[index] = el}
              className='text-input'
              value={entry}
              onChange={(e) => handleChange(index, e)}
              onBlur={() => handleSaveEntry(index)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              placeholder="New thing"
              rows={1} // Initial number of rows
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NewEntry;