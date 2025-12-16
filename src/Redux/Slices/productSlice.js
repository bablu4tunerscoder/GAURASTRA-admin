import { createSlice } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryOnline from "./api/baseQuery";

// ==================== RTK Query API ====================
export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: baseQueryOnline,
  tagTypes: ["Product", "ProductList"],

  endpoints: (builder) => ({
    // Fetch all products
    fetchProducts: builder.query({
      query: () => "/api/Productes/ProductDetail",
      transformResponse: (response) => response.data || [],
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ product_id }) => ({
              type: "Product",
              id: product_id,
            })),
            { type: "ProductList", id: "LIST" },
          ]
          : [{ type: "ProductList", id: "LIST" }],
    }),

    // Fetch product by ID
    fetchProductById: builder.query({
      query: (productId) => `/api/Productes/product/${productId}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),

    // Add bulk products
    addBulkProducts: builder.mutation({
      query: (products) => ({
        url: "/api/Productes/addBulk-products",
        method: "POST",
        body: { products },
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: [{ type: "ProductList", id: "LIST" }],
    }),

    // Update product by ID
    updateProductById: builder.mutation({
      query: ({ product_id, productData }) => ({
        url: `/api/Productes/update-products/${product_id}`,
        method: "PUT",
        body: productData,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: (result, error, { product_id }) => [
        { type: "Product", id: product_id },
        { type: "ProductList", id: "LIST" },
      ],
    }),

    // Delete product by ID
    deleteProductById: builder.mutation({
      query: (productId) => ({
        url: `/api/Productes/delete-products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, productId) => [
        { type: "Product", id: productId },
        { type: "ProductList", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks
export const {
  useFetchProductsQuery,
  useLazyFetchProductsQuery,
  useFetchProductByIdQuery,
  useLazyFetchProductByIdQuery,
  useAddBulkProductsMutation,
  useUpdateProductByIdMutation,
  useDeleteProductByIdMutation,
} = productApi;

// ==================== Product Slice ====================
const initialProductState = {
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
};

const productSlice = createSlice({
  name: "product",
  initialState: {
    // Data from API
    products: [],
    currentProduct: null,

    // UI State
    loading: false,
    error: null,
    isEditMode: false,

    // Form State
    formData: { ...initialProductState },
    productsToSubmit: [],
  },
  reducers: {
    // Form Management
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },

    resetFormData: (state) => {
      state.formData = { ...initialProductState };
    },

    // Products to Submit
    addToSubmitQueue: (state) => {
      const { formData } = state;

      // Validate
      if (!formData.product_name || !formData.category_id || !formData.Subcategory_id) {
        return;
      }

      state.productsToSubmit.push({
        ...formData,
        pricing: {
          ...formData.pricing,
          original_price: parseFloat(formData.pricing.original_price) || 0,
          discount_percent: formData.pricing.discount_percent !== null
            ? parseFloat(formData.pricing.discount_percent)
            : null,
        },
        stock: {
          quantity: parseInt(formData.stock.quantity) || 0,
        },
      });

      // Reset form
      state.formData = { ...initialProductState };
    },

    removeFromSubmitQueue: (state, action) => {
      state.productsToSubmit = state.productsToSubmit.filter(
        (_, index) => index !== action.payload
      );
    },

    clearSubmitQueue: (state) => {
      state.productsToSubmit = [];
    },

    // Edit Mode
    setEditMode: (state, action) => {
      state.isEditMode = action.payload;
    },

    loadProductToForm: (state, action) => {
      const data = action.payload;
      state.formData = {
        ...data,
        pricing: {
          sku: data?.latest_pricing?.sku || "",
          currency: data?.latest_pricing?.currency || "INR",
          original_price: data?.latest_pricing?.price_detail?.original_price || 0,
          discount_percent: data?.latest_pricing?.price_detail?.discount_percent || null,
        },
        stock: {
          quantity: data?.stock_details?.[0]?.quantity || 0,
        },
      };
      state.isEditMode = true;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ========== FETCH PRODUCTS ==========
      .addMatcher(
        productApi.endpoints.fetchProducts.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        productApi.endpoints.fetchProducts.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.products = action.payload;
        }
      )
      .addMatcher(
        productApi.endpoints.fetchProducts.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message || "Failed to fetch products";
        }
      )

      // ========== FETCH PRODUCT BY ID ==========
      .addMatcher(
        productApi.endpoints.fetchProductById.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        productApi.endpoints.fetchProductById.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.currentProduct = action.payload;
        }
      )
      .addMatcher(
        productApi.endpoints.fetchProductById.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message || "Failed to fetch product";
        }
      )

      // ========== ADD BULK PRODUCTS ==========
      .addMatcher(
        productApi.endpoints.addBulkProducts.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        productApi.endpoints.addBulkProducts.matchFulfilled,
        (state) => {
          state.loading = false;
          state.productsToSubmit = [];
          state.formData = { ...initialProductState };
        }
      )
      .addMatcher(
        productApi.endpoints.addBulkProducts.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message || "Failed to add products";
        }
      )

      // ========== UPDATE PRODUCT ==========
      .addMatcher(
        productApi.endpoints.updateProductById.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        productApi.endpoints.updateProductById.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.currentProduct = action.payload;
          state.formData = { ...initialProductState };
          state.isEditMode = false;
        }
      )
      .addMatcher(
        productApi.endpoints.updateProductById.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message || "Failed to update product";
        }
      )

      // ========== DELETE PRODUCT ==========
      .addMatcher(
        productApi.endpoints.deleteProductById.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        productApi.endpoints.deleteProductById.matchFulfilled,
        (state, action) => {
          state.loading = false;
          const deletedId = action.meta.arg.originalArgs;
          state.products = state.products.filter(
            (p) => p.product_id !== deletedId
          );
        }
      )
      .addMatcher(
        productApi.endpoints.deleteProductById.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message || "Failed to delete product";
        }
      );
  },
});

// Export actions
export const {
  updateFormData,
  resetFormData,
  addToSubmitQueue,
  removeFromSubmitQueue,
  clearSubmitQueue,
  setEditMode,
  loadProductToForm,
  clearError,
} = productSlice.actions;

// Export reducer
export default productSlice.reducer;

// ==================== Selectors ====================
export const selectProducts = (state) => state.product.products;
export const selectCurrentProduct = (state) => state.product.currentProduct;
export const selectFormData = (state) => state.product.formData;
export const selectProductsToSubmit = (state) => state.product.productsToSubmit;
export const selectLoading = (state) => state.product.loading;
export const selectError = (state) => state.product.error;
export const selectIsEditMode = (state) => state.product.isEditMode;