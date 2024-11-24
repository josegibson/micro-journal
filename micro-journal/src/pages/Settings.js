import React, { useContext } from 'react';
import { JournalContext } from '../components/JournalProvider';

function Settings() {
  const { theme, toggleTheme } = useContext(JournalContext);

  return (
    <div className="page">
      <h1>Settings</h1>
      <p>Adjust your preferences here.</p>
    </div>
  );
}

export default Settings;
