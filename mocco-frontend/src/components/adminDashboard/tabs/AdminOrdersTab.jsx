import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAdminOrders } from "../../../services/store/actions/admin";

const AdminOrdersTab = () => {
  const dispatch = useDispatch();
  const { orders, isOrdersLoading, ordersError } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAllAdminOrders());
  }, [dispatch]);

  const statusColor = (status) => {
    const map = {
      Delivered: "bg-emerald-100 text-emerald-700",
      Processing: "bg-blue-100 text-blue-700",
      Shipped: "bg-sky-100 text-sky-700",
      Cancelled: "bg-red-100 text-red-700",
      "Out for delivery": "bg-amber-100 text-amber-700",
    };
    return map[status] || "bg-slate-100 text-slate-600";
  };

  if (isOrdersLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
          <p className="text-sm text-slate-500">Loading orders…</p>
        </div>
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <p className="font-semibold text-red-600">Failed to load orders</p>
        <p className="mt-1 text-sm text-red-400">{ordersError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">All Orders</h2>
        <p className="text-sm text-slate-500">{orders.length} total orders</p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-400">
            No orders found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Items
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Total
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((order, i) => (
                  <tr
                    key={order._id}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                  >
                    <td className="px-4 py-3 text-xs font-mono text-slate-500">
                      #{order._id?.slice(-8)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-800">
                        {order.user?.name || "Guest"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {order.user?.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {order.items?.length ?? 0} item(s)
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                      ${order.totalAmount?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
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

export default AdminOrdersTab;
