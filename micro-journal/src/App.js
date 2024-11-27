import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./providers/AppProvider";

import JournalEntries from "./pages/Journals";
import NewEntry from "./pages/NewEntry";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";

function AppContent() {
  useEffect(() => {
    document.body.className = 'dark-mode';
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="d-flex flex-row">
                <Navbar />
                <div className="page-container">
                  <Routes>
                    <Route path="/" element={<NewEntry />} />
                    <Route path="/new-entry" element={<NewEntry />} />
                    <Route path="/journals" element={<JournalEntries />} />
                    <Route path="/:date" element={<NewEntry />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile" element={<Profile />} /> 
                  </Routes>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
