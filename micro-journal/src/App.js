import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import JournalEntries from "./pages/Journals";
import NewEntry from "./pages/NewEntry";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";
import BulletEntryPage from "./pages/BulletEntryPage";

function App() {
  return (
    <Router>
      <div className="d-flex flex-row">
        <Navbar />
        <div className="page-container">
          <Routes>
            <Route path="/" element={<NewEntry />} />
            <Route path="/journals" element={<JournalEntries />} />
            <Route path="/:date" element={<NewEntry />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/entry/:date/:index" element={<BulletEntryPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
