import { createApi } from "@reduxjs/toolkit/query/react";
import { createSlice } from "@reduxjs/toolkit";
import baseQueryOnline from "./api/baseQuery";

/* ===========================
   RTK QUERY API
=========================== */

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: baseQueryOnline,
  tagTypes: ["Categories", "Subcategories"],

  endpoints: (builder) => ({
    /* ---------- CATEGORY ---------- */

    // GET all categories
    getCategories: builder.query({
      query: () => "/api/categories/findAll",
      transformResponse: (res) => res?.data || [],
      providesTags: ["Categories"],
    }),

    // CREATE category
    createCategory: builder.mutation({
      query: (body) => ({
        url: "/api/categories/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),

    // UPDATE category
    updateCategory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/categories/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),

    // DELETE category
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/api/categories/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),

    /* ---------- SUBCATEGORY ---------- */

    // GET subcategories by category
    getSubcategories: builder.query({
      query: (categoryId) =>
        `/api/subcategories/subcategories-by-category/${categoryId}`,
      transformResponse: (res) => res?.data || [],
      providesTags: (result, error, categoryId) => [
        { type: "Subcategories", id: categoryId },
      ],
    }),

    // CREATE subcategory
    createSubcategory: builder.mutation({
      query: (body) => ({
        url: "/api/subcategories/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subcategories"],
    }),

    // UPDATE subcategory
    updateSubcategory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/subcategories/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Subcategories"],
    }),

    // DELETE subcategory
    deleteSubcategory: builder.mutation({
      query: (id) => ({
        url: `/api/subcategories/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subcategories"],
    }),
  }),
});

/* ===========================
   UI STATE SLICE
=========================== */

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    subcategories: {},

    selectedCategory: null,
    selectedSubcategory: null,

    isLoading: false,
    error: null,
  },

  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.selectedSubcategory = null;
    },
    setSelectedSubcategory: (state, action) => {
      state.selectedSubcategory = action.payload;
    },
  },

  /* ===========================
     EXTRA REDUCERS (RTK QUERY)
  =========================== */

  extraReducers: (builder) => {
    /* ---------- CATEGORY ---------- */

    builder
      .addMatcher(
        categoryApi.endpoints.getCategories.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        categoryApi.endpoints.getCategories.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          state.categories = action.payload;
        }
      )
      .addMatcher(
        categoryApi.endpoints.getCategories.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error?.message;
        }
      );

    /* ---------- SUBCATEGORY ---------- */

    builder
      .addMatcher(
        categoryApi.endpoints.getSubcategories.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        categoryApi.endpoints.getSubcategories.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          const categoryId = action.meta.arg.originalArgs;
          state.subcategories[categoryId] = action.payload;
        }
      )
      .addMatcher(
        categoryApi.endpoints.getSubcategories.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error?.message;
        }
      );
  },
});

/* ===========================
   EXPORTS
=========================== */

// RTK Query Hooks
export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,

  useGetSubcategoriesQuery,
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
} = categoryApi;

// UI Actions
export const { setSelectedCategory, setSelectedSubcategory } =
  categorySlice.actions;

// Reducer
export default categorySlice.reducer;
