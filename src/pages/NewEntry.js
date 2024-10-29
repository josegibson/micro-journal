import BulletTextArea from "../components/BulletTextArea";
import { format, parse } from "date-fns";
import { useParams } from "react-router-dom";

function NewEntry() {

  const { date: dateParam } = useParams();
  const date = dateParam ? parse(dateParam, "yyyy-MM-dd", new Date()) : new Date();

  
  console.log("dateParam:", dateParam);


  return (
    <div className="content center-active">
      <div className="entry-header">
        <h4>{format(date, "dd MMM")}</h4>
        <h1>{format(date, "EEEE")}</h1>
      </div>
      <BulletTextArea date={date} />
      <div className="dummy-container "></div>
    </div>
  );
}

export default NewEntry;
