import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  useGetUserCouponsQuery,
  useDeleteUserCouponMutation,
} from "../Redux/Slices/couponSlice";
import AddCoupon from "./AddCoupons";
import EditCoupon from "./EditCoupons";

dayjs.extend(relativeTime);

const CouponsList = () => {
  const { data: coupons = [], isLoading, isError, error } = useGetUserCouponsQuery();
  const [deleteCoupon] = useDeleteUserCouponMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      await deleteCoupon(id);
    }
  };

  const formatCouponDate = (expiryDateString) => {
    if (!expiryDateString) return "N/A";
    const expiryDate = dayjs(expiryDateString);
    const now = dayjs();
    const diffText =
      expiryDate.diff(now, "day") > 0
        ? `in ${expiryDate.diff(now, "day")} day(s)`
        : `${-expiryDate.diff(now, "day")} day(s) ago`;
    return `${expiryDate.format("DD MMM YYYY, hh:mm A")} (${diffText})`;
  };

  return (
    <div className="w-full">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">All Coupons</h1>
          <button
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
            onClick={() => setIsModalOpen(true)}
          >
            Create Coupon
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-600">Loading coupons...</p>
        ) : isError ? (
          <p className="text-red-600 font-medium">{error}</p>
        ) : coupons.length === 0 ? (
          <p className="text-gray-600 italic">No Coupons Found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full rounded-lg overflow-hidden">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-4 py-3 text-white font-medium text-left">S.No</th>
                  <th className="px-4 py-3 text-white font-medium text-left">Code</th>
                  <th className="px-4 py-3 text-white font-medium text-left">Type</th>
                  <th className="px-4 py-3 text-white font-medium text-left">Value</th>
                  <th className="px-4 py-3 text-white font-medium text-left">Min Amount</th>
                  <th className="px-4 py-3 text-white font-medium text-left">Status</th>
                  <th className="px-4 py-3 text-white font-medium text-left">Expires</th>
                  <th className="px-4 py-3 text-white font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon, index) => (
                  <tr
                    key={coupon.coupon_id}
                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{coupon.code}</td>
                    <td className="px-4 py-3">{coupon.discountType}</td>
                    <td className="px-4 py-3">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}
                    </td>
                    <td className="px-4 py-3">₹{coupon.minCartAmount || 0}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${coupon.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {coupon.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{formatCouponDate(coupon.expiresAt)}</td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white border border-blue-500 rounded hover:bg-blue-600 hover:border-blue-600 text-sm"
                        onClick={() => handleEdit(coupon)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white border border-red-500 rounded hover:bg-red-600 hover:border-red-600 text-sm"
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

        {isModalOpen && <AddCoupon onClose={() => setIsModalOpen(false)} />}
        {isEditModalOpen && (
          <EditCoupon onClose={() => setIsEditModalOpen(false)} coupon={selectedCoupon} />
        )}
      </div>
    </div>

  );
};

export default CouponsList;
