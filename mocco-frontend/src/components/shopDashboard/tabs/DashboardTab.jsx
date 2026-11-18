import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BadgePercent,
  CalendarDays,
  Clock3,
  HandCoins,
  Package,
  ShoppingBag,
  ShoppingCart,
  Wallet,
  TrendingUp,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Plus,
  Store,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import DashboardStatCard from "../shared/DashboardStatCard";

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

const DashboardTab = ({
  seller,
  sellerProducts,
  sellerEvents,
  orders,
  shopOrdersLoading,
  withdrawals,
  pendingOrders,
  averageOrderValue,
  totalRevenue,
  totalSold,
  availableBalance,
  recentOrders,
  stats,
  statsLoading,
  statsError,
  formatMoney,
}) => {
  const navigate = useNavigate();
  const isLoading = statsLoading || shopOrdersLoading;

  const deliveredCount =
    stats?.deliveredOrdersCount ??
    (Array.isArray(orders)
      ? orders.filter((o) => o.status === "Delivered").length
      : 0);

  const totalOrdersDisplay =
    stats?.totalOrders ?? (Array.isArray(orders) ? orders.length : 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ── 1. Hero Welcome & Quick Actions Bar ────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white p-6 sm:p-8 lg:p-10 shadow-lg shadow-slate-900/10">
        <div className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full bg-red-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-red-300 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-red-400" />
              <span>Seller Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Welcome back, <span className="text-red-400">{seller?.name || "Merchant"}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Here is your daily store performance, orders, revenue, and customer activities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {seller?._id && (
              <Link
                to={`/shop/${seller._id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold backdrop-blur-xs transition-all border border-white/10"
              >
                <Store className="w-4 h-4 text-slate-300" />
                <span>View Public Shop</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            )}

            <button
              type="button"
              onClick={() => navigate("/shop-dashboard/?tab=createProduct")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Error Banner ─────────────────────────────────────────────────────── */}
      {statsError && (
        <div className="rounded-3xl border border-red-200 bg-red-50/80 p-4 sm:p-5 flex items-center gap-3 text-red-700 shadow-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <p className="text-xs sm:text-sm font-medium">
            Some dashboard metrics could not be synchronized: {statsError}
          </p>
        </div>
      )}

      {/* ── 3. Available Balance & Financial Spotlight Card ───────────────────── */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 shadow-inner">
              <Wallet className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Available Withdraw Balance
              </p>
              {isLoading ? (
                <div className="h-9 w-36 bg-slate-200 rounded-md animate-pulse mt-1" />
              ) : (
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mt-0.5">
                  {formatMoney(availableBalance ?? 0)}
                </h2>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/shop-dashboard/?tab=withdraw")}
              className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-slate-900/10 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              Withdraw Funds
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Gross Revenue</p>
            <p className="text-lg font-bold text-slate-900 mt-1">
              {formatMoney(totalRevenue ?? 0)}
            </p>
            <span className="text-[11px] text-slate-400">After 10% marketplace fee</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Average Order Value</p>
            <p className="text-lg font-bold text-slate-900 mt-1">
              {formatMoney(averageOrderValue ?? 0)}
            </p>
            <span className="text-[11px] text-slate-400">Per delivered sale</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Pending Processing</p>
            <p className="text-lg font-bold text-amber-600 mt-1">
              {pendingOrders ?? 0} Orders
            </p>
            <span className="text-[11px] text-slate-400">Require fulfillment</span>
          </div>
        </div>
      </div>

      {/* ── 4. Main Metric Cards Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <DashboardStatCard
              title="Total Products"
              value={
                stats?.totalProducts ??
                (Array.isArray(sellerProducts) ? sellerProducts.length : 0)
              }
              subtitle="Active in catalog"
              icon={Package}
              iconWrapClass="bg-blue-50 text-blue-600"
              iconClass="text-blue-600"
              onClick={() => navigate("/shop-dashboard/?tab=allProducts")}
            />
            <DashboardStatCard
              title="Total Orders"
              value={totalOrdersDisplay}
              subtitle={`${deliveredCount} completed`}
              icon={ShoppingBag}
              iconWrapClass="bg-emerald-50 text-emerald-600"
              iconClass="text-emerald-600"
              onClick={() => navigate("/shop-dashboard/?tab=allOrders")}
            />
            <DashboardStatCard
              title="Units Sold"
              value={totalSold ?? 0}
              subtitle="Total items purchased"
              icon={ShoppingCart}
              iconWrapClass="bg-purple-50 text-purple-600"
              iconClass="text-purple-600"
            />
            <DashboardStatCard
              title="Live Sale Events"
              value={
                stats?.activeEvents ??
                (Array.isArray(sellerEvents) ? sellerEvents.length : 0)
              }
              subtitle="Promotional campaigns"
              icon={CalendarDays}
              iconWrapClass="bg-orange-50 text-orange-600"
              iconClass="text-orange-600"
              onClick={() => navigate("/shop-dashboard/?tab=allEvents")}
            />
          </>
        )}
      </div>

      {/* ── 5. Recent Orders Table ────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider mb-1.5">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Order Flow</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Recent Orders
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate("/shop-dashboard/?tab=allOrders")}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-red-600 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View All Orders</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-2xl bg-slate-50 border border-slate-100"
              />
            ))}
          </div>
        ) : !Array.isArray(recentOrders) || recentOrders.length === 0 ? (
          <div className="py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mb-3">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No orders placed yet
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
              When shoppers purchase items from your storefront, new orders will be tracked here in real time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">Items</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {recentOrders.map((order) => {
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
                        {formatMoney(order.totalAmount)}
                      </td>
                      <td className="py-3.5 pr-4 text-slate-600 font-medium">
                        {order.itemCount ?? 1} item{order.itemCount > 1 ? "s" : ""}
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
                          to={`/shop-dashboard/order/${order._id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 hover:underline"
                        >
                          <span>Manage</span>
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

      {/* ── 6. Recent Withdrawals History ────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5">
              <HandCoins className="w-3.5 h-3.5 text-slate-500" />
              <span>Payouts</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Recent Payout Requests
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate("/shop-dashboard/?tab=withdraw")}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-red-600 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View All Payouts</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {!Array.isArray(withdrawals) || withdrawals.length === 0 ? (
          <div className="py-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mb-3">
              <Wallet className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              No payout history yet
            </p>
            <p className="mt-1 text-xs text-slate-500 max-w-sm leading-relaxed">
              Your bank withdrawal requests and settlement records will be listed here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {withdrawals.slice(0, 5).map((w) => (
              <div
                key={w.id || w._id}
                className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors text-xs sm:text-sm"
              >
                <div>
                  <p className="font-bold text-slate-900">
                    {formatMoney(w.amount)}
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      (Fee: {formatMoney(w.fee)} · Net: {formatMoney(w.netAmount)})
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {w.bankName || "Bank Transfer"} {w.accountHolderName ? `· ${w.accountHolderName}` : ""}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 text-[11px] font-bold">
                    {w.status || "Pending"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {w.createdAt ? new Date(w.createdAt).toLocaleDateString() : "Recent"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTab;
