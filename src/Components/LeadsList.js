import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeads } from "../Redux/Slices/leadSlice";
import Sidebar from "./Sidebar/sidebar";
import "./LeadsList.scss";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const LeadsList = () => {
  const dispatch = useDispatch();
  const { leads, status, error } = useSelector((state) => state.leads);
  const [couponMap, setCouponMap] = useState({}); // map couponCode -> coupon

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  useEffect(() => {
    const fetchCoupons = async () => {
      if (leads.length === 0) return;

      const codes = leads.map((lead) => lead.couponCode);
      try {
        const res = await axios.post("/api/coupons/bulk", { codes });
        const map = {};
        res.data.forEach((coupon) => {
          map[coupon.code] = coupon;
        });
        setCouponMap(map);
      } catch (err) {
        console.error("Error fetching coupons in bulk:", err);
      }
    };

    fetchCoupons();
  }, [leads]);

  const formatLeadDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = dayjs(dateString);
    return `${date.format("DD MMM YYYY, hh:mm A")} (${date.fromNow()})`;
  };

  return (
    <div className="w-full">
      <main className="leads-content max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Coupon Leads</h1>

        {status === "loading" && <p className="text-gray-500">Loading...</p>}
        {status === "failed" && (
          <p className="text-red-600 font-medium">Error: {error}</p>
        )}

        {status === "succeeded" && (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">#</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Name</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Mobile Number</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Coupon Code</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Date Joined</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {leads.map((lead, index) => {
                  const coupon = couponMap[lead.couponCode];
                  const used = coupon ? coupon.usedCount > 0 : false;

                  return (
                    <tr key={lead._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{lead.name}</td>
                      <td className="px-4 py-2">{lead.mobile}</td>
                      <td className="px-4 py-2 font-mono">{lead.couponCode}</td>
                      <td className="px-4 py-2">{formatLeadDate(lead.backendCreatedAt || lead.createdAt)}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-medium ${used ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                            }`}
                        >
                          {used ? "Used" : "Not Used"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>

  );
};

export default LeadsList;
