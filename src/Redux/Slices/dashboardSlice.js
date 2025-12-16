import { createSlice } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryOffline from "./api/baseQueryOffline";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: baseQueryOffline,
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    fetchDashboardData: builder.query({
      query: () => "/api/offline/admin/dashboard",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useFetchDashboardDataQuery,
  useLazyFetchDashboardDataQuery,
} = dashboardApi;



const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    loading: false,
    data: null,
    error: null,
    lastFetchedAt: null,
  },
  reducers: {
    clearDashboard: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        dashboardApi.endpoints.fetchDashboardData.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        dashboardApi.endpoints.fetchDashboardData.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.data = action.payload;
          state.lastFetchedAt = new Date().toISOString();
        }
      )
      .addMatcher(
        dashboardApi.endpoints.fetchDashboardData.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message || "Failed to load dashboard";
        }
      );
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
