import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import JournalEntries from "./components/JournalEntries";
import NewEntry from "./components/NewEntry";
import Settings from "./components/Settings";
import Navbar from "./components/Navbar";
import { JournalContext } from "./components/JournalProvider";

function App() {
  const today = new Date();

  return (
    <Router>
      <div className="row">
        <div className="col-3">
          <Navbar />
        </div>
        <div className="col-9 content">
          <Routes>
            <Route path="/journals" element={<JournalEntries />} />
            <Route path="/new-entry/:date?" element={<NewEntry date={today}/>} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
