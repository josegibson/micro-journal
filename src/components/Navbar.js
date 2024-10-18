import React, { useState } from "react";
import {
  FaJournalWhills,
  FaPen,
  FaCog,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import NavbarItem from "./NavbarItem"; // Import the NavbarItem component

const navItems = [
  { route: "/new-entry", label: "New Entry", icon: <FaPen size={16} /> },
  {
    route: "/journals",
    label: "Journals",
    icon: <FaJournalWhills size={16} />,
  },

  { route: "/settings", label: "Settings", icon: <FaCog size={16} /> },
];

function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleNavbar = () => setIsExpanded((prev) => !prev);

  return (
    <nav className={`navbar ${isExpanded ? "expanded" : "collapsed"}`}>
      <div className="navbar-content">
        {navItems.map((item, index) => (
          <NavbarItem
            key={index}
            route={item.route}
            label={item.label}
            icon={item.icon}
            isExpanded={isExpanded}
          />
        ))}

        <div className="navbar-toggle">
          <button
            onClick={toggleNavbar}
            aria-label={isExpanded ? "Collapse navbar" : "Expand navbar"}
          >
            {isExpanded ? (
              <FaArrowLeft size={16} />
            ) : (
              <FaArrowRight size={16} />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
