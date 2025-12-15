import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../Components/Helper/axiosinstance";

/* ===========================
   RTK QUERY API
=========================== */

export const couponApi = createApi({
  reducerPath: "couponApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Coupons"],
  endpoints: (builder) => ({
    getCoupons: builder.query({
      query: () => "/api/coupons/allCoupons",
      transformResponse: (response) => response.data || [],
      providesTags: ["Coupons"],
    }),
    createCoupon: builder.mutation({
      query: (couponData) => ({
        url: "/api/coupons/create-coupon",
        method: "POST",
        body: couponData,
      }),
      invalidatesTags: ["Coupons"],
    }),
    updateCoupon: builder.mutation({
      query: ({ id, ...couponData }) => ({
        url: `/api/coupons/updateCoupon/${id}`,
        method: "PUT",
        body: couponData,
      }),
      invalidatesTags: ["Coupons"],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/api/coupons/deleteCoupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupons"],
    }),
  }),
});

/* ===========================
   SLICE WITH EXTRA REDUCERS
=========================== */

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    coupons: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Get Coupons
    builder
      .addMatcher(couponApi.endpoints.getCoupons.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(couponApi.endpoints.getCoupons.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.coupons = action.payload;
      })
      .addMatcher(couponApi.endpoints.getCoupons.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message;
      });

    // Create Coupon
    builder
      .addMatcher(couponApi.endpoints.createCoupon.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(couponApi.endpoints.createCoupon.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.coupons.unshift(action.payload);
      })
      .addMatcher(couponApi.endpoints.createCoupon.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message;
      });

    // Update Coupon
    builder
      .addMatcher(couponApi.endpoints.updateCoupon.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(couponApi.endpoints.updateCoupon.matchFulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.coupons.findIndex(c => c.coupon_id === action.payload.coupon_id);
        if (index !== -1) state.coupons[index] = action.payload;
      })
      .addMatcher(couponApi.endpoints.updateCoupon.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message;
      });

    // Delete Coupon
    builder
      .addMatcher(couponApi.endpoints.deleteCoupon.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(couponApi.endpoints.deleteCoupon.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.coupons = state.coupons.filter(c => c.coupon_id !== action.meta.arg);
      })
      .addMatcher(couponApi.endpoints.deleteCoupon.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message;
      });
  },
});

/* ===========================
   EXPORT
=========================== */

export default couponSlice.reducer;

export const {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
