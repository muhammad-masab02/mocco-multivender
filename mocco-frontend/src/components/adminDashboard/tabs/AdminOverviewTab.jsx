import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
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
  Sparkles,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const STATUS_CONFIG = {
  Processing: "bg-blue-50 text-blue-700 border-blue-200",
  "Ready for Pickup": "bg-purple-50 text-purple-700 border-purple-200",
  Shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Out for Delivery": "bg-amber-50 text-amber-700 border-amber-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
  "Processing Refund": "bg-orange-50 text-orange-700 border-orange-200",
  "Refund Success": "bg-teal-50 text-teal-700 border-teal-200",
  Returned: "bg-slate-100 text-slate-700 border-slate-200",
  "Pending Payment": "bg-amber-50 text-amber-700 border-amber-200",
};

const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, subtitle, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs hover:shadow-[0_16px_36px_rgba(239,68,68,0.08)] hover:border-red-200/80 transition-all duration-300 hover:-translate-y-1 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {value}
          </p>
        </div>

        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${bgClass}`}
        >
          <Icon className={`w-5 h-5 ${colorClass}`} />
        </div>
      </div>

      {subtitle && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-400 truncate">{subtitle}</p>
        </div>
      )}
    </div>
  );
};

const StatSkeleton = () => (
  <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs animate-pulse space-y-4">
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-2 flex-1">
        <div className="h-3.5 w-24 bg-slate-200 rounded-md" />
        <div className="h-7 w-20 bg-slate-200 rounded-md" />
      </div>
      <div className="h-12 w-12 rounded-2xl bg-slate-100 shrink-0" />
    </div>
    <div className="pt-3 border-t border-slate-100">
      <div className="h-3 w-32 bg-slate-100 rounded" />
    </div>
  </div>
);

const AdminOverviewTab = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, isStatsLoading, statsError } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (isStatsLoading && !stats) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="h-36 rounded-3xl bg-slate-900 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <StatSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (statsError && !stats) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Failed to Load Metrics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {statsError}
          </p>
          <button
            type="button"
            onClick={() => dispatch(fetchAdminStats())}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-md shadow-red-600/20 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Shoppers",
      value: stats?.totalUsers || 0,
      icon: Users,
      bgClass: "bg-blue-50",
      colorClass: "text-blue-600",
      subtitle: "Active customer accounts",
      onClick: () => navigate("/admin?tab=allUsers"),
    },
    {
      title: "Active Stores",
      value: stats?.totalSellers || 0,
      icon: Store,
      bgClass: "bg-emerald-50",
      colorClass: "text-emerald-600",
      subtitle: "Verified marketplace vendors",
      onClick: () => navigate("/admin?tab=allSellers"),
    },
    {
      title: "Catalog Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      bgClass: "bg-purple-50",
      colorClass: "text-purple-600",
      subtitle: "Live items across stores",
      onClick: () => navigate("/admin?tab=allProducts"),
    },
    {
      title: "Sale Events",
      value: stats?.totalEvents || 0,
      icon: Tag,
      bgClass: "bg-pink-50",
      colorClass: "text-pink-600",
      subtitle: "Promotions & flash sales",
      onClick: () => navigate("/admin?tab=allEvents"),
    },
    {
      title: "Platform Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      bgClass: "bg-sky-50",
      colorClass: "text-sky-600",
      subtitle: "Lifetime customer checkouts",
      onClick: () => navigate("/admin?tab=allOrders"),
    },
    {
      title: "Pending Payouts",
      value: stats?.pendingWithdrawals || 0,
      icon: Wallet,
      bgClass: "bg-amber-50",
      colorClass: "text-amber-600",
      subtitle: "Vendor withdrawals pending",
      onClick: () => navigate("/admin?tab=withdraw"),
    },
    {
      title: "Gross Marketplace Sales",
      value: `$${(stats?.grossSales || 0).toFixed(2)}`,
      icon: TrendingUp,
      bgClass: "bg-emerald-50",
      colorClass: "text-emerald-600",
      subtitle: "Delivered order transactions",
    },
    {
      title: "Platform Revenue (10%)",
      value: `$${(stats?.platformEarnings || 0).toFixed(2)}`,
      icon: DollarSign,
      bgClass: "bg-red-50",
      colorClass: "text-red-600",
      subtitle: "10% commission on orders",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ── 1. Hero Welcome & Admin Overview Banner ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 text-white p-6 sm:p-8 lg:p-10 shadow-lg shadow-slate-900/10">
        <div className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full bg-red-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-red-300 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>Executive Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Platform <span className="text-red-400">Administration</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Real-time monitoring of marketplace operations, sales volume, sellers, customers, and settlement workflows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold backdrop-blur-xs transition border border-white/10"
            >
              <span>Visit Marketplace</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <button
              type="button"
              onClick={() => dispatch(fetchAdminStats())}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-600/30 transition hover:-translate-y-0.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Metric Stat Cards Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c) => (
          <StatCard key={c.title} {...c} />
        ))}
      </div>

      {/* ── 3. Latest Orders Table ────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider mb-1.5">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Recent Activity</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Latest Customer Orders
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin?tab=all-orders")}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-red-600 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View All Orders</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {!stats?.latestOrders || stats.latestOrders.length === 0 ? (
          <div className="py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mb-3">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No orders placed yet
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
              When buyers make purchases from sellers, transactions will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {stats.latestOrders.map((order) => {
                  const statusClass =
                    STATUS_CONFIG[order.status] ||
                    "bg-slate-100 text-slate-700 border-slate-200";

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3.5 pr-4 font-mono font-bold text-slate-900">
                        #{String(order._id).slice(-8).toUpperCase()}
                      </td>
                      <td className="py-3.5 pr-4 font-medium text-slate-800">
                        {order.user?.name || "Customer"}
                      </td>
                      <td className="py-3.5 pr-4 text-slate-500 text-xs">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </td>
                      <td className="py-3.5 pr-4 font-bold text-slate-900">
                        ${Number(order.totalAmount || 0).toFixed(2)}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusClass}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          to={`/order/${order._id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
                        >
                          <span>View</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
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

export default AdminOverviewTab;
