import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./providers/AppProvider";

import JournalEntries from "./pages/Journals";
import NewEntry from "./pages/NewEntry";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import Todos from "./pages/Todos";
import NotFound from "./pages/NotFound";

function AppContent() {
  useEffect(() => {
    document.body.className = 'dark-mode';
  }, []);

  return (
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
                  <Route path="/todos" element={<Todos />} />
                  <Route path="/:date" element={<NewEntry />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile />} /> 
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  const basename = process.env.PUBLIC_URL || '';
  
  return (
    <Router basename={basename}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}

export default App;
