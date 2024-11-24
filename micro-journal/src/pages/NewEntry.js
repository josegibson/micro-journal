import BulletTextArea from "../components/BulletTextArea";
import { format, parse, isValid } from "date-fns";
import { useParams } from "react-router-dom";

function NewEntry() {

  const { date } = useParams();
  let parsedDate = date ? parse(date, "yyyy-MM-dd", new Date()) : new Date();

  if (!isValid(parsedDate)) {
    console.warn(`Invalid date format received: "${date}". Falling back to current date.`);
    parsedDate = new Date();
  }

  console.log("Parsed Date:", parsedDate);

  return (
    <div className="page entry">
      <h4>{format(parsedDate, "dd MMM")}</h4>
      <h1>{format(parsedDate, "EEEE")}</h1>
      <br />
      <BulletTextArea date={parsedDate} />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default NewEntry;
