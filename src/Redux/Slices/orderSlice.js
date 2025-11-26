import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../Components/Helper/axiosinstance";

// Async thunk to fetch all orders with payment info (admin dashboard)
export const fetchOrdersWithPayments = createAsyncThunk(
  "orders/fetchOrdersWithPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/orders/order-payment`); // Use your actual backend API URL
      return response.data.orders; // response.orders is the array we want
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// ✅ New thunk to get a specific order with payment info by order_id
export const fetchOrderWithPaymentById = createAsyncThunk(
  "orders/fetchOrderWithPaymentById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/orders/order-payment/${orderId}`
      ); // Adjust if route is different
      return response.data; // Contains { order, payment }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order details"
      );
    }
  }
);

// Add this below fetchOrderWithPaymentById
export const updateOrderStatusById = createAsyncThunk(
  "orders/updateOrderStatusById",
  async ({ order_id, order_status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/orders/update-status/${order_id}`,
        { order_status }
      );
      return response.data.order; // return updated order
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  }
);

// ✅ NEW: Delete order by ID
export const deleteOrderById = createAsyncThunk(
  "orders/deleteOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/orders/${orderId}`);
      return { orderId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete order"
      );
    }
  }
);


const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [], // For all orders with payment info
    selectedOrder: null, // For single order with payment info
    loading: false,
    error: null,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // For all orders with payments
      .addCase(fetchOrdersWithPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersWithPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersWithPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ For single order by ID
      .addCase(fetchOrderWithPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedOrder = null;
      })
      .addCase(fetchOrderWithPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload; // Contains { order, payment }
      })
      .addCase(fetchOrderWithPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Update Order Status
      .addCase(updateOrderStatusById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatusById.fulfilled, (state, action) => {
        state.loading = false;

        // Update the status in the selectedOrder if it matches
        if (
          state.selectedOrder &&
          state.selectedOrder.order.order_id === action.payload.order_id
        ) {
          state.selectedOrder.order = {
            ...state.selectedOrder.order,
            ...action.payload,
          };
        }

        // Also update it in the orders list if present
        state.orders = state.orders.map((order) =>
          order.order_id === action.payload.order_id
            ? { ...order, order_status: action.payload.order_status }
            : order
        );
      })
      .addCase(updateOrderStatusById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ NEW: Delete Order Cases
      .addCase(deleteOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Remove the deleted order from the orders array
        state.orders = state.orders.filter(
          (order) => order.order_id !== action.payload.orderId
        );
        // Clear selectedOrder if it was the deleted one
        if (state.selectedOrder?.order?.order_id === action.payload.orderId) {
          state.selectedOrder = null;
        }
      })
      .addCase(deleteOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError, clearSelectedOrder } = orderSlice.actions;

export default orderSlice.reducer;
