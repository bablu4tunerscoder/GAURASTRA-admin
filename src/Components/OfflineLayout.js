import { Outlet } from "react-router-dom";
import OfflineSidebar from "../offline-admin/components/OfflineSidebar";
import Navbar from "./Navbar";

const OfflineLayout = () => {
  return (
    <div className="flex max-h-[100dvh] overflow-hidden">

      {/* Sidebar - scrollable independently */}
      <div className="w-[300px] bg-[#131720] mt-[60px] flex-shrink-0 overflow-y-auto">
        <OfflineSidebar onLinkClick={() => { }} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Navbar - fixed inside main content */}
        <div className="fixed top-0 left-[300px] right-0 h-[60px] z-50 bg-white shadow">
          <Navbar />
        </div>

        {/* Scrollable Outlet */}
        <div className="flex-1 mt-[60px] overflow-y-auto p-6">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default OfflineLayout;
