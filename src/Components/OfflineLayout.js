import React from "react";
import OfflineSidebar from "../offline-admin/components/OfflineSidebar";

const OfflineLayout = ({ children }) => {
  return (
    <div className="layout-container">
      <OfflineSidebar />  {/* Offline Sidebar */}
      <div className="content-area">{children}</div>
    </div>
  );
};

export default OfflineLayout;
