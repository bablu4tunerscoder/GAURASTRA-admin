import React from "react";
import "./Home.scss";

const HomeComponent = () => {
  return (
    <div className="dashboard-container">

      <h1 className="dashboard-title">Welcome to 4Tuners Admin Panel</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders Today</h3>
          <p>3</p>
        </div>

        <div className="stat-card">
          <h3>Total Sales Today</h3>
          <p>₹1200</p>
        </div>

        <div className="stat-card">
          <h3>Total Items Sold</h3>
          <p>3</p>
        </div>

        <div className="stat-card">
          <h3>Top Selling Product</h3>
          <p>Baby T-Shirt (Green, M)</p>
        </div>
      </div>

      <div className="section-title">Today's Orders</div>

      <div className="orders-list">

        <div className="order-card">
          <h4>Order ID: 69302772769c95</h4>
          <p><strong>Name:</strong> Vel odio qui dolor a</p>
          <p><strong>Amount:</strong> ₹400</p>
          <p><strong>Payment:</strong> Card</p>
          <p><strong>Date:</strong> 2025-12-03</p>
        </div>

        <div className="order-card">
          <h4>Order ID: 69302736769c95</h4>
          <p><strong>Name:</strong> Vel odio qui dolor a</p>
          <p><strong>Amount:</strong> ₹400</p>
          <p><strong>Payment:</strong> Card</p>
          <p><strong>Date:</strong> 2025-12-03</p>
        </div>

        <div className="order-card">
          <h4>Order ID: 6930270c769c95</h4>
          <p><strong>Name:</strong> Vel odio qui dolor a</p>
          <p><strong>Amount:</strong> ₹400</p>
          <p><strong>Payment:</strong> Card</p>
          <p><strong>Date:</strong> 2025-12-03</p>
        </div>

      </div>

    </div>
  );
};

export default HomeComponent;
