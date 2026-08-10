import {
  BadgePercent,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  HandCoins,
  Package,
  ShoppingBag,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import DashboardStatCard from "../shared/DashboardStatCard";

const STATUS_COLORS = {
  Processing: "bg-blue-100 text-blue-700",
  "Ready for Pickup": "bg-purple-100 text-purple-700",
  Shipped: "bg-indigo-100 text-indigo-700",
  "Out for Delivery": "bg-yellow-100 text-yellow-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
  "Processing Refund": "bg-orange-100 text-orange-700",
  "Refund Success": "bg-teal-100 text-teal-700",
  Returned: "bg-slate-100 text-slate-600",
  "Pending Payment": "bg-amber-100 text-amber-700",
};

const StatSkeleton = () => (
  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm animate-pulse">
    <div className="flex items-start justify-between gap-3">
      <div className="h-4 w-28 bg-slate-200 rounded" />
      <div className="h-10 w-10 bg-slate-100 rounded-xl" />
    </div>
    <div className="mt-4 h-7 w-20 bg-slate-200 rounded" />
    <div className="mt-2 h-3 w-24 bg-slate-100 rounded" />
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
  const isLoading = statsLoading || shopOrdersLoading;

  // Compute delivered count from real orders if stats not yet loaded
  const deliveredCount =
    stats?.deliveredOrdersCount ??
    (Array.isArray(orders)
      ? orders.filter((o) => o.status === "Delivered").length
      : 0);

  const totalOrdersDisplay =
    stats?.totalOrders ?? (Array.isArray(orders) ? orders.length : 0);

  return (
    <div className="space-y-6">
      {/* ── Welcome ──────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl p-6 text-center sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.24em] text-red-500">
          Dashboard Overview
        </p>
        <h1 className="mt-3 text-2xl font-normal tracking-tight text-slate-900 sm:text-3xl">
          Welcome back, {seller?.name || "Seller"}
        </h1>
        <div className="mx-auto mt-8 h-0.5 w-20 rounded-full bg-slate-400" />
      </div>

      {/* ── Error Banner ─────────────────────────────────────────────────────── */}
      {statsError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
          Failed to load some stats: {statsError}
        </div>
      )}

      {/* ── Available Balance ────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_10px_26px_rgba(15,23,42,0.06)]">
        <p className="text-lg font-medium text-slate-700 sm:text-xl">
          Available Balance
        </p>
        <div className="mx-auto mt-2 h-0.5 w-14 rounded-full bg-slate-400" />
        {isLoading ? (
          <div className="mt-5 flex justify-center">
            <div className="h-10 w-28 animate-pulse rounded-lg bg-slate-200" />
          </div>
        ) : (
          <>
            <p className="mt-5 text-3xl font-semibold text-slate-900 sm:text-4xl">
              {formatMoney(availableBalance ?? 0)}
            </p>
            {availableBalance === null || availableBalance === undefined ? (
              <p className="mt-2 text-xs text-slate-400">
                Balance tracking not yet available
              </p>
            ) : availableBalance === 0 ? (
              <p className="mt-2 text-xs text-slate-400">
                No funds available yet
              </p>
            ) : null}
          </>
        )}
      </div>

      {/* ── Stat Cards Grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 7 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <DashboardStatCard
              title="Total Products"
              value={
                stats?.totalProducts ??
                (Array.isArray(sellerProducts) ? sellerProducts.length : 0)
              }
              icon={Package}
              iconWrapClass="bg-blue-50"
              iconClass="text-blue-600"
            />
            <DashboardStatCard
              title="Total Orders"
              value={totalOrdersDisplay}
              subtitle={`${deliveredCount} delivered`}
              icon={ShoppingBag}
              iconWrapClass="bg-emerald-50"
              iconClass="text-emerald-600"
            />
            <DashboardStatCard
              title="Total Revenue"
              value={formatMoney(totalRevenue ?? 0)}
              subtitle="After 10% platform fees"
              icon={Wallet}
              iconWrapClass="bg-violet-50"
              iconClass="text-violet-600"
            />
            <DashboardStatCard
              title="Active Events"
              value={
                stats?.activeEvents ??
                (Array.isArray(sellerEvents) ? sellerEvents.length : 0)
              }
              icon={CalendarDays}
              iconWrapClass="bg-orange-50"
              iconClass="text-orange-600"
            />
            <DashboardStatCard
              title="Pending Orders"
              value={pendingOrders ?? 0}
              icon={Clock3}
              iconWrapClass="bg-blue-50"
              iconClass="text-blue-600"
            />
            <DashboardStatCard
              title="Average Order Value"
              value={formatMoney(averageOrderValue ?? 0)}
              icon={HandCoins}
              iconWrapClass="bg-emerald-50"
              iconClass="text-emerald-600"
            />
            <DashboardStatCard
              title="Withdrawal Requests"
              value={
                stats?.withdrawalRequests !== null &&
                stats?.withdrawalRequests !== undefined
                  ? stats.withdrawalRequests
                  : Array.isArray(withdrawals)
                    ? withdrawals.length
                    : 0
              }
              icon={BadgePercent}
              iconWrapClass="bg-violet-50"
              iconClass="text-violet-600"
            />
            <DashboardStatCard
              title="Products Sold"
              value={totalSold ?? 0}
              subtitle="Total units sold"
              icon={ShoppingCart}
              iconWrapClass="bg-rose-50"
              iconClass="text-rose-600"
            />
          </>
        )}
      </div>

      {/* ── Recent Orders ─────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_10px_26px_rgba(15,23,42,0.06)]">
        <h2 className="text-xl font-medium tracking-tight text-slate-900 text-center">
          Recent Orders
        </h2>
        <div className="mx-auto mt-4 h-0.5 w-16 rounded-full bg-slate-400" />

        {isLoading ? (
          <div className="mt-8 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : !Array.isArray(recentOrders) || recentOrders.length === 0 ? (
          <div className="mt-10 flex flex-col items-center text-center">
            <CircleDollarSign className="text-slate-300" size={40} />
            <p className="mt-6 text-lg font-normal text-slate-700 sm:text-xl">
              No orders yet
            </p>
            <p className="mx-auto mt-2 max-w-2xl leading-7 text-slate-500">
              Your recent orders will appear here once customers start placing
              them.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-3 pr-4 font-medium">Order ID</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 pr-4 font-medium">Amount</th>
                  <th className="pb-3 pr-4 font-medium">Items</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="py-3 text-slate-700">
                    <td className="py-3 pr-4 font-mono text-xs text-slate-500">
                      #{String(order._id).slice(-8).toUpperCase()}
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-500">
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
                    <td className="py-3 pr-4 font-semibold">
                      {formatMoney(order.totalAmount)}
                    </td>
                    <td className="py-3 pr-4 text-slate-500">
                      {order.itemCount ?? "—"}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          STATUS_COLORS[order.status] ??
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Recent Withdrawals ───────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_10px_26px_rgba(15,23,42,0.06)]">
        <h2 className="text-xl font-medium tracking-tight text-slate-900">
          Recent Transactions
        </h2>
        <div className="mx-auto mt-4 h-0.5 w-16 rounded-full bg-slate-400" />
        {!Array.isArray(withdrawals) || withdrawals.length === 0 ? (
          <>
            <CircleDollarSign
              className="mx-auto mt-12 text-slate-300"
              size={40}
            />
            <p className="mt-6 text-lg font-normal text-slate-700 sm:text-xl">
              No transactions yet
            </p>
            <p className="mx-auto mt-2 max-w-2xl leading-7 text-slate-500">
              Your withdrawal history will appear here once you make your first
              withdrawal
            </p>
          </>
        ) : (
          <div className="mt-6 space-y-3 text-left">
            {withdrawals.map((w) => (
              <div
                key={w.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatMoney(w.amount)}
                    <span className="ml-2 text-xs text-slate-400">
                      (fee: {formatMoney(w.fee)}, net:{" "}
                      {formatMoney(w.netAmount)})
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {w.bankName} · {w.accountHolderName}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                    {w.status}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(w.createdAt).toLocaleDateString()}
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
