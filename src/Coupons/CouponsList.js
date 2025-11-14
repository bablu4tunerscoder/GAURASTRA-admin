import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoupons, deleteCoupon } from "../Redux/Slices/couponSlice";
import "./CouponList.scss";
import Sidebar from "../Components/Sidebar/sidebar";
import AddCoupon from "./AddCoupons";
import EditCoupon from "./EditCoupons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const CouponsList = () => {
  const dispatch = useDispatch();
  const { coupons, isLoading, error } = useSelector((state) => state.coupon);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteCoupon(id));
    dispatch(fetchCoupons());
  };

  const formatCouponDate = (expiryDateString) => {
  if (!expiryDateString) return "N/A";
  const expiryDate = dayjs(expiryDateString);
  const now = dayjs();
  const diffText = expiryDate.diff(now, "day") > 0
    ? `in ${expiryDate.diff(now, "day")} day(s)`
    : `${-expiryDate.diff(now, "day")} day(s) ago`;

  return `${expiryDate.format("DD MMM YYYY, hh:mm A")} (${diffText})`;
};


  return (
    <div className="layout">
      <Sidebar />

      <div className="coupon-container">
        <div className="coupon-header">
          <h1>All Coupons</h1>
          <div className="coupon-button">
            <button className="create-btn" onClick={() => setIsModalOpen(true)}>
              Create Coupon
            </button>
          </div>
        </div>

        {isLoading ? (
          <p>Loading coupons...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : coupons.length === 0 ? (
          <p className="info-message">No Coupons Found</p>
        ) : (
          <div className="table-container">
            <table className="coupon-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Min Amount</th>
                  <th>Status</th>
                  <th>Expires</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon, index) => (
                  <tr key={coupon.coupon_id}>
                    <td>{index + 1}</td>
                    <td>{coupon.code}</td>
                    <td>{coupon.discountType}</td>
                    <td>
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}
                    </td>
                    <td>₹{coupon.minCartAmount || 0}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          coupon.status === "Active" ? "active" : "inactive"
                        }`}
                      >
                        {coupon.status}
                      </span>
                    </td>
                    <td>{formatCouponDate(coupon.expiresAt)}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(coupon)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(coupon.coupon_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && <AddCoupon onClose={() => setIsModalOpen(false)} />}

      {isEditModalOpen && (
        <EditCoupon
          onClose={() => setIsEditModalOpen(false)}
          coupon={selectedCoupon}
        />
      )}
    </div>
  );
};

export default CouponsList;
