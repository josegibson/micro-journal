import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { JournalContext } from "../components/JournalProvider";
import { format } from "date-fns";

const JournalEntries = () => {
  const { journals } = useContext(JournalContext);
  const navigate = useNavigate();

  const handleCardClick = (date) => {
    const formattedDate = format(new Date(date), "yyyy-MM-dd"); // Ensure correct format
    navigate(`/new-entry/${formattedDate}`);
  };
  

  return (
    <div className="text-center">
      <h1>Journal</h1>
      {Object.keys(journals).length === 0 ? (
        <p>No journal entries available.</p>
      ) : (
        Object.keys(journals).map((date) => (
          <div
            key={date}
            className="card"
            onClick={() => handleCardClick(date)}
            style={{ cursor: "pointer" }}
          >
            <div className="entry-header">
              <h3>{format(new Date(date), "EEE, dd MMM")}</h3>
            </div>
            <ul>
              {journals[date].map((entry, index) => {
                const trimmedEntry = entry.trim();
                if (!trimmedEntry) return null; // Skip empty entries
                return <li key={index}>{trimmedEntry}</li>;
              })}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default JournalEntries;