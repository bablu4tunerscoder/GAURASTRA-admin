import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../offline-admin/axiosinstance";

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

export const getAllWorkers = createAsyncThunk(
  "offlineUser/getAllWorkers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/offline/user/allusers`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch workers!"
      );
    }
  }
);

export const deleteWorkerById = createAsyncThunk(
  "offlineUser/deleteWorker",
  async (id, {rejectWithValue}) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/offline/user/deleteuser/${id}`
      );
      return { id, message: response.data?.message };
          } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Delete failed!"
      );
    }
  }
);

export const updatePasswordById = createAsyncThunk(
  "offlineUser/updatePassword",
  async ({ id, newPassword  }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/offline/user/updatepassword/${id}`,
        { newPassword  }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Password update failed!"
      );
    }
  }
);

export const downloadWorkersCSV = createAsyncThunk(
  "offlineUser/downloadWorkersCSV",
  async ({ month, year } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/offline/download/user/csv`,
        {
          params: { month, year },
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Download failed!"
      );
    }
  }
);


export const downloadBillingCSV = createAsyncThunk(
  "offlineUser/downloadBillingCSV",
  async ({ month, year } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/offline/download/billing/csv`,
        {
          params: { month, year },
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Download failed!"
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
    workers: [],
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
      })
      .addCase(getAllWorkers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllWorkers.fulfilled, (state, action) => {
        state.loading = false;
        state.workers = action.payload.users || [];
      })

      .addCase(getAllWorkers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteWorkerById.fulfilled, (state, action) => {
  state.workers = state.workers.filter(
    (worker) => worker._id !== action.payload.id
  );
})
.addCase(updatePasswordById.pending, (state) => {
  state.loading = true;
  state.error = null;
  state.success = false;
})
.addCase(updatePasswordById.fulfilled, (state) => {
  state.loading = false;
  state.success = true;
})
.addCase(updatePasswordById.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
      .addCase(downloadWorkersCSV.pending, (state) => { state.loading = true; })
      .addCase(downloadWorkersCSV.fulfilled, (state) => { state.loading = false; })
      .addCase(downloadWorkersCSV.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(downloadBillingCSV.pending, (state) => { state.loading = true; })
      .addCase(downloadBillingCSV.fulfilled, (state) => { state.loading = false; })
      .addCase(downloadBillingCSV.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

  },
});

export const { resetStatus } = offlineUserSlice.actions;
export default offlineUserSlice.reducer;
