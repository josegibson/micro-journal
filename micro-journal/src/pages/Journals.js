import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { JournalContext } from "../components/JournalProvider";
import { format } from "date-fns";

const JournalEntries = () => {
  const { journals } = useContext(JournalContext);
  const navigate = useNavigate();

  const handleCardClick = (date) => {
    navigate(`/${date}`);
  };

  const sortedDates = Object.keys(journals).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="page">
      <h1 className="heading">Journal</h1>
      {sortedDates.length === 0 ? (
        <p>No journal entries available.</p>
      ) : (
        sortedDates.map((date) => {
          const nonEmptyEntries = journals[date].filter(entry => entry.value.trim() !== '');
          
          if (nonEmptyEntries.length === 0) return null;
          
          return (
            <div
              key={date}
              className="card"
              onClick={() => handleCardClick(date)}
              style={{ cursor: "pointer" }}
            >
              <h5>{format(new Date(date), "EEE, dd MMM")}</h5>
              <ul>
                {nonEmptyEntries.map((entry) => (
                  <li key={entry.key}>{entry.value.trim()}</li>
                ))}
              </ul>
            </div>
          );
        }).filter(Boolean)
      )}
    </div>
  );
};

export default JournalEntries;