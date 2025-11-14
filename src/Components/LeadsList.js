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
    <div className="leads-page">
      <Sidebar />
      <main className="leads-content">
        <h1>Coupon Leads</h1>

        {status === "loading" && <p>Loading...</p>}
        {status === "failed" && <p className="error-message">Error: {error}</p>}

        {status === "succeeded" && (
          <div className="leads-table-container">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Mobile Number</th>
                  <th>Coupon Code</th>
                  <th>Date Joined</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => {
                  const coupon = couponMap[lead.couponCode];
                  const used = coupon ? coupon.usedCount > 0 : false;

                  return (
                    <tr key={lead._id}>
                      <td>{index + 1}</td>
                      <td>{lead.name}</td>
                      <td>{lead.mobile}</td>
                      <td>{lead.couponCode}</td>
                      <td>{formatLeadDate(lead.backendCreatedAt || lead.createdAt)}</td>
                      <td>
                        <span className={`status-badge ${used ? "used" : "not-used"}`}>
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
