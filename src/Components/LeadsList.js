import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeads } from "../Redux/Slices/leadSlice";

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
      <div className="bg-white shadow rounded-lg p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Coupon Leads
          </h1>
        </div>

        {status === "loading" && (
          <p className="text-gray-600">Loading...</p>
        )}

        {status === "failed" && (
          <p className="text-red-600 font-medium">Error: {error}</p>
        )}

        {status === "succeeded" && (
          <div className="overflow-x-auto">
            <table className="w-full rounded-lg overflow-hidden">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-4 py-3 text-white font-medium text-left">S.No</th>
                  <th className="px-4 py-3 text-white font-medium text-left">Name</th>
                  <th className="px-4 py-3 text-white font-medium text-left">
                    Mobile Number
                  </th>
                  <th className="px-4 py-3 text-white font-medium text-left">
                    Coupon Code
                  </th>
                  <th className="px-4 py-3 text-white font-medium text-left">
                    Date Joined
                  </th>
                  <th className="px-4 py-3 text-white font-medium text-center">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead, index) => {
                  const coupon = couponMap[lead.couponCode];
                  const used = coupon ? coupon.usedCount > 0 : false;

                  return (
                    <tr
                      key={lead._id}
                      className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{lead.name}</td>
                      <td className="px-4 py-3">{lead.mobile}</td>
                      <td className="px-4 py-3 font-mono">
                        {lead.couponCode}
                      </td>
                      <td className="px-4 py-3">
                        {formatLeadDate(
                          lead.backendCreatedAt || lead.createdAt
                        )}
                      </td>
                      <td className="px-4 py-3 flex justify-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${used
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
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
      </div>
    </div>


  );
};

export default LeadsList;
