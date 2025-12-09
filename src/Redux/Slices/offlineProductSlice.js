import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../offline-admin/axiosinstance";

export const createOfflineProduct = createAsyncThunk(
  "offlineProducts/create",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/offline/products/create`,
        productData
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error creating product");
    }
  }
);

export const fetchOfflineProducts = createAsyncThunk(
  "offlineProducts/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/offline/products`);
      return data.data; // 👈 DIRECT ARRAY RETURN
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching products");
    }
  }
);


// ================================
// GET SINGLE PRODUCT
// ================================
export const fetchOfflineProductById = createAsyncThunk(
  "offlineProducts/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/offline/products/${id}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching product");
    }
  }
);

// ================================
// UPDATE PRODUCT
// ================================
export const updateOfflineProduct = createAsyncThunk(
  "offlineProducts/update",
  async ({ unique_id, updateData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/offline/products/update/${unique_id}`,
        updateData
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating product");
    }
  }
);


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

const offlineProductSlice = createSlice({
  name: "offlineProducts",
  initialState: {
    products: [],
    singleProduct: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createOfflineProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOfflineProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload.product);
        state.successMessage = "Product created successfully!";
      })
      .addCase(createOfflineProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(fetchOfflineProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOfflineProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchOfflineProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ONE
      .addCase(fetchOfflineProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOfflineProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleProduct = action.payload.product;
      })
      .addCase(fetchOfflineProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateOfflineProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOfflineProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Product updated successfully!";
      })
      .addCase(updateOfflineProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteOfflineProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOfflineProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p._id !== action.payload.id);
        state.successMessage = "Product deleted successfully!";
      })
      .addCase(deleteOfflineProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = offlineProductSlice.actions;
export default offlineProductSlice.reducer;
