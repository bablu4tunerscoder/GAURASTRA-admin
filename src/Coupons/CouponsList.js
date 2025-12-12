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
    <div className="flex">


      {/* Main Container */}
      <div className="flex-1 p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold">All Coupons</h1>

          <button
            className="bg-blue-500 mx-2 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
            onClick={() => setIsModalOpen(true)}
          >
            Create Coupon
          </button>
        </div>

        {/* Table */}
        {isLoading ? (
          <p>Loading coupons...</p>
        ) : error ? (
          <p className="text-red-600 font-medium">{error}</p>
        ) : coupons.length === 0 ? (
          <p className="text-gray-600 italic">No Coupons Found</p>
        ) : (
          <div className="w-full overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="w-full border-collapse min-w-[900px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">S.No</th>
                  <th className="px-4 py-2 border">Code</th>
                  <th className="px-4 py-2 border">Type</th>
                  <th className="px-4 py-2 border">Value</th>
                  <th className="px-4 py-2 border">Min Amount</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Expires</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>

              <tbody>
                {coupons.map((coupon, index) => (
                  <tr
                    key={coupon.coupon_id}
                    className="odd:bg-white even:bg-gray-50"
                  >
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{coupon.code}</td>
                    <td className="px-4 py-2 border">{coupon.discountType}</td>

                    <td className="px-4 py-2 border">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}
                    </td>

                    <td className="px-4 py-2 border">₹{coupon.minCartAmount || 0}</td>

                    <td className="px-4 py-2 border">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${coupon.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {coupon.status}
                      </span>
                    </td>

                    <td className="px-4 py-2 border">
                      {formatCouponDate(coupon.expiresAt)}
                    </td>

                    <td className="px-4 py-2 border space-x-2">
                      <button
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        onClick={() => handleEdit(coupon)}
                      >
                        Edit
                      </button>

                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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
    </div>

  );
};

export default CouponsList;
