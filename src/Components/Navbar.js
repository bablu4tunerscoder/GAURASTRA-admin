import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("online");

  // जब URL change हो (navigation), तो state update करें सिर्फ offline routes में
  useEffect(() => {
    if (location.pathname.startsWith("/OfflineAdmin")) {
      setActiveTab("offline");
    } else if (location.pathname.startsWith("/OnlineAdmin")) {
      setActiveTab("online");
    }
  }, [location.pathname]);

  const handleOnline = () => {
    setActiveTab("online");
    navigate("/OnlineAdmin");
  };

  const handleOffline = () => {
    setActiveTab("offline");
    navigate("/OfflineAdmin");
  };

  return (
    <header className="top-navbar">
      <div className="brand">4Tuners Admin</div>

<nav className="nav-tabs">
  <button
    className={activeTab === "online" ? "active online" : "online"}
    onClick={handleOnline}
  >
    Online Admin
  </button>

  <button
    className={activeTab === "offline" ? "active offline" : "offline"}
    onClick={handleOffline}
  >
    Offline Admin
  </button>
</nav>

    </header>
  );
};

export default Navbar;
