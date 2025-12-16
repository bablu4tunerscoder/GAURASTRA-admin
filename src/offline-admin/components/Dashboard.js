import { useFetchDashboardDataQuery } from "../../Redux/Slices/dashboardSlice";
const Dashboard = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fulfilledTimeStamp,
  } = useFetchDashboardDataQuery();

  const realTime = data?.real_time_sales || {};
  const inventory = data?.inventory_status || {};
  const daily = data?.daily_summary || {};
  const gst = data?.gst_report || {};
  const perf = data?.store_performance || {};

  const formatCurrency = (val) =>
    typeof val === "number" ? `₹ ${val.toLocaleString()}` : val || "—";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Offline Store Dashboard</h1>

        {isLoading && (
          <div className="text-gray-500">Loading dashboard...</div>
        )}

        {isError && (
          <div className="text-red-600">
            {error?.message || "Failed to load dashboard"}
          </div>
        )}

        {!isLoading && !isError && data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-5 rounded-xl shadow">
                <div className="text-gray-500 text-sm">Orders Today</div>
                <div className="text-2xl font-semibold">
                  {realTime.orders_today ?? 0}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow">
                <div className="text-gray-500 text-sm">Total Sales Today</div>
                <div className="text-2xl font-semibold">
                  {formatCurrency(
                    realTime.total_sales_today ?? daily.totalSales
                  )}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow">
                <div className="text-gray-500 text-sm">Items Sold Today</div>
                <div className="text-2xl font-semibold">
                  {daily.totalItemsSold ?? 0}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow">
                <div className="text-gray-500 text-sm">
                  Avg Order Value (30 days)
                </div>
                <div className="text-2xl font-semibold">
                  {formatCurrency(perf.avgOrderValue ?? 0)}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow mb-8 overflow-x-auto">
              <div className="p-4 font-semibold border-b">
                Today's Orders
              </div>
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-3 text-left">#</th>
                    <th className="p-3 text-left">Customer</th>
                    <th className="p-3 text-left">Phone</th>
                    <th className="p-3 text-left">Items</th>
                    <th className="p-3 text-left">Total</th>
                    <th className="p-3 text-left">Payment</th>
                    <th className="p-3 text-left">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {realTime.salesToday?.length ? (
                    realTime.salesToday.map((o, idx) => (
                      <tr
                        key={o._id || idx}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="p-3">{idx + 1}</td>
                        <td className="p-3">
                          {o.user_info?.full_name ?? "—"}
                        </td>
                        <td className="p-3">
                          {o.user_info?.phone ?? "—"}
                        </td>
                        <td className="p-3 space-y-1">
                          {o.items?.map((it) => (
                            <div key={it._id}>
                              {it.title} × {it.quantity} (
                              {formatCurrency(it.line_total)})
                            </div>
                          ))}
                        </td>
                        <td className="p-3">
                          {formatCurrency(o.total_amount)}
                        </td>
                        <td className="p-3">
                          {o.payment_method ?? "—"}
                        </td>
                        <td className="p-3">
                          {o.createdAt
                            ? new Date(o.createdAt).toLocaleString()
                            : "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-6 text-center text-gray-500"
                      >
                        No orders today
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-5 rounded-xl shadow">
                <h3 className="font-semibold mb-3">Low Stock</h3>
                {inventory.lowStock?.length ? (
                  <ul className="space-y-1 text-sm">
                    {inventory.lowStock.map((it, i) => (
                      <li key={i}>
                        <strong>{it.product}</strong> — {it.variant} (stock:{" "}
                        {it.stock})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500 text-sm">
                    No low stock items
                  </div>
                )}
              </div>

              <div className="bg-white p-5 rounded-xl shadow">
                <h3 className="font-semibold mb-3">Out of Stock</h3>
                {inventory.outOfStock?.length ? (
                  <ul className="space-y-1 text-sm">
                    {inventory.outOfStock.map((it, i) => (
                      <li key={i}>
                        <strong>{it.product}</strong> — {it.variant}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500 text-sm">
                    No out of stock items
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-5 rounded-xl shadow">
                <div className="font-semibold mb-2">Daily Summary</div>
                <div className="text-sm space-y-1">
                  <div>Total Sales: {formatCurrency(daily.totalSales)}</div>
                  <div>Total Tax: {formatCurrency(daily.totalTax)}</div>
                  <div>
                    Top Selling:{" "}
                    {daily.topSellingToday?.[0]?.title ?? "—"}
                  </div>
                  <div>
                    Qty: {daily.topSellingToday?.[0]?.qty ?? "—"}
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow">
                <div className="font-semibold mb-2">GST Report</div>
                <div className="text-sm space-y-1">
                  <div>
                    Month/Year: {gst.month}/{gst.year}
                  </div>
                  <div>
                    Monthly Sales: {formatCurrency(gst.monthlySales)}
                  </div>
                  <div>
                    Monthly GST: {formatCurrency(gst.monthlyGST)}
                  </div>
                  <div>Bills: {gst.bills ?? 0}</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow">
                <div className="font-semibold mb-2">
                  Store Performance (30d)
                </div>
                <div className="text-sm space-y-1">
                  <div>Orders: {perf.last30_days_orders ?? 0}</div>
                  <div>
                    Revenue: {formatCurrency(perf.revenue30)}
                  </div>
                  <div>
                    Repeat Customers: {perf.repeatCustomers ?? 0}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                Last updated:{" "}
                {fulfilledTimeStamp
                  ? new Date(fulfilledTimeStamp).toLocaleString()
                  : "—"}
              </span>
              <button
                onClick={refetch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Refresh
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
