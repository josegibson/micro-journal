import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { JournalContext } from "../components/JournalProvider";
import { FaCheck } from "react-icons/fa";

function BulletEntryPage() {
  const { date, index } = useParams();
  const navigate = useNavigate();
  const { journals, handleSaveEntry } = useContext(JournalContext);
  const [entry, setEntry] = useState(journals[date]?.[index] || "");
  const textareaRef = useRef(null);

  const handleSave = () => {
    if (!journals[date]) {
      journals[date] = [''];
    }
    const updatedEntries = [...journals[date]];
    updatedEntries[index] = entry;

    if (updatedEntries[updatedEntries.length - 1].trim() !== '') {
      updatedEntries.push('');
    }

    handleSaveEntry(new Date(date), updatedEntries);
    console.log("Entry saved:", updatedEntries); // Debugging log
    navigate(`/${date}`); // Navigate directly to the NewEntry page for the specific date
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = `${textarea.scrollHeight + 10}px`; // Set to scroll height
    }
  };

  useEffect(() => {
    adjustTextareaHeight(); // Adjust height on initial render
    if (textareaRef.current) {
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length); // Set cursor to the end
    }
  }, [entry]);

  return (
    <div className="fullscreen-textarea">
      <textarea
        ref={textareaRef}
        value={entry}
        onChange={(e) => {
          setEntry(e.target.value);
          adjustTextareaHeight(); // Adjust height on change
        }}
        autoFocus
        placeholder="Write your entry here..."
      />
      <button onClick={handleSave}>
        <FaCheck fontSize={16} />
      </button>
    </div>
  );
}

export default BulletEntryPage; 