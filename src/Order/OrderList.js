import { useState } from "react";
import {
  useDeleteOrderByIdMutation,
  useFetchOrdersWithPaymentsQuery,
  useFetchOrderWithPaymentByIdQuery,
  useUpdateOrderStatusByIdMutation,
} from "../Redux/Slices/orderSlice";

const ORDER_STATUSES = ["Dispatched", "Shipped", "Delivered", "Cancelled"];

const OrderList = () => {
  const { data, isLoading, isError, error, refetch } =
    useFetchOrdersWithPaymentsQuery();

  const orders = data?.orders ?? data ?? [];

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const { data: selectedOrder } = useFetchOrderWithPaymentByIdQuery(
    selectedOrderId,
    { skip: !selectedOrderId }
  );

  const [updateStatus] = useUpdateOrderStatusByIdMutation();
  const [deleteOrder, { isLoading: isDeleting }] =
    useDeleteOrderByIdMutation();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      order?.order_id?.toLowerCase().includes(term) ||
      order?.user?.name?.toLowerCase().includes(term) ||
      order?.delivery_address?.phone?.includes(term) ||
      order?.payment?.merchant_transaction_id
        ?.toLowerCase()
        .includes(term)
    );
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full rounded-lg overflow-hidden">
        <thead className="bg-gray-600 text-left">
          <tr>
            <th className="px-4 py-3 text-white font-medium">S.No</th>
            <th className="px-4 py-3 text-white font-medium">Customer</th>
            <th className="px-4 py-3 text-white font-medium">Phone</th>
            <th className="px-4 py-3 text-white font-medium">Amount</th>
            <th className="px-4 py-3 text-white font-medium">Payment</th>
            <th className="px-4 py-3 text-white font-medium">Order Status</th>
            <th className="px-4 py-3 text-white font-medium">Created</th>
            <th className="px-4 py-3 text-white font-medium text-center">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.map((order, index) => (
            <tr
              key={order.order_id}
              className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
            >
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3">{order?.user?.name}</td>
              <td className="px-4 py-3">
                {order?.delivery_address?.phone}
              </td>
              <td className="px-4 py-3">
                ₹{order?.total_order_amount?.toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${order?.payment?.payment_status === "SUCCESS"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}
                >
                  {order?.payment?.payment_status}
                </span>
              </td>
              <td className="px-4 py-3">
                <select
                  value={order?.order_status}
                  onChange={(e) =>
                    updateStatus({
                      order_id: order.order_id,
                      order_status: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">
                {new Date(order.createdAt).toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-3 flex justify-center gap-2">
                <button
                  onClick={() => setSelectedOrderId(order.order_id)}
                  className="px-3 py-1 bg-blue-500 text-white border border-blue-500 rounded hover:bg-blue-600 hover:border-blue-600 text-sm"
                >
                  View
                </button>
                <button
                  onClick={async () => {
                    await deleteOrder(order.order_id);
                    refetch();
                  }}
                  disabled={isDeleting}
                  className="px-3 py-1 bg-red-500 text-white border border-red-500 rounded hover:bg-red-600 hover:border-red-600 text-sm disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
};

export default OrderList;
