// App.jsx
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./auth/Login";
import BlogDescription from "./Blogs/BlogDescription";
import BlogList from "./Blogs/BlogList";
import CreateBlog from "./Blogs/CreateBlog";
import EditBlog from "./Blogs/EditBlog";
import CategoryList from "./Category/CategoryList";
import HomeComponent from "./Components/home";
import LandingEditor from "./Components/Landing_Page/LandingEditor";
import LPUploadsHistory from "./Components/Landing_Page/LPUploadsHistory";
import LeadsList from "./Components/LeadsList";
import OfferBannerForm from "./Components/OfferBannerForm";
import OfferBannerHistory from "./Components/OfferBannerHistory";
import OfflineLayout from "./Components/OfflineLayout";
import OnlineLayout from "./Components/OnlineLayout";
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
import ProtectedRoute from "./ProtectedRoute";
import store from "./Redux/Store";
import SubCategoryList from "./SubCategory/SubCategoryList";
import UserDetails from "./User/UserDetails";
import UsersList from "./User/UsersList";

export const onlineAdminRoutes = [
  { path: "/OnlineAdmin", element: <HomeComponent /> },
  { path: "/NewProduct", element: <NewProduct /> },
  { path: "/edit-product/:id", element: <NewProduct /> },
  { path: "/blog/description", element: <BlogDescription /> },

  { path: "/blogs", element: <BlogList /> },
  { path: "/blog/create", element: <CreateBlog /> },
  { path: "/blog/edit/:id", element: <EditBlog /> },
  { path: "/users", element: <UsersList /> },
  { path: "/users/:id", element: <UserDetails /> },
  { path: "/DownloadQR", element: <DownloadQR /> },
  { path: "/products", element: <ProductTable /> },
  { path: "/OfferBanner", element: <OfferBannerForm /> },
  { path: "/OfferBannerHistory", element: <OfferBannerHistory /> },
  { path: "/category", element: <CategoryList /> },
  { path: "/Coupons", element: <CouponsList /> },
  { path: "/sub_category", element: <SubCategoryList /> },
  { path: "/OrderList", element: <OrderList /> },
  { path: "/LandingEditor", element: <LandingEditor /> },
  { path: "/lp-uploads-history", element: <LPUploadsHistory /> },
  { path: "/leads", element: <LeadsList /> },
];


function App() {

  return (
    <Provider store={store}>
      <Toaster />
      <BrowserRouter>
        <Navbar />
        <div className="page-wrapper">
          <Routes>
            {/* Blog Routes */}
              <Route path="/" element={<Navigate to="/OnlineAdmin" replace />} />
            <Route path="/blogs" element={<BlogList />}></Route>
            <Route path="/blog/description" element={<OnlineLayout><BlogDescription /></OnlineLayout>}></Route>
            <Route path="/blog/edit/:id" element={<EditBlog />}></Route>
            <Route path="/blog/create" element={<CreateBlog />}></Route>
            <Route path="/sidebar" element={<Sidebar />} ></Route>
            {/* User Routes */}
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/:id" element={<UserDetails />} />

            {/* Main Routes */}
            <Route path="/DownloadQR" element={<DownloadQR />} />
            <Route path="/products" element={<ProductTable />} />
            <Route path="/OfferBanner" element={<OfferBannerForm />} />
            <Route path="/OfferBannerHistory" element={<OfferBannerHistory />} />
            <Route path="/category" element={<CategoryList />} />
            <Route path="/Coupons" element={<CouponsList />} />
            <Route path="/sub_category" element={<SubCategoryList />} />
            <Route path="/NewProduct" element={<OnlineLayout><NewProduct /></OnlineLayout>} />
            <Route path="/OnlineAdmin" element={<OnlineLayout><HomeComponent /></OnlineLayout>} />
            <Route path="/OrderList" element={<OrderList />} />
            <Route path="/LandingEditor" element={<LandingEditor />} />
            <Route path="/lp-uploads-history" element={<LPUploadsHistory />} />
            <Route path="/OfflineAdmin" element={<OfflineLayout><Dashboard /></OfflineLayout>} />
            <Route path="/AddProduct" element={<OfflineLayout><AddProduct /></OfflineLayout>} />
            <Route path="/OffProductTable" element={<OfflineLayout><OfflineProductTable /></OfflineLayout>} />
            <Route path="/create-worker" element={<OfflineLayout><CreateWorkerAccount /></OfflineLayout>} />
            <Route path="/all-workers" element={<OfflineLayout><WorkerList /></OfflineLayout>} />

            {/* ✅ ADD THIS NEW ROUTE */}
            <Route path="/leads" element={<LeadsList />} />

        </Routes>

      </BrowserRouter>
    </Provider>
  );
}

export default App;