import React from "react";
import BulletTextArea from "../components/BulletTextArea";
import { format, parse, isValid } from "date-fns";
import { useParams } from "react-router-dom";
import { useUser } from "../providers/UserProvider";
import { JournalProvider } from '../providers/JournalProvider';

function NewEntry() {
  const { date } = useParams();
  const { user } = useUser();
  let formattedDate;

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
      <h2>Good Morning, {user.username}!</h2>
      <div className="heading">
        <label>{format(new Date(formattedDate), "dd MMM")}</label>
        <h1>{format(new Date(formattedDate), "EEEE")}</h1>
      </div>
      <br />
      <BulletTextArea date={formattedDate} />
      <br />
      <br />
    </div>
  );
}

export default NewEntry;
