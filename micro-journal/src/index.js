import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/css/index.css";
import App from "./App";
import { JournalProvider } from "./providers/JournalProvider";
import { UserProvider } from "./providers/UserProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <JournalProvider>
        <App />
      </JournalProvider>
    </UserProvider>
  </React.StrictMode>
);
