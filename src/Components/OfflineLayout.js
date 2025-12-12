import { Outlet } from "react-router-dom";
import OfflineSidebar from "../offline-admin/components/OfflineSidebar";
import Navbar from "./Navbar";
import "./layout.scss"

const OfflineLayout = () => {
  return (
    <div className="layout-container">
      {/* Sidebar */}
      <OfflineSidebar />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OfflineLayout;
