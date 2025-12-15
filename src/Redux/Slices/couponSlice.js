import { createSlice } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryOnline from "./api/baseQuery";

/* ===========================
   RTK QUERY API
=========================== */

export const couponApi = createApi({
  reducerPath: "couponApi",
  baseQuery: baseQueryOnline,
  tagTypes: ["Coupons"],
  endpoints: (builder) => ({
    getUserCoupons: builder.query({
      query: () => "/api/coupons-user/allCoupons",
      transformResponse: (response) => response.data || [],
      providesTags: ["Coupons"],
    }),
    createUserCoupon: builder.mutation({
      query: (couponData) => ({
        url: "/api/coupons-user/create-coupon",
        method: "POST",
        body: couponData,
      }),
      invalidatesTags: ["Coupons"],
    }),
    updateUserCoupon: builder.mutation({
      query: ({ id, ...couponData }) => ({
        url: `/api/coupons-user/updateCoupon/${id}`,
        method: "PUT",
        body: couponData,
      }),
      invalidatesTags: ["Coupons"],
    }),
    deleteUserCoupon: builder.mutation({
      query: (id) => ({
        url: `/api/coupons-user/deleteCoupons/${id}`,
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
      .addMatcher(couponApi.endpoints.getUserCoupons.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(couponApi.endpoints.getUserCoupons.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.coupons = action.payload;
      })
      .addMatcher(couponApi.endpoints.getUserCoupons.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message;
      });

    // Create Coupon
    builder
      .addMatcher(couponApi.endpoints.createUserCoupon.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(couponApi.endpoints.createUserCoupon.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.coupons.unshift(action.payload);
      })
      .addMatcher(couponApi.endpoints.createUserCoupon.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message;
      });

    // Update Coupon
    builder
      .addMatcher(couponApi.endpoints.updateUserCoupon.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(couponApi.endpoints.updateUserCoupon.matchFulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.coupons.findIndex(c => c.coupon_id === action.payload.coupon_id);
        if (index !== -1) state.coupons[index] = action.payload;
      })
      .addMatcher(couponApi.endpoints.updateUserCoupon.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message;
      });

    // Delete Coupon
    builder
      .addMatcher(couponApi.endpoints.deleteUserCoupon.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(couponApi.endpoints.deleteUserCoupon.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.coupons = state.coupons.filter(c => c.coupon_id !== action.meta.arg);
      })
      .addMatcher(couponApi.endpoints.deleteUserCoupon.matchRejected, (state, action) => {
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
  useGetUserCouponsQuery,
  useCreateUserCouponMutation,
  useUpdateUserCouponMutation,
  useDeleteUserCouponMutation,
} = couponApi;
