import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import store from "./Redux/Store";

import NewProduct from "./product/newproduct";
import ProductTable from "./product/product";
import OrderList from "./Order/OrderList";
import CategoryList from "./Category/CategoryList";
import SubCategoryList from "./SubCategory/SubCategoryList";
import UsersList from "./User/UsersList";
import UserDetails from "./User/UserDetails";
import BlogList from "./Blogs/BlogList";
import BlogDescription from "./Blogs/BlogDescription";
import CreateBlog from "./Blogs/CreateBlog";
import EditBlog from "./Blogs/EditBlog";
import LandingEditor from "./Components/Landing_Page/LandingEditor";
import LPUploadsHistory from "./Components/Landing_Page/LPUploadsHistory";
import CouponsList from "./Coupons/CouponsList";
import OfferBannerForm from "./Components/OfferBannerForm";
import OfferBannerHistory from "./Components/OfferBannerHistory";
import DownloadQR from "./product/DownloadQR";
import LeadsList from "./Components/LeadsList";
import AddProduct from "./offline-admin/pages/AddProduct";
import OfflineProductTable from "./offline-admin/pages/OfflineProductTable";
import CreateWorkerAccount from "./offline-admin/components/CreateAccount";
import WorkerList from "./offline-admin/components/WorkerList";
import HomeComponent from "./Components/home";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Blog Routes */}
          <Route path="/blogs" element={<BlogList />}></Route>
          <Route path="/blog/description" element={<BlogDescription />}></Route>
          <Route path="/blog/edit/:id" element={<EditBlog />}></Route>
          <Route path="/blog/create" element={<CreateBlog />}></Route>

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
          <Route path="/NewProduct" element={<NewProduct />} />
          <Route path="/" element={<HomeComponent />} />
          <Route path="/OrderList" element={<OrderList />} />
          <Route path="/LandingEditor" element={<LandingEditor />} />
          <Route path="/lp-uploads-history" element={<LPUploadsHistory />} />
          <Route path="/AddProduct" element={<AddProduct />} />
          <Route path="/OffProductTable" element={<OfflineProductTable />} />
          <Route path="/create-worker" element={<CreateWorkerAccount />} />
          <Route path="/all-workers" element={<WorkerList />} />

          {/* ✅ ADD THIS NEW ROUTE */}
          <Route path="/leads" element={<LeadsList />} />

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;