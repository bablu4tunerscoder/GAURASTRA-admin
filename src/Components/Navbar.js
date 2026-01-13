import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../Redux/Slices/userSlice";

const Navbar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("online");

  useEffect(() => {
    if (location.pathname.startsWith("/OfflineAdmin")) {
      setActiveTab("offline");
    } else if (location.pathname.startsWith("/OnlineAdmin")) {
      setActiveTab("online");
    }
  }, [location.pathname]);

  const handleOnline = () => {
    setActiveTab("online");
    navigate("/OnlineAdmin");
  };

  const handleOffline = () => {
    setActiveTab("offline");
    navigate("/OfflineAdmin");
  };

  const handleLogout = () => {
    dispatch(logout());           // clear redux/user data
    navigate("/");                // redirect to home/login
    window.location.reload();     // force full reload
  };




  return (
<<<<<<< HEAD
    <header className="top-navbar">
      <div className="brand">Gaurastra Admin</div>
=======
    <header className="flex items-center justify-between bg-gray-900 p-4 text-white">
      <div className="text-xl font-bold">4Tuners Admin</div>
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6

      <nav className="flex space-x-4">
        <button
          className="bg-red-600 text-white font-bold px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>

        <button
          className={`px-4 py-2 rounded font-medium ${activeTab === "online" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"
            }`}
          onClick={handleOnline}
        >
          Online Admin
        </button>

        <button
          className={`px-4 py-2 rounded font-medium ${activeTab === "offline" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"
            }`}
          onClick={handleOffline}
        >
          Offline Admin
        </button>
      </nav>
    </header>

  );
};

export default Navbar;
