import { configureStore } from "@reduxjs/toolkit";
import userReducer, { userApi } from "./Slices/userSlice";
import mediaReducer from "./Slices/mediaSlice";
import categoryReducer, { categoryApi } from "./Slices/categorySlice";
import subcategoryReducer from "./Slices/subcategorySlice";
import productReducer, { productApi } from "./Slices/productSlice";
import BlogSliceReducer, { blogApi } from "./Slices/BlogSlice";
import OrderSliceReducer from "./Slices/orderSlice";
import landingReducer from "./Slices/landingSlice";
import couponsReducer, { couponApi } from "./Slices/couponSlice";
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

    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [couponApi.reducerPath]: couponApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(blogApi.middleware)
      .concat(categoryApi.middleware)
      .concat(couponApi.middleware)
      .concat(productApi.middleware),
});

export default store;