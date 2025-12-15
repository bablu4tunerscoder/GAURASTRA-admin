import { createSlice } from "@reduxjs/toolkit";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryOnline from "./api/baseQuery";

/* =======================
   RTK QUERY API
======================= */
export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: baseQueryOnline,
  tagTypes: ["Orders", "SingleOrder"],
  endpoints: (builder) => ({
    fetchOrdersWithPayments: builder.query({
      query: () => `/api/orders/order-payment`,
      providesTags: ["Orders"],
    }),

    fetchOrderWithPaymentById: builder.query({
      query: (orderId) => `/api/orders/order-payment/${orderId}`,
      providesTags: (result, error, id) => [
        { type: "SingleOrder", id },
      ],
    }),

    updateOrderStatusById: builder.mutation({
      query: ({ order_id, order_status }) => ({
        url: `/api/orders/update-status/${order_id}`,
        method: "PATCH",
        body: { order_status },
      }),
      invalidatesTags: ["Orders", "SingleOrder"],
    }),

    deleteOrderById: builder.mutation({
      query: (orderId) => ({
        url: `/api/orders/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useFetchOrdersWithPaymentsQuery,
  useFetchOrderWithPaymentByIdQuery,
  useUpdateOrderStatusByIdMutation,
  useDeleteOrderByIdMutation,
} = ordersApi;

/* =======================
   SLICE WITH extraReducers
======================= */
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    selectedOrder: null,
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
      /* ===== Fetch All Orders ===== */
      .addMatcher(
        ordersApi.endpoints.fetchOrdersWithPayments.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        ordersApi.endpoints.fetchOrdersWithPayments.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.orders = action.payload.orders ?? action.payload;
        }
      )
      .addMatcher(
        ordersApi.endpoints.fetchOrdersWithPayments.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message;
        }
      )

      /* ===== Fetch Single Order ===== */
      .addMatcher(
        ordersApi.endpoints.fetchOrderWithPaymentById.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
          state.selectedOrder = null;
        }
      )
      .addMatcher(
        ordersApi.endpoints.fetchOrderWithPaymentById.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.selectedOrder = action.payload;
        }
      )
      .addMatcher(
        ordersApi.endpoints.fetchOrderWithPaymentById.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message;
        }
      )

      /* ===== Update Order Status ===== */
      .addMatcher(
        ordersApi.endpoints.updateOrderStatusById.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        ordersApi.endpoints.updateOrderStatusById.matchFulfilled,
        (state, action) => {
          state.loading = false;
          const updated = action.payload?.order || action.payload;

          if (
            state.selectedOrder?.order?.order_id === updated.order_id
          ) {
            state.selectedOrder.order = {
              ...state.selectedOrder.order,
              ...updated,
            };
          }

          state.orders = state.orders.map((order) =>
            order.order_id === updated.order_id
              ? { ...order, order_status: updated.order_status }
              : order
          );
        }
      )
      .addMatcher(
        ordersApi.endpoints.updateOrderStatusById.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message;
        }
      )

      /* ===== Delete Order ===== */
      .addMatcher(
        ordersApi.endpoints.deleteOrderById.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        ordersApi.endpoints.deleteOrderById.matchFulfilled,
        (state, action) => {
          state.loading = false;
          const deletedId = action.meta.arg;
          state.orders = state.orders.filter(
            (order) => order.order_id !== deletedId
          );

          if (state.selectedOrder?.order?.order_id === deletedId) {
            state.selectedOrder = null;
          }
        }
      )
      .addMatcher(
        ordersApi.endpoints.deleteOrderById.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message;
        }
      );
  },
});

export const { clearOrderError, clearSelectedOrder } =
  orderSlice.actions;

export default orderSlice.reducer;
