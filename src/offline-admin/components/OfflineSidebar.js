import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./offlineSidebar.scss";

const OfflineSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Outside Click Close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const offlineMenu = [
    { title: "Dashboard", path: "/Dashboard" },
    { title: "Add Offline Product", path: "/AddProduct" },
    { title: "Offline Product List", path: "/OffProductTable" },
    { title: "Create Worker", path: "/create-worker" },
    { title: "All Workers", path: "/all-workers" },
  ];

  return (
    <div className="offline-page-container">
      <nav className="offline-navbar">
        <button className="offline-toggle" onClick={toggleSidebar}>
          ☰
        </button>
      </nav>

      <div
        className={`offline-sidebar ${isOpen ? "open" : ""}`}
        ref={sidebarRef}
      >
        <nav className="offline-sidebar-nav">
          <div className="offline-header">
            <h2>OFFLINE ADMIN</h2>
          </div>

          <ul className="offline-menu">
            {offlineMenu.map((item, idx) => (
              <li key={idx}>
                <NavLink
                  to={item.path}
                  className="offline-link"
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default OfflineSidebar;
