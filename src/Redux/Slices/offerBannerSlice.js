// src/Redux/Slices/offerBannerSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryOnline from "./api/baseQuery";

/* =============== RTK QUERY API =============== */
export const offerBannerApi = createApi({
  reducerPath: "offerBannerApi",
  baseQuery: baseQueryOnline,
  tagTypes: ["OfferBanner"],
  endpoints: (builder) => ({
    uploadOfferBanner: builder.mutation({
      query: (formData) => ({
        url: "/api/banner/create",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: [{ type: "OfferBanner", id: "LIST" }],
    }),

    fetchOfferBanners: builder.query({
      query: () => ({
        url: "/api/banner/all",
        method: "GET",
      }),
      providesTags: [{ type: "OfferBanner", id: "LIST" }],
    }),


    deleteOfferBanner: builder.mutation({
      query: (id) => ({
        url: `/api/banner/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "OfferBanner", id },
        { type: "OfferBanner", id: "LIST" },
      ],
    }),

    updateOfferBanner: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/api/banner/update/${id}`,
        method: "PUT",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "OfferBanner", id },
        { type: "OfferBanner", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useUploadOfferBannerMutation,
  useFetchOfferBannersQuery,
  useDeleteOfferBannerMutation,
  useUpdateOfferBannerMutation,
} = offerBannerApi;

/* =============== SLICE =============== */
const offerBannerSlice = createSlice({
  name: "offerBanner",
  initialState: {
    banners: [],
    banner: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearOfferBannerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ========== UPLOAD ========== */
      .addMatcher(
        offerBannerApi.endpoints.uploadOfferBanner.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        offerBannerApi.endpoints.uploadOfferBanner.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.banner = action.payload;
        }
      )
      .addMatcher(
        offerBannerApi.endpoints.uploadOfferBanner.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message || null;
        }
      )

      /* ========== FETCH ALL ========== */
      .addMatcher(
        offerBannerApi.endpoints.fetchOfferBanners.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        offerBannerApi.endpoints.fetchOfferBanners.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.banners = action.payload;
        }
      )
      .addMatcher(
        offerBannerApi.endpoints.fetchOfferBanners.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message || null;
        }
      )

      /* ========== DELETE ========== */
      .addMatcher(
        offerBannerApi.endpoints.deleteOfferBanner.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        offerBannerApi.endpoints.deleteOfferBanner.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.banners = state.banners.filter(
            (b) => b._id !== action.meta.arg.originalArgs
          );
        }
      )
      .addMatcher(
        offerBannerApi.endpoints.deleteOfferBanner.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message || null;
        }
      )

      /* ========== UPDATE ========== */
      .addMatcher(
        offerBannerApi.endpoints.updateOfferBanner.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        offerBannerApi.endpoints.updateOfferBanner.matchFulfilled,
        (state, action) => {
          state.loading = false;
          const index = state.banners.findIndex(
            (b) => b._id === action.payload._id
          );
          if (index !== -1) {
            state.banners[index] = action.payload;
          }
        }
      )
      .addMatcher(
        offerBannerApi.endpoints.updateOfferBanner.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message || null;
        }
      );
  },
});

export const { clearOfferBannerError } = offerBannerSlice.actions;
export default offerBannerSlice.reducer;
