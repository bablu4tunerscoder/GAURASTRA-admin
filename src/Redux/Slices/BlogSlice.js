import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../Components/Helper/axiosinstance";

const initialState = {
  blogData: [],
  loading: false,
  error: null,
};

export const getAllBlogs = createAsyncThunk(
  "/blog/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/blogs/findAllBlogs`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const createNewBlog = createAsyncThunk(
  "/blog/create",
  async (data, { rejectWithValue }) => {
    try {
      let formData = new FormData();
      formData.append("blog_title", data?.blogTitle);
      formData.append("blog_content", data?.blogContent);
      formData.append("blog_status", data?.blogStatus);
      formData.append("blog_published", data?.blogPublished);
      formData.append("blog_slug", data.blogSlug || "");
      formData.append("author", data?.author || "");

      if (data?.thumbnail) {
        formData.append("thumbnail", data?.thumbnail);
      }

      // Assuming seo is an object with meta_keywords as an array
      const seoData = {
        ...data?.seo,
        meta_keywords: data?.seo?.meta_keywords || [], // Ensure it's an array
      };

      formData.append("seo", JSON.stringify(seoData)); // Convert the SEO object to a JSON string

      const response = await axios.post(
        `${BASE_URL}/api/blogs/createBlogs`,
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "/blog/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/blogs/deleteBlog/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const updateBlog = createAsyncThunk(
  "/blog/update",
  async (data, { rejectWithValue }) => {
    try {
      let formData = new FormData();
      formData.append("blog_title", data?.blogTitle);
      formData.append("blog_content", data?.blogContent);
      formData.append("blog_status", data?.blogStatus);
      formData.append("blog_content_type", data?.blog_content_type);
      formData.append("blog_published", data?.blogPublished);
      formData.append("blog_slug", data.blogSlug || "");
      formData.append("author", data?.author || "");

      if (data?.thumbnail) {
        formData.append("thumbnail", data?.thumbnail);
      }

      // Assuming seo is an object with meta_keywords as an array
      const seoData = {
        ...data?.seo,
        meta_keywords: data?.seo?.meta_keywords || [], // Ensure it's an array
      };

      formData.append("seo", JSON.stringify(seoData)); // Convert the SEO object to a JSON string

      const response = await axios.put(
        `${BASE_URL}/api/blogs/updateBlog/${data.blog_id}`,
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);


const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All Blogs
      .addCase(getAllBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogData = action.payload || [];
      })
      .addCase(getAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch blogs";
      })

      // Create New Blog
      .addCase(createNewBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createNewBlog.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createNewBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create course";
        state.success = false;
      })
      // Delete Blog
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogData = state.blogData.filter(
          (blog) => blog.id !== action.meta.arg
        );
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete blog";
      })
      // Update Blog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogData = state.blogData.filter(
          (blog) => blog.id !== action.meta.arg
        );
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update blog";
      })
  },
});

export default blogSlice.reducer;
