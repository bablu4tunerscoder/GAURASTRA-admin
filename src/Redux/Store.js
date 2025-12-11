import { configureStore } from "@reduxjs/toolkit";
import userReducer, { userApi } from "./Slices/userSlice";   // ⬅ RTK Query API included
import mediaReducer from "./Slices/mediaSlice";
import categoryReducer from "./Slices/categorySlice";
import subcategoryReducer from "./Slices/subcategorySlice";
import productReducer from "./Slices/productSlice";
import BlogSliceReducer from "./Slices/BlogSlice";
import OrderSliceReducer from "./Slices/orderSlice";
import landingReducer from "./Slices/landingSlice";
import couponsReducer from "./Slices/couponSlice";
import offerBannerReducer from "./Slices/offerBannerSlice";
import leadReducer from "./Slices/leadSlice";
import offlineProductReducer from "./Slices/offlineProductSlice";
import offlineUserReducer from "./Slices/offlineUserSlice";
import dashboardReducer from "./Slices/dashboardSlice";

const store = configureStore({
  reducer: {
    blog: BlogSliceReducer,
    category: categoryReducer,
    media: mediaReducer,
    order: OrderSliceReducer,
    product: productReducer,
    subcategory: subcategoryReducer,
    user: userReducer,
    landing: landingReducer,
    coupon: couponsReducer,
    offerBanner: offerBannerReducer,
    leads: leadReducer,
    offlineProducts: offlineProductReducer,
    offlineUser: offlineUserReducer,
    dashboard: dashboardReducer,

    // ⬇️ Add RTK Query API Reducer
    [userApi.reducerPath]: userApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),  // ⬅ Add RTK Query middleware
});

export default store;
