import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../Components/Helper/axiosinstance";

// Fetch all coupons
export const fetchCoupons = createAsyncThunk(
  "coupon/fetchCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/coupons/allCoupons`);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch coupons"
      );
    }
  }
);

// Create coupon
export const createCoupon = createAsyncThunk(
  "coupon/createCoupon",
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/coupons/create-coupon`,
        couponData
      );
      return response.data.coupon;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create coupon"
      );
    }
  }
);

// Update coupon
export const updateCoupon = createAsyncThunk(
  "coupon/updateCoupon",
  async ({ id, couponData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/coupons/updateCoupon/${id}`,
        couponData
      );
      return response.data.coupon;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update coupon"
      );
    }
  }
);

// Delete coupon
export const deleteCoupon = createAsyncThunk(
  "coupon/deleteCoupon",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/coupons/deleteCoupons/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete coupon"
      );
    }
  }
);

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    coupons: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Coupons
      .addCase(fetchCoupons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coupons = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create Coupon
      .addCase(createCoupon.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coupons.unshift(action.payload);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Coupon
      .addCase(updateCoupon.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.coupons.findIndex(
          (c) => c.coupon_id === action.payload.coupon_id
        );
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete Coupon
      .addCase(deleteCoupon.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coupons = state.coupons.filter(
          (c) => c.coupon_id !== action.payload
        );
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default couponSlice.reducer;
