import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slices/userSlice";
import mediaReducer from "./Slices/mediaSlice";
import categoryReducer from "./Slices/categorySlice";
import subcategoryReducer from "./Slices/subcategorySlice";
import productReducer from "./Slices/productSlice";
import BlogSliceReducer from "./Slices/BlogSlice";
import OrderSliceReducer from "./Slices/orderSlice";
import landingReducer from "./Slices/landingSlice";
import couponsReducer from "./Slices/couponSlice";
import offerBannerReducer from "./Slices/offerBannerSlice";
import leadReducer from "./Slices/leadSlice"; // ✅ 1. Import the new reducer

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
    leads: leadReducer, // ✅ 2. Add it to the store
  },
});

export default store;