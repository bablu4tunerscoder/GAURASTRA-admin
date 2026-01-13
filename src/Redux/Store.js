import { configureStore } from "@reduxjs/toolkit";
import userReducer, { userApi } from "./Slices/userSlice";
import mediaReducer, { mediaApi } from "./Slices/mediaSlice";
import categoryReducer, { categoryApi } from "./Slices/categorySlice";
import subcategoryReducer from "./Slices/subcategorySlice";
import productReducer, { productApi } from "./Slices/productSlice";
import BlogSliceReducer, { blogApi } from "./Slices/BlogSlice";
import OrderSliceReducer, { ordersApi } from "./Slices/orderSlice";
import landingReducer, { landingApi } from "./Slices/landingSlice";
import couponsReducer, { couponApi } from "./Slices/couponSlice";
import offerBannerReducer, { offerBannerApi } from "./Slices/offerBannerSlice";
import leadReducer from "./Slices/leadSlice";
import offlineProductReducer, { offlineProductApi } from "./Slices/offlineProductSlice";
import offlineUserReducer, { offlineUserApi } from "./Slices/offlineUserSlice";
import dashboardReducer, { dashboardApi } from "./Slices/dashboardSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    media: mediaReducer,
    category: categoryReducer,
    subcategory: subcategoryReducer,
    product: productReducer,
    blog: BlogSliceReducer,
    order: OrderSliceReducer,
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
    [ordersApi.reducerPath]: ordersApi.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
    [offerBannerApi.reducerPath]: offerBannerApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [offlineProductApi.reducerPath]: offlineProductApi.reducer,
    [offlineUserApi.reducerPath]: offlineUserApi.reducer,
    [landingApi.reducerPath]: landingApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(productApi.middleware)
      .concat(blogApi.middleware)
      .concat(categoryApi.middleware)
      .concat(couponApi.middleware)
      .concat(ordersApi.middleware)
      .concat(mediaApi.middleware)
      .concat(offerBannerApi.middleware)
      .concat(dashboardApi.middleware)
      .concat(offlineProductApi.middleware)
      .concat(landingApi.middleware)
      .concat(offlineUserApi.middleware),
});

export default store;
