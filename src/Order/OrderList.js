// src/pages/OrderList.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderWithPaymentById,
  fetchOrdersWithPayments,
  updateOrderStatusById,
  deleteOrderById,
} from "../Redux/Slices/orderSlice";
import "./OrderList.scss";
import Sidebar from "../Components/Sidebar/sidebar";

const ORDER_STATUSES = ["Dispatched", "Shipped", "Delivered", "Cancelled"];

const OrderList = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    orderId: null,
    orderIndex: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(""); // "success" | "failed"

  const ordersPerPage = 10;

  useEffect(() => {
    dispatch(fetchOrdersWithPayments());
  }, [dispatch]);

  const handleStatusChange = (order_id, order_status) => {
    dispatch(updateOrderStatusById({ order_id, order_status }));
  };

  const handleView = (id) => {
    dispatch(fetchOrderWithPaymentById(id)).then((res) => {
      setSelectedOrder(res?.payload);
    });
  };

  const handleDeleteClick = (orderId, orderIndex) => {
    setDeleteConfirm({ show: true, orderId, orderIndex });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.orderId) return;

    setDeleteLoading(true);
    try {
      const result = await dispatch(deleteOrderById(deleteConfirm.orderId));

      if (result.type.endsWith("/fulfilled")) {
        setStatusMessage("Order deleted successfully!");
        setStatusType("success");
      } else {
        setStatusMessage(result.payload || "Failed to delete order");
        setStatusType("failed");
      }
      setTimeout(() => setStatusMessage(""), 3000);
      dispatch(fetchOrdersWithPayments());
    } catch (error) {
      alert("Error deleting order: " + error.message);
      console.error("Delete error:", error);
    } finally {
      setDeleteLoading(false);
      setDeleteConfirm({ show: false, orderId: null, orderIndex: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, orderId: null, orderIndex: null });
  };

  const filteredOrders = orders.filter((order) => {
    const orderId = order?.order_id?.toLowerCase() || "";
    const customerName = order?.user?.name?.toLowerCase() || "";
    const phone = order?.delivery_address?.phone?.toLowerCase() || "";
    const transactionId =
      order?.payment?.merchant_transaction_id?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();

    return (
      orderId.includes(term) ||
      customerName.includes(term) ||
      phone.includes(term) ||
      transactionId.includes(term)
    );
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div>
      <Sidebar />
      <div className="order-list">
        <h2>Order List</h2>

        {/* Status Message */}
        {statusMessage && (
          <div className={`status-message ${statusType}`}>{statusMessage}</div>
        )}

        <input
          type="text"
          placeholder="Search by Order ID, Transaction ID, Name or Phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <div className="table-container">
              {currentOrders.length === 0 ? (
                <p className="no-results">No matching orders found.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Customer Name</th>
                      <th>Phone</th>
                      <th>Amount</th>
                      <th>Payment Status</th>
                      <th>Order Status</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.map((order, index) => (
                      <tr key={order?.order_id}>
                        <td>{indexOfFirstOrder + index + 1}</td>
                        <td>{order?.user.name}</td>
                        <td>{order?.delivery_address?.phone}</td>
                        <td>₹{order?.total_order_amount?.toFixed(2)}</td>
                        <td>
                          <div
                            className={`payment-status ${
                              order?.payment?.payment_status?.toUpperCase() ===
                              "SUCCESS"
                                ? "success"
                                : "failed"
                            }`}
                          >
                            {order?.payment?.payment_status}
                          </div>
                        </td>

                        <td>
                          <select
                            value={order?.order_status || "Pending"}
                            onChange={(e) =>
                              handleStatusChange(
                                order?.order_id,
                                e.target.value
                              )
                            }
                            className={`status-dropdown ${order?.order_status?.toLowerCase()}`}
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          {new Date(order?.createdAt).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="action-buttons">
                          <button
                            className="view-btn"
                            onClick={() => handleView(order?.order_id)}
                          >
                            View Details
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDeleteClick(order?.order_id, index)
                            }
                            disabled={deleteLoading}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {filteredOrders.length > ordersPerPage && (
              <div className="pagination">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="delete-confirm-modal">
            <div className="modal-content">
              <h3>Confirm Deletion</h3>
              <p>
                Are you sure you want to delete this order? This action cannot
                be undone and will permanently remove the order from the
                database.
              </p>
              <div className="modal-buttons">
                <button
                  className="confirm-delete-btn"
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
                <button
                  className="cancel-delete-btn"
                  onClick={handleDeleteCancel}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Popup */}
        {selectedOrder && (
          <div className="order-popup">
            <div className="popup-content">
              <h2>Order Details</h2>

              <p>
                <strong>Order ID:</strong> {selectedOrder?.order?.order_id}
              </p>
              <p>
                <strong>Transaction ID:</strong>{" "}
                {selectedOrder?.payment?.merchant_transaction_id}
              </p>
              <p>
                <strong>Customer Name:</strong>{" "}
                {selectedOrder?.order?.user?.name}
              </p>
              <p>
                <strong>Email: </strong>
                {selectedOrder?.order?.user?.email}
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                {selectedOrder?.order?.delivery_address?.phone}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {selectedOrder?.order?.delivery_address?.street},{" "}
                {selectedOrder?.order?.delivery_address?.city},{" "}
                {selectedOrder?.order?.delivery_address?.state},{" "}
                {selectedOrder?.order?.delivery_address?.pincode}
              </p>
              <p>
                <strong>Order Status:</strong>{" "}
                {selectedOrder?.order?.order_status}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                {selectedOrder?.payment?.payment_status}
              </p>
              <p>
                <strong>Currency:</strong> {selectedOrder?.payment?.currency}
              </p>

              {/* Status History Section */}
              {selectedOrder?.order?.status_history?.length > 0 && (
                <>
                  <hr />
                  <h2>Status History</h2>
                  <ul>
                    {selectedOrder.order.status_history.map((status, idx) => (
                      <li key={idx}>
                        <strong>{status.status}</strong> —{" "}
                        {new Date(status.changed_at).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                        {status.notes ? ` (${status.notes})` : ""}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <hr />
              <h2>Product Details</h2>
              <ul>
                {selectedOrder.order.products.map((product) => (
                  <React.Fragment key={product.product_id}>
                    <li>
                      <strong>Name: </strong>
                      {product?.name}
                    </li>
                    <li>
                      <strong>Price: </strong>
                      {product?.total_price?.toFixed(2)}{" "}
                      {selectedOrder?.payment?.currency}
                    </li>
                    <li>
                      <strong>Size: </strong>
                      {product?.size}
                    </li>
                    <li>
                      <strong>Quantity: </strong>
                      {product?.quantity} pcs
                    </li>
                  </React.Fragment>
                ))}
              </ul>
              <button
                className="close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
