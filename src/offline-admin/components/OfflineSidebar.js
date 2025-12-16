import React from "react";
import { NavLink } from "react-router-dom";

const OfflineSidebar = () => {
  const offlineMenu = [
    { title: "Dashboard", path: "/OfflineAdmin", category: "OFFLINE" },
    { title: "Add Offline Product", path: "/AddProduct", category: "OFFLINE" },
    { title: "Offline Product List", path: "/OffProductTable", category: "OFFLINE" },

    { title: "Create Worker", path: "/create-worker", category: "WORKERS" },
    { title: "All Workers", path: "/all-workers", category: "WORKERS" },
  ];

  return (
    <div className="bg-[#131720] min-h-[calc(100vh-60px)] overflow-y-auto pt-2">
      <nav>
        {offlineMenu.map((item, index) => (
          <React.Fragment key={index}>
            {/* Category Header */}
            {index === 0 ||
              offlineMenu[index - 1].category !== item.category ? (
              <div className="px-4 py-2 text-lg font-medium text-white uppercase tracking-wide">
                <h2>{item.category}</h2>
              </div>
            ) : null}

            {/* Menu Item */}
            <ul className="px-4">
              <li className="mb-3">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `
                      block px-2 py-2 capitalize rounded-md font-semibold text-md
                      transition-all duration-200
                      ${isActive ? "bg-[#42454c] text-red-500" : "text-white"}
                      hover:bg-[#555861] hover:translate-x-1
                    `
                  }
                >
                  {item.title}
                </NavLink>
              </li>
            </ul>
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};

export default OfflineSidebar;
