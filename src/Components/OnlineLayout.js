import React from "react";
import Sidebar from "../Components/Sidebar/sidebar";

const OnlineLayout = ({ children }) => {
  return (
    <div className="layout-container">
      <Sidebar />  {/* Online Sidebar */}
      <div className="content-area">{children}</div>
    </div>
  );
};

export default OnlineLayout;
