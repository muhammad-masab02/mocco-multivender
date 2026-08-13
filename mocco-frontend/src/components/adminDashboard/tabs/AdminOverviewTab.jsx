import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStats } from "../../../services/store/actions/admin";
import {
  TrendingUp,
  Users,
  Store,
  Package,
  Tag,
  ShoppingBag,
  Wallet,
  DollarSign,
} from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-100" },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      ring: "ring-emerald-100",
    },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      ring: "ring-orange-100",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      ring: "ring-purple-100",
    },
    pink: { bg: "bg-pink-50", text: "text-pink-600", ring: "ring-pink-100" },
    cyan: { bg: "bg-cyan-50", text: "text-cyan-600", ring: "ring-cyan-100" },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      ring: "ring-amber-100",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      ring: "ring-green-100",
    },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
          )}
        </div>
        <div className={`rounded-xl ${c.bg} ${c.ring} ring-1 p-3`}>
          <Icon size={22} className={c.text} />
        </div>
      </div>
    </div>
  );
};

const OrderRow = ({ order, index }) => (
  <tr className={index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
    <td className="px-4 py-3 text-xs font-mono text-slate-500">
      #{order._id?.slice(-8)}
    </td>
    <td className="px-4 py-3 text-sm text-slate-700">
      {order.user?.name || "—"}
    </td>
    <td className="px-4 py-3 text-sm">
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          order.status === "Delivered"
            ? "bg-emerald-100 text-emerald-700"
            : order.status === "Processing"
              ? "bg-blue-100 text-blue-700"
              : order.status === "Cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-amber-100 text-amber-700"
        }`}
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
);

const AdminOverviewTab = () => {
  const dispatch = useDispatch();
  const { stats, isStatsLoading, statsError } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (isStatsLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
          <p className="text-sm text-slate-500">Loading dashboard stats…</p>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <p className="font-semibold text-red-600">Failed to load stats</p>
        <p className="mt-1 text-sm text-red-400">{statsError}</p>
        <button
          onClick={() => dispatch(fetchAdminStats())}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "emerald",
    },
    {
      title: "Total Sellers",
      value: stats.totalSellers,
      icon: Store,
      color: "orange",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "purple",
    },
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: Tag,
      color: "pink",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "cyan",
    },
    {
      title: "Pending Withdrawals",
      value: stats.pendingWithdrawals,
      icon: Wallet,
      color: "amber",
    },
    {
      title: "Gross Platform Sales",
      value: `$${stats.grossSales?.toFixed(2) || "0.00"}`,
      icon: TrendingUp,
      color: "blue",
      subtitle: "From delivered orders",
    },
    {
      title: "Platform Earnings (10%)",
      value: `$${stats.platformEarnings?.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      color: "green",
      subtitle: "10% of gross sales",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((c) => (
          <StatCard key={c.title} {...c} />
        ))}
      </div>

      {/* Latest Orders */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="text-base font-semibold text-slate-800">
            Latest Orders
          </h3>
        </div>
        {stats.latestOrders?.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-400">
            No orders yet.
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
                {stats.latestOrders?.map((order, i) => (
                  <OrderRow key={order._id} order={order} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverviewTab;
