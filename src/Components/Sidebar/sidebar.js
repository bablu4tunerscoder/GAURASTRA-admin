import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setEditMode } from "../../Redux/Slices/productSlice";
import "./sidebar.scss";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { permissions, role } = useSelector((state) => state.user?.userData);

  let menuItems = [
    { title: "Add Product", category: "QUICK LINKS", path: "/NewProduct" },
    { title: "Categories", category: "QUICK LINKS", path: "/category" },
    { title: "Subcategories", category: "QUICK LINKS", path: "/sub_category" },
    { title: "create coupon", category: "QUICK LINKS", path: "/Coupons" },
    { title: "create OfferBanner", category: "QUICK LINKS", path: "/OfferBanner" },
    { title: "Landing Page Editor", category: "QUICK LINKS", path: "/LandingEditor" },

    { title: "User Management", category: "CATALOG", path: "/users" },
    { title: "Product List", category: "CATALOG", path: "/products" },
    { title: "Download QR Code", category: "CATALOG", path: "/DownloadQR" },
    { title: "Blog Posts", category: "CATALOG", path: "/blogs" },
    { title: "Landing Page History", category: "CATALOG", path: "/lp-uploads-history" },
    { title: "Offer Banner History", category: "CATALOG", path: "/OfferBannerHistory" },

    { title: "Order Management", category: "SALE", path: "/OrderList" },
    { title: "Coupon Leads", category: "SALE", path: "/leads" },
  ];

  if (role !== "Admin") {
    menuItems = menuItems.filter(item =>
      permissions.some(permission =>
        item.title.toLowerCase().includes(permission.toLowerCase())
      )
    );
  }

  return (
    <div className="sidebar bg-[#131720] h-full overflow-y-auto pt-2">

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>

            {/* Category Header */}
            {index === 0 || menuItems[index - 1].category !== item.category ? (
              <div className="px-4 py-2 text-[12px] font-medium text-white uppercase tracking-wide">
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
                block px-3 py-2 rounded-md font-semibold text-[15px]
                text-white transition-all duration-200
                ${isActive ? "bg-[#42454c] text-gray-300" : ""}
                hover:bg-[#555861] hover:translate-x-1
              `
                  }
                  onClick={() => {
                    if (item.title === "New Product") {
                      dispatch(setEditMode(false));
                    }
                  }}
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

export default Sidebar;
