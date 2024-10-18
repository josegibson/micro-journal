import React from "react";
import { useLocation, Link } from "react-router-dom";

function NavbarItem({ route, label, icon, isExpanded }) {
  const location = useLocation();
  const isActive = location.pathname === route;

  return (
    <div className={`navbar-item ${isActive ? "active" : ""} ${isExpanded ? "expanded" : ""}`}>
      <Link to={route}>
        <div className="icon-box">
          {React.cloneElement(icon)}
        </div>
        {isExpanded && <span>{label}</span>}
      </Link>
    </div>
  );
}

export default NavbarItem;
