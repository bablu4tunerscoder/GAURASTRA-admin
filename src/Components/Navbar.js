import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="top-navbar">

      <div className="brand">4Tuners Admin</div>

      <nav className="nav-tabs">
        <button onClick={() => navigate("/")}>Online Admin</button>
        <button onClick={() => navigate("/Dashboard")}>Offline Admin</button>
      </nav>

    </header>
  );
};

export default Navbar;
