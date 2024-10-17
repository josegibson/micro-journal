import React, { useRef, useEffect, useContext } from "react";
import { JournalContext } from './JournalProvider';

// Helper to handle text area height adjustment
const adjustHeight = (textarea) => {
  textarea.style.height = 'auto'; // Reset height
  textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scroll height
};

function BulletListInput() {
  const { journals, handleSaveEntry } = useContext(JournalContext);
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];

  // Use inputRefs to manage the focus on the text areas dynamically
  const inputRefs = useRef([]);

  // Retrieve today's journal or initialize with an empty entry
  const entries = journals[formattedToday] || [''];

  // Save entries to context when modified
  const saveEntry = (updatedEntries) => {
    handleSaveEntry(today, updatedEntries);
  };

  // Handle saving and focusing after pressing Enter
  const handleKeyDown = (index, event) => {
    const { key } = event;
    if (key === "Enter") {
      event.preventDefault();
      // Save entry and add a new empty entry if needed
      handleSaveEntryOnEnter(index);
    } else if (key === "Backspace" && entries[index] === "") {
      event.preventDefault();
      handleRemoveEntry(index);
    }
  };

  // Save entry and add a new bullet point
  const handleSaveEntryOnEnter = (index) => {
    if (entries[index].trim()) {
      const updatedEntries = [...entries];
      if (index === entries.length - 1) {
        updatedEntries.push(''); // Add new empty entry if at last entry
      }
      saveEntry(updatedEntries);

      setTimeout(() => {
        inputRefs.current[index + 1]?.focus(); // Move focus to the next item
      }, 0);
    }
  };

  // Handle removing empty entry on Backspace
  const handleRemoveEntry = (index) => {
    if (index > 0) {
      const updatedEntries = entries.filter((_, i) => i !== index); // Remove entry
      saveEntry(updatedEntries);
      setTimeout(() => {
        inputRefs.current[index - 1]?.focus(); // Focus previous item
      }, 0);
    }
  };

  // Handle change in text area input
  const handleChange = (index, event) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = event.target.value;
    saveEntry(updatedEntries);
    adjustHeight(event.target);
  };

  // Focus the last empty entry when updated
  useEffect(() => {
    if (entries.length && entries[entries.length - 1] === "") {
      inputRefs.current[entries.length - 1]?.focus();
    }
  }, [entries]);

  return (
    <ul className="bullet-list">
      {entries.map((entry, index) => (
        <li key={index}>
          <textarea
            ref={(el) => (inputRefs.current[index] = el)}
            className="text-input"
            value={entry}
            onChange={(e) => handleChange(index, e)}
            onBlur={() => handleSaveEntryOnEnter(index)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            placeholder="New Bullet Point..."
            rows={1}
          />
        </li>
      ))}
    </ul>
  );
}

export default BulletListInput;
