import React, { useState } from "react";
import "./Home.scss";
import NewProduct from "../product/newproduct";

const HomeComponent = () => {
  const [chunaTab, setChunaTab] = useState("online");

  return (
    <div className="home-wrapper">
      {/* FIXED NAVBAR */}
      <header className="top-navbar" role="banner">
        <div className="brand">4Tuners Admin</div>

        <nav className="tabs" role="navigation" aria-label="Admin tabs">
          <button
            aria-pressed={chunaTab === "online"}
            className={`tab-btn ${chunaTab === "online" ? "active" : ""}`}
            onClick={() => setChunaTab("online")}
          >
            Online Admin
          </button>

          <button
            aria-pressed={chunaTab === "offline"}
            className={`tab-btn ${chunaTab === "offline" ? "active" : ""}`}
            onClick={() => setChunaTab("offline")}
          >
            Offline Admin
          </button>
        </nav>
      </header>

      {/* CONTENT BELOW NAVBAR */}
      <div className="content-area">
        {chunaTab === "online" && <NewProduct />}
        {chunaTab === "offline" && <h2 style={{ padding: "20px" }}>Offline Page Coming Soon...</h2>}
      </div>
    </div>
  );
};

export default HomeComponent;
