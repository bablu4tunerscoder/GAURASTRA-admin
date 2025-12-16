import { Outlet } from "react-router-dom";
import OfflineSidebar from "../offline-admin/components/OfflineSidebar";
import Navbar from "./Navbar";

const OnlineLayout = () => {
  return (
    <div className="flex max-h-[100dvh] overflow-hidden">

      {/* Sidebar - scrollable independently */}
      <div className="w-[300px] bg-[#131720] flex-shrink-0 overflow-y-auto">
        <OfflineSidebar onLinkClick={() => { }} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Navbar - fixed inside main content */}
        <Navbar />

        {/* Scrollable Outlet */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default OnlineLayout;
