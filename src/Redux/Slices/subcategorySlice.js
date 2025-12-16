// src/Redux/Slices/subcategorySlice.js

import { createSlice } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryOnline from "./api/baseQuery";

/* =========================
   RTK QUERY API
========================= */
export const subcategoryApi = createApi({
  reducerPath: "subcategoryApi",
  baseQuery: baseQueryOnline,
  tagTypes: ["Subcategory"],
  endpoints: (builder) => ({
    fetchSubcategories: builder.query({
      query: (categoryId) => ({
        url: `/api/subcategories/subcategories-by-category/${categoryId}`,
        method: "GET",
      }),
      providesTags: [{ type: "Subcategory", id: "LIST" }],
    }),

    createSubCategory: builder.mutation({
      query: (body) => ({
        url: "/api/subcategories/create",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [{ type: "Subcategory", id: "LIST" }],
    }),

    updateSubCategory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/subcategories/update/${id}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: (r, e, arg) => [
        { type: "Subcategory", id: arg.id },
      ],
    }),

    deleteSubCategory: builder.mutation({
      query: (id) => ({
        url: `/api/subcategories/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (r, e, id) => [{ type: "Subcategory", id }],
    }),
  }),
});

export const {
  useFetchSubcategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subcategoryApi;

/* =========================
   SLICE
========================= */
const subcategorySlice = createSlice({
  name: "subcategory",
  initialState: {
    subcategories: {},
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* Fetch */
      .addMatcher(
        subcategoryApi.endpoints.fetchSubcategories.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        subcategoryApi.endpoints.fetchSubcategories.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        subcategoryApi.endpoints.fetchSubcategories.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error?.message;
        }
      )

      /* Create */
      .addMatcher(
        subcategoryApi.endpoints.createSubCategory.matchFulfilled,
        (state) => {
          state.error = null;
        }
      )

      /* Update */
      .addMatcher(
        subcategoryApi.endpoints.updateSubCategory.matchFulfilled,
        (state) => {
          state.error = null;
        }
      )

      /* Delete */
      .addMatcher(
        subcategoryApi.endpoints.deleteSubCategory.matchFulfilled,
        (state) => {
          state.error = null;
        }
      );
  },
});

export default subcategorySlice.reducer;
