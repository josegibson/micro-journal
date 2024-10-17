import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <h2>Micro Journaling</h2>
      <ul className="navbar-links">
        <li>
          <button onClick={() => navigate('/journals')}>Journal Entries</button>
        </li>
        <li>
          <button onClick={() => navigate('/new-entry')}>New Entry</button>
        </li>
        <li>
          <button onClick={() => navigate('/settings')}>Settings</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
