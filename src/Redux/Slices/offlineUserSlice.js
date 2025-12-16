import { createSlice } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryOffline from "./api/baseQueryOffline";

/* =======================
   RTK QUERY API
======================= */

export const offlineUserApi = createApi({
  reducerPath: "offlineUserApi",
  baseQuery: baseQueryOffline,
  tagTypes: ["Workers"],

  endpoints: (builder) => ({
    createOfflineWorker: builder.mutation({
      query: (workerData) => ({
        url: "/api/offline/user/register",
        method: "POST",
        body: workerData,
      }),
      invalidatesTags: ["Workers"],
    }),

    getAllWorkers: builder.query({
      query: () => "/api/offline/user/allusers",
      providesTags: ["Workers"],
    }),

    deleteWorkerById: builder.mutation({
      query: (id) => ({
        url: `/api/offline/user/deleteuser/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Workers"],
    }),

    updatePasswordById: builder.mutation({
      query: ({ id, password }) => ({
        url: `/api/offline/user/updatepassword/${id}`,
        method: "PUT",
        body: { password },
      }),
    }),
  }),
});

/* =======================
   SLICE
======================= */

const offlineUserSlice = createSlice({
  name: "offlineUser",
  initialState: {
    loading: false,
    success: false,
    error: null,
    workers: [],
  },
  reducers: {
    resetStatus: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* GET ALL WORKERS */
      .addMatcher(
        offlineUserApi.endpoints.getAllWorkers.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        offlineUserApi.endpoints.getAllWorkers.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.workers = action.payload?.users || [];
        }
      )
      .addMatcher(
        offlineUserApi.endpoints.getAllWorkers.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message;
        }
      )

      /* CREATE WORKER */
      .addMatcher(
        offlineUserApi.endpoints.createOfflineWorker.matchPending,
        (state) => {
          state.loading = true;
          state.success = false;
          state.error = null;
        }
      )
      .addMatcher(
        offlineUserApi.endpoints.createOfflineWorker.matchFulfilled,
        (state) => {
          state.loading = false;
          state.success = true;
        }
      )
      .addMatcher(
        offlineUserApi.endpoints.createOfflineWorker.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message;
        }
      )

      /* DELETE WORKER */
      .addMatcher(
        offlineUserApi.endpoints.deleteWorkerById.matchFulfilled,
        (state, action) => {
          state.workers = state.workers.filter(
            (w) => w._id !== action.meta.arg
          );
        }
      )

      /* UPDATE PASSWORD */
      .addMatcher(
        offlineUserApi.endpoints.updatePasswordById.matchPending,
        (state) => {
          state.loading = true;
          state.success = false;
          state.error = null;
        }
      )
      .addMatcher(
        offlineUserApi.endpoints.updatePasswordById.matchFulfilled,
        (state) => {
          state.loading = false;
          state.success = true;
        }
      )
      .addMatcher(
        offlineUserApi.endpoints.updatePasswordById.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message;
        }
      );
  },
});

export const { resetStatus } = offlineUserSlice.actions;
export default offlineUserSlice.reducer;

/* =======================
   RTK QUERY HOOKS
======================= */

export const {
  useCreateOfflineWorkerMutation,
  useGetAllWorkersQuery,
  useDeleteWorkerByIdMutation,
  useUpdatePasswordByIdMutation,
} = offlineUserApi;
