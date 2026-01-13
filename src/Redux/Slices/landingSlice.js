import { createSlice } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryOffline from "./api/baseQueryOffline";

/* ================= RTK QUERY API ================= */
export const landingApi = createApi({
  reducerPath: "landingApi",
  baseQuery: baseQueryOffline,
  tagTypes: ["Landing"],
  endpoints: (builder) => ({

    // CREATE
    createLandingContent: builder.mutation({
      query: (formData) => ({
        url: "/api/landing/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Landing", id: "LIST" }],
    }),

    // READ (LIST)
    fetchLandingContent: builder.query({
      query: () => "/api/landing",
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ _id }) => ({ type: "Landing", id: _id })),
            { type: "Landing", id: "LIST" },
          ]
          : [{ type: "Landing", id: "LIST" }],
    }),

    // DELETE
    deleteLandingContent: builder.mutation({
      query: (id) => ({
        url: `/api/landing/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Landing", id },
        { type: "Landing", id: "LIST" },
      ],
    }),

    // UPDATE
    updateLandingContent: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/api/landing/update/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Landing", id },
        { type: "Landing", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateLandingContentMutation,
  useFetchLandingContentQuery,
  useDeleteLandingContentMutation,
  useUpdateLandingContentMutation,
} = landingApi;

/* ================= SLICE ================= */
const landingSlice = createSlice({
  name: "landing",
  initialState: {
    content: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetLandingState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /* CREATE */
    builder
      .addMatcher(
        landingApi.endpoints.createLandingContent.matchPending,
        (state) => {
          state.loading = true;
          state.success = false;
        }
      )
      .addMatcher(
        landingApi.endpoints.createLandingContent.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.success = true;
          state.content.unshift(action.payload.content);
        }
      )
      .addMatcher(
        landingApi.endpoints.createLandingContent.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error;
        }
      )

      /* FETCH */
      .addMatcher(
        landingApi.endpoints.fetchLandingContent.matchPending,
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        landingApi.endpoints.fetchLandingContent.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.content = action.payload;
        }
      )
      .addMatcher(
        landingApi.endpoints.fetchLandingContent.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error;
        }
      )

      /* DELETE */
      .addMatcher(
        landingApi.endpoints.deleteLandingContent.matchFulfilled,
        (state, action) => {
          state.content = state.content.filter(
            (item) => item._id !== action.meta.arg.originalArgs
          );
        }
      )
      .addMatcher(
        landingApi.endpoints.deleteLandingContent.matchRejected,
        (state, action) => {
          state.error = action.error;
        }
      )

      /* UPDATE */
      .addMatcher(
        landingApi.endpoints.updateLandingContent.matchFulfilled,
        (state) => {
          state.success = true;
        }
      )
      .addMatcher(
        landingApi.endpoints.updateLandingContent.matchRejected,
        (state, action) => {
          state.error = action.error;
        }
      );
  },
});

export const { resetLandingState } = landingSlice.actions;
export default landingSlice.reducer;