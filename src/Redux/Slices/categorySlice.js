import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../Components/Helper/axiosinstance";

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/categories/findAll`);
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

// Fetch subcategories by category ID
export const fetchSubcategories = createAsyncThunk(
  "category/fetchSubcategories",
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

// Create category
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async ({ category_name, category_description }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/categories/create`, {
        category_name,
        category_description,
      });

      return response.data.data; // Return newly created category
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create category"
      );
    }
  }
);

// **Update category**
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, category_name, category_description, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/categories/update/${id}`, {
        category_name,
        category_description,
        status,
      });

      return response.data.data; // Return updated category
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update category"
      );
    }
  }
);

// **Delete category**
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/categories/delete/${id}`);
      return id; // Return deleted category ID
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete category"
      );
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    subcategories: {},
    selectedCategory: null,
    selectedSubcategory: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.selectedSubcategory = null;
    },
    setSelectedSubcategory: (state, action) => {
      state.selectedSubcategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create Category
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
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

      // **Update Category**
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload;
      })

      // **Delete Category**
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setSelectedCategory, setSelectedSubcategory } = categorySlice.actions;
export default categorySlice.reducer;
