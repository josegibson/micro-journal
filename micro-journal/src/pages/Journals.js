import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { JournalContext } from "../components/JournalProvider";
import { format } from "date-fns";

const JournalEntries = () => {
  const { journals } = useContext(JournalContext);
  const navigate = useNavigate();

  const handleCardClick = (date) => {
    const formattedDate = format(new Date(date), "yyyy-MM-dd"); // Ensure correct format
    navigate(`/${formattedDate}`);
  };


  return (
    <div className="page">
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

            <h5 className="">{format(new Date(date), "EEE, dd MMM")}</h5>
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