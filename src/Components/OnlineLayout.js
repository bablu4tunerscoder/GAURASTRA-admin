import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../Components/Sidebar/sidebar";
import Navbar from "./Navbar";

const OnlineLayout = () => {

  return (
    <div className="flex">

      {/* Sidebar */}
      <div
        className={`
          h-[calc(100vh-60px)] bg-[#131720]
          transition-all duration-300 z-50
          overflow-hidden
        `}
        style={{ backgroundColor: "#131720" }}
      >
        <Sidebar onLinkClick={() => { }} />
      </div>

      {/* Main Content Area → fills remaining width */}
      <div className=" min-h-screeny"
        style={{
          flex: 1
        }}
      >
        <Navbar />

        <div style={{
          marginTop: "60px"
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OnlineLayout;
