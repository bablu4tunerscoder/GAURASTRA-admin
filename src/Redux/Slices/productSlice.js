import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../Components/Helper/axiosinstance";
import baseQueryOnline from "./api/baseQuery"
// ==================== RTK Query API ====================
export const productApi = createApi({
  reducerPath: "productApi",
  baseQueryOnline,
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
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

// Export hooks for usage in components
export const {
  useFetchProductsQuery,
  useLazyFetchProductsQuery,
  useFetchProductByIdQuery,
  useLazyFetchProductByIdQuery,
  useAddBulkProductsMutation,
  useUpdateProductByIdMutation,
  useDeleteProductByIdMutation,
} = productApi;

// ==================== Local State Slice ====================
const productSlice = createSlice({
  name: "product",
  initialState: {
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
      images: [],
      cover_image: "",
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: [],
      },
    },
    isEditMode: false,
  },
  reducers: {
    // ========== Create New Products ==========
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

    // ========== Update Products ==========
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

      // Reset update product
      state.updateProduct = {
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
        images: [],
        cover_image: "",
        seo: {
          metaTitle: "",
          metaDescription: "",
          keywords: [],
        },
      };
    },

    clearProductToEdit: (state) => {
      state.productToUpdate = {};
    },

    setEditMode: (state, action) => {
      state.isEditMode = action.payload;
    },

    resetCurrentProductMedia: (state) => {
      state.updateProduct.mediaUrls = [];
      state.updateProduct.cover_image = "";
    },

    // Set update product from API response
    setUpdateProductFromApi: (state, action) => {
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
    },

    // Reset current product
    resetCurrentProduct: (state) => {
      state.currentProduct = {
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
    },

    // Reset update product
    resetUpdateProduct: (state) => {
      state.updateProduct = {
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
        images: [],
        cover_image: "",
        seo: {
          metaTitle: "",
          metaDescription: "",
          keywords: [],
        },
      };
    },
  },
});

// Export actions
export const {
  updateNewProduct,
  saveCurrentProduct,
  clearProductsToSubmit,
  resetCurrentProductMedia,
  clearProductToEdit,
  editCurrentProduct,
  editProduct,
  setEditMode,
  setUpdateProductFromApi,
  resetCurrentProduct,
  resetUpdateProduct,
} = productSlice.actions;

// Export reducer
export default productSlice.reducer;