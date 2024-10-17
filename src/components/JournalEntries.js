import React from 'react';

const journalEntries = [
  { id: 1, content: "Today I felt great!", emotion: "happy" },
  { id: 2, content: "A bit stressed about work.", emotion: "stressed" },
];

function JournalEntries() {
  return (
    <div className="journal-entries">
      <h2>Your Journal Entries</h2>
      <ul>
        {journalEntries.map(entry => (
          <li key={entry.id}>
            {entry.content} <span>({entry.emotion})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JournalEntries;
