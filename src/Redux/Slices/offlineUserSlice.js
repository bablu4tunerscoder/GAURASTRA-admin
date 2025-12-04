import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../offline-admin/axiosinstance";

// 👉 Worker Create API Thunk
export const createOfflineWorker = createAsyncThunk(
  "offlineUser/createWorker",
  async (workerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/offline/user/register`,
        workerData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong!"
      );
    }
  }
);

const offlineUserSlice = createSlice({
  name: "offlineUser",
  initialState: {
    loading: false,
    success: false,
    error: null,
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
      .addCase(createOfflineWorker.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOfflineWorker.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createOfflineWorker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetStatus } = offlineUserSlice.actions;
export default offlineUserSlice.reducer;
