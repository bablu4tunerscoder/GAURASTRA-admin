import React from "react";
import "./Home.scss";
import { useNavigate } from "react-router-dom";

const HomeComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">

      {/* FIXED NAVBAR */}
      <header className="top-navbar" role="banner">
        <div className="brand">4Tuners Admin</div>
      </header>

      {/* CARDS SECTION */}
      <div className="dashboard-cards">

        {/* ONLINE ADMIN CARD */}
        <div
          className="admin-card"
          onClick={() => navigate("/NewProduct")}
        >
          <div className="icon-circle">
            <i className="fas fa-globe"></i>
          </div>
          <h2>Online Admin</h2>
          <p>Manage online products, categories, banners & offers</p>
          <button className="card-btn">Open Online Admin</button>
        </div>

        {/* OFFLINE ADMIN CARD */}
        <div className="admin-card"
                  onClick={() => navigate("/AddProduct")}
>
          <div className="icon-circle offline">
            <i className="fas fa-store"></i>
          </div>
          <h2>Offline Admin</h2>
          <p>Manage offline stock, orders & store operations</p>
          <button className="card-btn">Open Offline Admin</button>
        </div>

      </div>
    </div>
  );
};

export default HomeComponent;
