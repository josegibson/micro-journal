import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FaJournalWhills, FaPen, FaCog, FaHome, FaCheckSquare } from "react-icons/fa";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      {[
        { path: "/new-entry", icon: <FaPen size={20} />, label: "New Entry" },
        { path: "/todos", icon: <FaCheckSquare size={20} />, label: "Todos" },
        { path: "/journals", icon: <FaJournalWhills size={20} />, label: "Journals" },
        { path: "/settings", icon: <FaCog size={20} />, label: "Settings" },
      ].map(({ path, icon, label }) => (
        <Link 
          key={path} 
          className={`navbar-item ${location.pathname === path ? "active" : ""}`} 
          to={path}
        >
          {icon}
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

export default Navbar;
