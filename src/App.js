import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JournalEntries from "./components/JournalEntries";
import NewEntry from "./components/NewEntry";
import Settings from "./components/Settings";
import Navbar from "./components/Navbar";

function App() {


  const handleSaveEntry = (entries) => {
    console.log(`entries = ${entries}`);
  }

  return (
    <Router>
      <div className="row">
        <div className="col-3">
          <Navbar />
        </div>
        <div className="col-9 content">
          <Routes>
            <Route path="/" element={<JournalEntries />} />
            <Route path="/new-entry" element={<NewEntry handleSaveEntry={handleSaveEntry}/>} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
