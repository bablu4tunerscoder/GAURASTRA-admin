import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../Components/Helper/axiosinstance";

export const createLandingContent = createAsyncThunk(
  "landing/createLandingContent",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/landing/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Server Error");
    }
  }
);

// ✅ GET Landing Content
export const fetchLandingContent = createAsyncThunk(
  "landing/fetchLandingContent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/landing`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Server Error");
    }
  }
);

export const deleteLandingContent = createAsyncThunk(
  "landing/deleteLandingContent",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/landing/delete/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Server Error");
    }
  }
);

// UPDATE
export const updateLandingContent = createAsyncThunk(
  "landing/updateLandingContent",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/landing/update/${id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Server Error");
    }
  }
);

const landingSlice = createSlice({
  name: "landing",
  initialState: {
    content: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetLandingState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createLandingContent.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(createLandingContent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.content.unshift(action.payload.content);
      })
      .addCase(createLandingContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH
      .addCase(fetchLandingContent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLandingContent.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload;
      })
      .addCase(fetchLandingContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteLandingContent.fulfilled, (state, action) => {
        state.content = state.content.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteLandingContent.rejected, (state, action) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateLandingContent.fulfilled, (state, action) => {
        const index = state.content.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.content[index] = action.payload;
        }
      })
      .addCase(updateLandingContent.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetLandingState } = landingSlice.actions;
export default landingSlice.reducer;
