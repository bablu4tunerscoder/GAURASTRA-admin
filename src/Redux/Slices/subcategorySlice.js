// src/Redux/Slices/subcategorySlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../Components/Helper/axiosinstance";

// Fetch subcategories by category ID
export const fetchSubcategories = createAsyncThunk(
  "subcategory/fetchSubcategories",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/subcategories/subcategories-by-category/${categoryId}`
      );
      return { categoryId, subcategories: response.data?.data || [] };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subcategories"
      );
    }
  }
);

// ✅ Create SubCategory with optional gender
export const createSubCategory = createAsyncThunk(
  "subcategory/createSubCategory",
  async (
    { category_id, Subcategory_name, Subcategory_description, gender },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/subcategories/create`,
        {
          category_id,
          Subcategory_name,
          Subcategory_description,
          ...(gender && { gender }), // ✅ Include gender only if present
        }
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create subcategory"
      );
    }
  }
);

// Update SubCategory
export const updateSubCategory = createAsyncThunk(
  "subcategory/updateSubCategory",
  async (
    {
      id,
      category_id,
      Subcategory_name,
      Subcategory_description,
      status,
      gender, // ✅ Accept optional gender
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/subcategories/update/${id}`,
        {
          category_id,
          Subcategory_name,
          Subcategory_description,
          status,
          ...(gender && { gender }), // ✅ Send only if present
        }
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update subcategory"
      );
    }
  }
);


// Delete SubCategory
export const deleteSubCategory = createAsyncThunk(
  "subcategory/deleteSubCategory",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/subcategories/delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete subcategory"
      );
    }
  }
);

const subcategorySlice = createSlice({
  name: "subcategory",
  initialState: {
    subcategories: {},
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // ✅ Create SubCategory
      .addCase(createSubCategory.fulfilled, (state, action) => {
        const newSubCategory = action.payload;
        const categoryId = newSubCategory.category_id;
        if (!state.subcategories[categoryId]) {
          state.subcategories[categoryId] = [];
        }
        state.subcategories[categoryId].push(newSubCategory);
      })
      .addCase(createSubCategory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Fetch Subcategories
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        const { categoryId, subcategories } = action.payload;
        state.subcategories[categoryId] = subcategories;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update SubCategory
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        const updatedSubCategory = action.payload;
        const categoryId = updatedSubCategory.category_id;
        if (state.subcategories[categoryId]) {
          const index = state.subcategories[categoryId].findIndex(
            (subcat) =>
              subcat.Subcategory_id === updatedSubCategory.Subcategory_id
          );
          if (index !== -1) {
            state.subcategories[categoryId][index] = updatedSubCategory;
          }
        }
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete SubCategory
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        const deletedSubCategoryId = action.payload;
        for (const categoryId in state.subcategories) {
          state.subcategories[categoryId] = state.subcategories[
            categoryId
          ].filter((subcat) => subcat.Subcategory_id !== deletedSubCategoryId);
        }
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default subcategorySlice.reducer;
