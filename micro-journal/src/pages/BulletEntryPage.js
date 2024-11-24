import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBulletEntries } from '../components/useBulletEntries';

function BulletEntryPage() {
  const { date, index } = useParams();
  const navigate = useNavigate();
  const parsedIndex = parseInt(index, 10);
  const textareaRef = useRef(null);
  
  const { 
    entries, 
    handleEntryChange, 
    handleKeyActions 
  } = useBulletEntries(date);

  const currentEntry = entries[parsedIndex] || { key: Date.now(), value: '' };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currentEntry.value]);

  const handleSave = () => {

    handleKeyActions(currentEntry.key, { key: 'Enter', preventDefault: () => {} });

    navigate(-1);
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
        value={currentEntry.value}
        onChange={e => handleEntryChange(currentEntry.key, e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="New Bullet Point..."
        rows={1}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default BulletEntryPage; 