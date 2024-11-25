import React from "react";
import BulletTextArea from "../components/BulletTextArea";
import { format, parse, isValid } from "date-fns";
import { useParams, Navigate } from "react-router-dom";
import { useUser } from "../providers/UserProvider";
import { JournalProvider } from '../providers/JournalProvider';

function NewEntry() {
  const { user } = useUser();
  const { date } = useParams();
  let formattedDate;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (date) {
    const parsedDate = parse(date, "yyyy-MM-dd", new Date());
    if (isValid(parsedDate)) {
      formattedDate = format(parsedDate, "yyyy-MM-dd");
    } else {
      console.warn(`Invalid date format received: "${date}". Falling back to current date.`);
      formattedDate = format(new Date(), "yyyy-MM-dd");
    }
  } else {
    formattedDate = format(new Date(), "yyyy-MM-dd");
  }

  return (
    <div className="page entry">
      <div className="entry-header">
        <h2>Good Morning, {user.username}!</h2>
        <label>{format(new Date(formattedDate), "dd MMM EEEE")}</label>
      </div>
      <div className="entry-content">
        <BulletTextArea date={formattedDate} />
      </div>
    </div>
  );
}

export default NewEntry;
