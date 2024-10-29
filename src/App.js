import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JournalEntries from "./pages/Journals";
import NewEntry from "./pages/NewEntry";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";

function App() {
  const today = new Date();

  return (
    <Router>
      <div className="row">
        <div className="col-3">
          <Navbar />
        </div>
        <div className="col-6">
          <Routes>
          <Route
              path="/"
              element={<NewEntry date={today} />}
            />
            <Route path="/journals" element={<JournalEntries />} />
            <Route
              path="/new-entry/:date?"
              element={<NewEntry date={today} />}
            />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
