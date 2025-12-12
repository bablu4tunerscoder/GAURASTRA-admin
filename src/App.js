// App.jsx
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import BlogDescription from "./Blogs/BlogDescription";
import BlogList from "./Blogs/BlogList";
import CreateBlog from "./Blogs/CreateBlog";
import EditBlog from "./Blogs/EditBlog";
import CategoryList from "./Category/CategoryList";
import HomeComponent from "./Components/home";
import LandingEditor from "./Components/Landing_Page/LandingEditor";
import LPUploadsHistory from "./Components/Landing_Page/LPUploadsHistory";
import LeadsList from "./Components/LeadsList";
import Navbar from "./Components/Navbar";
import OfferBannerForm from "./Components/OfferBannerForm";
import OfferBannerHistory from "./Components/OfferBannerHistory";
import OfflineLayout from "./Components/OfflineLayout";
import OnlineLayout from "./Components/OnlineLayout";
import Sidebar from "./Components/Sidebar/sidebar";
import CouponsList from "./Coupons/CouponsList";
import CreateWorkerAccount from "./offline-admin/components/CreateAccount";
import Dashboard from "./offline-admin/components/Dashboard";
import WorkerList from "./offline-admin/components/WorkerList";
import AddProduct from "./offline-admin/pages/AddProduct";
import OfflineProductTable from "./offline-admin/pages/OfflineProductTable";
import OrderList from "./Order/OrderList";
import DownloadQR from "./product/DownloadQR";
import NewProduct from "./product/newproduct";
import ProductTable from "./product/product";
import store from "./Redux/Store";
import SubCategoryList from "./SubCategory/SubCategoryList";
import UserDetails from "./User/UserDetails";
import UsersList from "./User/UsersList";
import { Toaster } from "react-hot-toast";
import Login from "./auth/Login";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Provider store={store}>
      <Toaster />
      <BrowserRouter>
        <div className="page-wrapper">
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<Login />} />
            <Route path="/online-admin" element={<Navigate to="/OnlineAdmin" replace />} />

            <Route element={<ProtectedRoute />}>

              {/* ---------------- ONLINE LAYOUT ---------------- */}
              <Route element={<OnlineLayout />}>
                <Route path="/OnlineAdmin" element={<HomeComponent />} />
                <Route path="/NewProduct" element={<NewProduct />} />
                <Route path="/edit-product/:id" element={<NewProduct />} />
                <Route path="/blog/description" element={<BlogDescription />} />
                {/* ---------------- PAGES WITHOUT SPECIFIC LAYOUT ---------------- */}
                <Route path="/blogs" element={<BlogList />} />
                <Route path="/blog/edit/:id" element={<EditBlog />} />
                <Route path="/users" element={<UsersList />} />
                <Route path="/users/:id" element={<UserDetails />} />
                <Route path="/DownloadQR" element={<DownloadQR />} />
                <Route path="/products" element={<ProductTable />} />
                <Route path="/OfferBanner" element={<OfferBannerForm />} />
                <Route path="/OfferBannerHistory" element={<OfferBannerHistory />} />
                <Route path="/category" element={<CategoryList />} />
                <Route path="/Coupons" element={<CouponsList />} />
                <Route path="/sub_category" element={<SubCategoryList />} />
                <Route path="/OrderList" element={<OrderList />} />
                <Route path="/LandingEditor" element={<LandingEditor />} />
                <Route path="/lp-uploads-history" element={<LPUploadsHistory />} />
                <Route path="/leads" element={<LeadsList />} />

              </Route>

              {/* ---------------- OFFLINE LAYOUT ---------------- */}
              <Route element={<OfflineLayout />}>
                <Route path="/OfflineAdmin" element={<Dashboard />} />
                <Route path="/AddProduct" element={<AddProduct />} />
                <Route path="/OffProductTable" element={<OfflineProductTable />} />
                <Route path="/create-worker" element={<CreateWorkerAccount />} />
                <Route path="/all-workers" element={<WorkerList />} />
              </Route>

            </Route>

          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;