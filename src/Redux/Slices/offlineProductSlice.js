import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryOffline from "./api/baseQueryOffline";

export const offlineProductApi = createApi({
  reducerPath: "offlineProductApi",
  baseQuery: baseQueryOffline,
  tagTypes: ["OfflineProduct"],
  endpoints: (builder) => ({
    // =========================
    // CREATE PRODUCT
    // =========================
    createOfflineProduct: builder.mutation({
      query: (productData) => ({
        url: "/api/offline/products/create",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["OfflineProduct"],
    }),

    // =========================
    // GET ALL PRODUCTS
    // =========================
    fetchOfflineProducts: builder.query({
      query: () => "/api/offline/products",
      transformResponse: (response) => response.data, // 👈 direct array
      providesTags: ["OfflineProduct"],
    }),

    // =========================
    // GET SINGLE PRODUCT
    // =========================
    fetchOfflineProductById: builder.query({
      query: (id) => `/api/offline/products/${id}`,
      providesTags: (id) => [{ type: "OfflineProduct", id }],
    }),

    // =========================
    // UPDATE PRODUCT
    // =========================
    updateOfflineProduct: builder.mutation({
      query: ({ unique_id, updateData }) => ({
        url: `/api/offline/products/update/${unique_id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["OfflineProduct"],
    }),

    // =========================
    // DELETE PRODUCT
    // =========================
    deleteOfflineProduct: builder.mutation({
      query: (id) => ({
        url: `/api/offline/products/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OfflineProduct"],
    }),
  }),
});

export const {
  useCreateOfflineProductMutation,
  useFetchOfflineProductsQuery,
  useFetchOfflineProductByIdQuery,
  useUpdateOfflineProductMutation,
  useDeleteOfflineProductMutation,
} = offlineProductApi;

<<<<<<< HEAD
export const deleteOfflineProduct = createAsyncThunk(
  "offlineProducts/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${BASE_URL}/api/offline/products/delete/${id}`
      );
      return { id, message: data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting product");
    }
  }
);
export const uploadOfflineImage = createAsyncThunk(
  "offlineProducts/uploadImage",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post(
        `${BASE_URL}/api/offline/upload-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return data; // return image URL
    } catch (error) {
      return rejectWithValue(error.response?.data || "Image upload failed");
    }
  }
);
=======
>>>>>>> 7406ecfdb1b496bf8f9af7b0d29d04cb3b66a3a6

const offlineProductSlice = createSlice({
  name: "offlineProducts",
  initialState: {
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // =========================
      // LOADING MATCHER
      // =========================
      .addMatcher(
        isAnyOf(
          offlineProductApi.endpoints.createOfflineProduct.matchPending,
          offlineProductApi.endpoints.updateOfflineProduct.matchPending,
          offlineProductApi.endpoints.deleteOfflineProduct.matchPending
        ),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      // =========================
      // SUCCESS MATCHER
      // =========================
      .addMatcher(
        isAnyOf(
          offlineProductApi.endpoints.createOfflineProduct.matchFulfilled,
          offlineProductApi.endpoints.updateOfflineProduct.matchFulfilled,
          offlineProductApi.endpoints.deleteOfflineProduct.matchFulfilled
        ),
        (state, action) => {
          state.loading = false;

          if (action.type.includes("create")) {
            state.successMessage = "Product created successfully!";
          }

          if (action.type.includes("update")) {
            state.successMessage = "Product updated successfully!";
          }

          if (action.type.includes("delete")) {
            state.successMessage = "Product deleted successfully!";
          }
        }
      )

      // =========================
      // ERROR MATCHER
      // =========================
      .addMatcher(
        isAnyOf(
          offlineProductApi.endpoints.createOfflineProduct.matchRejected,
          offlineProductApi.endpoints.updateOfflineProduct.matchRejected,
          offlineProductApi.endpoints.deleteOfflineProduct.matchRejected
        ),
        (state, action) => {
          state.loading = false;
          state.error =
            action.error?.data ||
            action.error?.message ||
            "Something went wrong";
        }
      );
  },
});

export const { clearMessages } = offlineProductSlice.actions;
export default offlineProductSlice.reducer;
