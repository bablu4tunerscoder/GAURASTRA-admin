import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../Components/Helper/axiosinstance'; // ✅ FIX: Corrected the import path

// Async thunk to fetch all leads
export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/leads');
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leads');
    }
  }
);

const leadSlice = createSlice({
  name: 'leads',
  initialState: {
    leads: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leads = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default leadSlice.reducer;