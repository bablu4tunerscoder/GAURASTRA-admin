import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../Components/Helper/axiosinstance";

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async () => {
    const response = await axios.get(`${BASE_URL}/api/Productes/ProductDetail`);
    return response.data;
  }
);

export const addBulkProducts = createAsyncThunk(
  "product/addBulkProducts",
  async (_, { getState }) => {
    const { productsToSubmit } = getState().product;
    const response = await axios.post(
      `${BASE_URL}/api/Productes/addBulk-products`,
      { products: productsToSubmit },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  }
);

// Get Product By Id
export const fetchProductById = createAsyncThunk(
  "product/fetchProductDetailsById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/Productes/product/${productId}`
      );
      return response.data.data; // Assuming product details are under `data` field
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details"
      );
    }
  }
);

// Update Product By ID
export const updateProductById = createAsyncThunk(
  "product/updateProductById",
  async ({ product_id }, { rejectWithValue, getState }) => {
    console.log("Product id from slice : ");
    try {
      const { productToUpdate } = getState().product;
      console.log("Product to update : ", productToUpdate);
      const response = await axios.put(
        `${BASE_URL}/api/Productes/update-products/${product_id}`,
        productToUpdate,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

// Delete Product
export const deleteProductById = createAsyncThunk(
  "product/deleteById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/Productes/delete-products/${productId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    productsToSubmit: [],
    productToUpdate: {},
    currentProduct: {
      product_name: "",
      description: "",
      brand: "",
      featuredSection: "All Products",
      category_id: "",
      category_name: "",
      Subcategory_id: "",
      Subcategory_name: "",
      attributes: {},
      pricing: {
        sku: "",
        original_price: 0,
        discount_percent: null,
        currency: "INR",
      },
      stock: {
        quantity: 0,
      },
      mediaUrls: [],
      cover_image: "",
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: [],
      },
    },
    updateProduct: {
      product_name: "",
      description: "",
      brand: "Gaurastra",
      featuredSection: "All Products",
      category_id: "",
      category_name: "",
      Subcategory_id: "",
      Subcategory_name: "",
      attributes: {},
      pricing: {
        sku: "",
        original_price: 0,
        discount_percent: null,
        currency: "INR",
      },
      stock: {
        quantity: 0,
      },
      mediaUrls: [],
      images: [], // Add this to track images with IDs
      cover_image: "",
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: [],
      },
    },
    isEditMode: false,
    status: "idle",
    error: null,
  },
  reducers: {
    // Create New Products
    updateNewProduct: (state, action) => {
      state.currentProduct = {
        ...state.currentProduct,
        ...action.payload,
      };
    },
    saveCurrentProduct: (state) => {
      // Validate required fields
      if (
        !state.currentProduct.product_name ||
        !state.currentProduct.category_id ||
        !state.currentProduct.Subcategory_id
      ) {
        return;
      }

      // Add current product to productsToSubmit array
      state.productsToSubmit = [
        ...state.productsToSubmit,
        {
          ...state.currentProduct,
          pricing: {
            ...state.currentProduct.pricing,
            original_price:
              parseFloat(state.currentProduct.pricing.original_price) || 0,
            discount_percent:
              state.currentProduct.pricing.discount_percent !== null
                ? parseFloat(state.currentProduct.pricing.discount_percent)
                : null,
          },
          stock: {
            quantity: parseInt(state.currentProduct.stock.quantity) || 0,
          },
        },
      ];

      // Reset current product for new entry
      state.currentProduct = {
        product_name: "",
        description: "",
        brand: "",
        category_id: "",
        category_name: "",
        Subcategory_id: "",
        Subcategory_name: "",
        attributes: {},
        pricing: {
          sku: "",
          original_price: 0,
          discount_percent: null,
          currency: "INR",
        },
        stock: {
          quantity: 0,
        },
        mediaUrls: [],
        cover_image: "",
        seo: {
          metaTitle: "",
          metaDescription: "",
          keywords: [],
        },
      };
    },
    clearProductsToSubmit: (state) => {
      state.productsToSubmit = [];
    },
    // Update New Products
    editProduct: (state, action) => {
      state.updateProduct = {
        ...state.updateProduct,
        ...action.payload,
      };
    },
    editCurrentProduct: (state) => {
      if (
        !state.updateProduct.product_name ||
        !state.updateProduct.category_id ||
        !state.updateProduct.Subcategory_id
      ) {
        return;
      }

      const { price_detail, ...restPricing } = state.updateProduct.pricing;

      state.productToUpdate = {
        ...state.updateProduct,
        pricing: {
          ...restPricing,
          original_price: parseFloat(price_detail?.original_price) || 0,
          discount_percent:
            price_detail?.discount_percent !== null
              ? parseFloat(price_detail?.discount_percent)
              : null,
        },
      };

      // Reset
      state.updateProduct = {
        product_name: "",
        description: "",
        brand: "",
        category_id: "",
        category_name: "",
        Subcategory_id: "",
        Subcategory_name: "",
        attributes: {},
        pricing: {
          sku: "",
          original_price: 0,
          discount_percent: null,
          currency: "INR",
        },
        stock: {
          quantity: 0,
        },
        mediaUrls: [],
        cover_image: "",
        seo: {
          metaTitle: "",
          metaDescription: "",
          keywords: [],
        },
      };
    },

    clearProductToEdit: (state) => {
      state.productToUpdate = [];
    },
    setEditMode: (state, action) => {
      state.isEditMode = action.payload;
    },
    resetCurrentProductMedia: (state) => {
      state.updateProduct.mediaUrls = [];
      state.updateProduct.cover_image = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload?.data || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add Products In Bulk
      .addCase(addBulkProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addBulkProducts.fulfilled, (state) => {
        state.status = "succeeded";
        state.productsToSubmit = [];
      })
      .addCase(addBulkProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch Single Product
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "succeeded";

        const data = action.payload;

        state.updateProduct = {
          ...data,
          pricing: {
            sku: data?.latest_pricing?.sku || "",
            currency: data?.latest_pricing?.currency || "INR",
            price_detail: {
              original_price:
                data?.latest_pricing?.price_detail?.original_price || 0,
              discount_percent:
                data?.latest_pricing?.price_detail?.discount_percent || 0,
            },
          },
          stock: {
            quantity: data?.stock_details?.[0]?.quantity || 0,
          },
        };
      })

      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch product";
      })

      // 🔼 Update product by ID cases
      .addCase(updateProductById.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.message = "";
      })
      .addCase(updateProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        // Optional: Update the product in the list if needed
        const index = state.products.findIndex(
          (p) => p.product_id === action.meta.arg.product_id
        );
        if (index !== -1) {
          state.products[index] = {
            ...state.products[index],
            ...action.meta.arg.updatedData,
          };
        }
      })
      .addCase(updateProductById.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload || "Error updating product";
      })

      // Delete Product By Id
      .addCase(deleteProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(deleteProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.success = false;
      });
  },
});

export const {
  updateNewProduct,
  saveCurrentProduct,
  clearProductsToSubmit,
  resetCurrentProductMedia,
  clearProductToEdit,
  editCurrentProduct,
  editProduct,
  setEditMode,
} = productSlice.actions;
export default productSlice.reducer;
