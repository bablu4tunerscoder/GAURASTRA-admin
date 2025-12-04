import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../../Redux/Slices/dashboardSlice";
import "./dashboard.scss";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, loading, error, lastFetchedAt } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Safe getters with fallback
  const realTime = data?.real_time_sales || {};
  const inventory = data?.inventory_status || {};
  const daily = data?.daily_summary || {};
  const gst = data?.gst_report || {};
  const perf = data?.store_performance || {};

  const formatCurrency = (val) =>
    typeof val === "number" ? `₹ ${val.toLocaleString()}` : val || "—";

  return (
    <div className="dash-page">
      <h1 className="dash-title">Store Dashboard</h1>

      {loading && <div className="dash-loading">Loading dashboard...</div>}
      {error && <div className="dash-error">Error: {error}</div>}

      {!loading && !error && data && (
        <>
          <div className="dash-top-cards">
            <div className="card">
              <div className="card-title">Orders Today</div>
              <div className="card-value">{realTime.orders_today ?? "0"}</div>
            </div>

            <div className="card">
              <div className="card-title">Total Sales Today</div>
              <div className="card-value">
                {formatCurrency(realTime.total_sales_today ?? daily.totalSales)}
              </div>
            </div>

            <div className="card">
              <div className="card-title">Items Sold Today</div>
              <div className="card-value">{daily.totalItemsSold ?? "0"}</div>
            </div>

            <div className="card">
              <div className="card-title">Avg Order Value (30 days)</div>
              <div className="card-value">
                {formatCurrency(perf.avgOrderValue ?? 0)}
              </div>
            </div>
          </div>

          <section className="dash-section">
            <h2>Today's Orders</h2>
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {realTime.salesToday && realTime.salesToday.length > 0 ? (
                    realTime.salesToday.map((o, idx) => (
                      <tr key={o._id || idx}>
                        <td>{idx + 1}</td>
                        <td>{o.user_info?.full_name ?? "—"}</td>
                        <td>{o.user_info?.phone ?? "—"}</td>
                        <td>
                          {o.items?.map((it) => (
                            <div key={it._id} className="order-item">
                              {it.title} × {it.quantity} ({formatCurrency(it.line_total)})
                            </div>
                          ))}
                        </td>
                        <td>{formatCurrency(o.total_amount)}</td>
                        <td>{o.payment_method ?? "—"}</td>
                        <td>
                          {o.createdAt
                            ? new Date(o.createdAt).toLocaleString()
                            : "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-data">
                        No orders today
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="dash-section">
            <h2>Inventory Status</h2>
            <div className="inventory-grid">
              <div className="inventory-card">
                <h3>Low Stock</h3>
                {inventory.lowStock && inventory.lowStock.length > 0 ? (
                  <ul>
                    {inventory.lowStock.map((it, i) => (
                      <li key={i}>
                        <strong>{it.product}</strong> — {it.variant} (stock:{" "}
                        {it.stock})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-data">No low stock items</div>
                )}
              </div>

              <div className="inventory-card">
                <h3>Out of Stock</h3>
                {inventory.outOfStock && inventory.outOfStock.length > 0 ? (
                  <ul>
                    {inventory.outOfStock.map((it, i) => (
                      <li key={i}>
                        <strong>{it.product}</strong> — {it.variant}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-data">No out of stock items</div>
                )}
              </div>
            </div>
          </section>

          <section className="dash-section small-cards">
            <div className="small-card">
              <div className="sc-title">Daily Summary</div>
              <div className="sc-body">
                <div>Total Sales: {formatCurrency(daily.totalSales)}</div>
                <div>Total Tax: {formatCurrency(daily.totalTax)}</div>
                <div>Top Selling: {daily.topSellingToday?.[0]?.title ?? "—"}</div>
                <div>Qty: {daily.topSellingToday?.[0]?.qty ?? "—"}</div>
              </div>
            </div>

            <div className="small-card">
              <div className="sc-title">GST Report</div>
              <div className="sc-body">
                <div>Month/Year: {gst.month}/{gst.year}</div>
                <div>Monthly Sales: {formatCurrency(gst.monthlySales)}</div>
                <div>Monthly GST: {formatCurrency(gst.monthlyGST)}</div>
                <div>Bills: {gst.bills ?? 0}</div>
              </div>
            </div>

            <div className="small-card">
              <div className="sc-title">Store Performance (30d)</div>
              <div className="sc-body">
                <div>Orders (30d): {perf.last30_days_orders ?? 0}</div>
                <div>Revenue (30d): {formatCurrency(perf.revenue30)}</div>
                <div>Repeat Customers: {perf.repeatCustomers ?? 0}</div>
              </div>
            </div>
          </section>

          <div className="dash-footer">
            <small>Last updated: {lastFetchedAt ? new Date(lastFetchedAt).toLocaleString() : "—"}</small>
            <button
              className="refresh-btn"
              onClick={() => dispatch(fetchDashboardData())}
            >
              Refresh
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
