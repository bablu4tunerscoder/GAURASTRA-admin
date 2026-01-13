import { createSlice } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryOnline from "./api/baseQuery";


export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: baseQueryOnline,
  tagTypes: ["Blogs", "SingleBlog"],

  endpoints: (builder) => ({

    // ---------------- 1. GET ALL BLOGS (Query) ----------------
    getAllBlogs: builder.query({
      query: () => "/api/blogs/findAllBlogs",
      transformResponse: (response) => response.data,
      providesTags: ["Blogs"],
    }),

    // ---------------- 2. GET BLOG BY ID (Query) ----------------
    getBlogById: builder.query({
      query: (id) => `/api/blogs/findOneBlog/${id}`,
      // Provides a specific tag for individual blog caching
      providesTags: (result, error, id) => [{ type: "SingleBlog", id }],
    }),

    // ---------------- 3. CREATE NEW BLOG (Mutation) ----------------
    createNewBlog: builder.mutation({
      query: (data) => ({
        url: "/api/blogs/createBlogs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Blogs"],
    }),

    // ---------------- 4. DELETE BLOG (Mutation) ----------------
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/api/blogs/deleteBlog/${id}`,
        method: "DELETE",
      }),
      // Invalidate the list and the specific single blog cache
      invalidatesTags: (result, error, id) => ["Blogs", { type: "SingleBlog", id }],
    }),

    // ---------------- 5. UPDATE BLOG (Mutation) ----------------
    updateBlog: builder.mutation({
      query: (id, formData) => ({
        url: `/api/blogs/updateBlog/${id}`,
        method: "PUT",
        body: formData,
      }),

      invalidatesTags: (result, error, { id }) => [
        "Blogs",
        { type: "SingleBlog", id },
      ],
    }),

  }),
});

// Export the auto-generated hooks
export const {
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useCreateNewBlogMutation,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
} = blogApi;


const initialState = {
  allBlogs: [],
  singleBlog: null,
  isLoading: false,
  error: null,
};


const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    // Add any local state reducers here if needed (e.g., setEditMode, clearFormData)
  },

  // ==========================================================
  // EXTRA REDUCERS (Listening to RTK Query endpoint lifecycle)
  // ==========================================================
  extraReducers: (builder) => {
    // ===============================
    // GET ALL BLOGS
    // ===============================
    builder
      .addMatcher(
        blogApi.endpoints.getAllBlogs.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        blogApi.endpoints.getAllBlogs.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.allBlogs = payload; // because transformResponse returns response.data
        }
      )
      .addMatcher(
        blogApi.endpoints.getAllBlogs.matchRejected,
        (state, { error }) => {
          state.isLoading = false;
          state.error = error;
        }
      );

    // ===============================
    // GET SINGLE BLOG BY ID
    // ===============================
    builder
      .addMatcher(
        blogApi.endpoints.getBlogById.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        blogApi.endpoints.getBlogById.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.singleBlog = payload?.data || payload;
        }
      )
      .addMatcher(
        blogApi.endpoints.getBlogById.matchRejected,
        (state, { error }) => {
          state.isLoading = false;
          state.singleBlog = null;
          state.error = error;
        }
      );

    // ===============================
    // CREATE BLOG
    // ===============================
    builder
      .addMatcher(
        blogApi.endpoints.createNewBlog.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        blogApi.endpoints.createNewBlog.matchFulfilled,
        (state) => {
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        blogApi.endpoints.createNewBlog.matchRejected,
        (state, { error }) => {
          state.isLoading = false;
          state.error = error;
        }
      );

    // ===============================
    // UPDATE BLOG
    // ===============================
    builder
      .addMatcher(
        blogApi.endpoints.updateBlog.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        blogApi.endpoints.updateBlog.matchFulfilled,
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        blogApi.endpoints.updateBlog.matchRejected,
        (state, { error }) => {
          state.isLoading = false;
          state.error = error;
        }
      );

    // ===============================
    // DELETE BLOG
    // ===============================
    builder
      .addMatcher(
        blogApi.endpoints.deleteBlog.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        blogApi.endpoints.deleteBlog.matchFulfilled,
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        blogApi.endpoints.deleteBlog.matchRejected,
        (state, { error }) => {
          state.isLoading = false;
          state.error = error;
        }
      );
  }

  // ==========================================================
});

export default blogSlice.reducer;
