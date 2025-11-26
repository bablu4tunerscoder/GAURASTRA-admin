import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../Components/Helper/axiosinstance";

// ✅ Upload Banner
export const uploadOfferBanner = createAsyncThunk(
  "offerBanner/upload",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/banner/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ Get All Banners
export const fetchOfferBanners = createAsyncThunk(
  "offerBanner/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/banner/all`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ Delete Banner
export const deleteOfferBanner = createAsyncThunk(
  "offerBanner/delete",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/api/banner/delete/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ Update Banner (for future use)
export const updateOfferBanner = createAsyncThunk(
  "offerBanner/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/banner/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ Initial State
const initialState = {
  loading: false,
  error: null,
  banner: null,
  banners: [],
};

// ✅ Slice
const offerBannerSlice = createSlice({
  name: "offerBanner",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // 🔽 Upload
      .addCase(uploadOfferBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadOfferBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banner = action.payload;
      })
      .addCase(uploadOfferBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔽 Fetch All
      .addCase(fetchOfferBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOfferBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchOfferBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔽 Delete
      .addCase(deleteOfferBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOfferBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.filter(b => b._id !== action.payload);
      })
      .addCase(deleteOfferBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔽 Update (future use)
      .addCase(updateOfferBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOfferBanner.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.banners.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
      })
      .addCase(updateOfferBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default offerBannerSlice.reducer;
