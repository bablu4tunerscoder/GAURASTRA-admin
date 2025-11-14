import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEditMode } from "../../Redux/Slices/productSlice";
import "./sidebar.scss";

const Sidebar = () => {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // ✅ Outside Click Handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const menuItems = [
    { title: "Add Product", category: "QUICK LINKS", path: "/" },
    { title: "Categories", category: "QUICK LINKS", path: "/category" },
    { title: "Subcategories", category: "QUICK LINKS", path: "/sub_category" },
    { title: "create coupon", category: "QUICK LINKS", path: "/Coupons" },
    {
      title: "create OfferBanner",
      category: "QUICK LINKS",
      path: "/OfferBanner",
    },
    {
      title: "Landing Page Editor",
      category: "QUICK LINKS",
      path: "/LandingEditor",
    },
    { title: "User Management", category: "CATALOG", path: "/users" },
    { title: "Product List", category: "CATALOG", path: "/products" },
    { title: "Download QR Code", category: "CATALOG", path: "/DownloadQR" },
    { title: "Blog Posts", category: "CATALOG", path: "/blogs" },
    {
      title: "Landing Page History",
      category: "CATALOG",
      path: "/lp-uploads-history",
    },
    {
      title: "Offer Banner History",
      category: "CATALOG",
      path: "/OfferBannerHistory",
    },
    { title: "Order Management", category: "SALE", path: "/OrderList" },
    { title: "Coupon Leads", category: "SALE", path: "/leads" }, // ✅ ADD THIS NEW LINK
  ];

  return (
    <div className="page-container">
      <nav className="navbar">
        <button className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>
      </nav>

      {/* ✅ ref attached */}
      <div className={`sidebar ${isOpen ? "open" : ""}`} ref={sidebarRef}>
        <nav className="sidebar-nav">
          {menuItems
            .filter((item) => item.title.toLowerCase().includes(searchTerm))
            .map((item, index) => (
              <React.Fragment key={index}>
                {index === 0 ||
                menuItems[index - 1].category !== item.category ? (
                  <div className="sidebar-header">
                    <h2>{item.category}</h2>
                  </div>
                ) : null}
                <ul className="sidebar-menu">
                  <li>
                    <NavLink
                      to={item.path}
                      className="sidebar-link"
                      onClick={() => {
                        if (item.title === "New Product") {
                          dispatch(setEditMode(false));
                        }
                        // 🧠 Optional: Auto-close on link click
                        setIsOpen(false);
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
    </div>
  );
};

export default Sidebar;