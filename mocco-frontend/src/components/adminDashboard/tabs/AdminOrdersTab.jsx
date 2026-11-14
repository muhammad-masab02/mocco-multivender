import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAdminOrders } from "../../../services/store/actions/admin";
import { getImageUrl } from "../../../utils/imageUrl";
import {
  ShoppingBag,
  Search,
  Eye,
  X,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  MapPin,
  Calendar,
  Store,
  User,
} from "lucide-react";

const statusConfig = {
  Delivered: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  Processing: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    icon: Clock,
  },
  Shipped: {
    badge: "bg-sky-50 text-sky-700 border-sky-200",
    dot: "bg-sky-500",
    icon: Truck,
  },
  "Out for Delivery": {
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
    icon: Truck,
  },
  Cancelled: {
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    icon: AlertCircle,
  },
  "Refund Success": {
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
    icon: CheckCircle2,
  },
};

const AdminOrdersTab = () => {
  const dispatch = useDispatch();
  const { orders, isOrdersLoading, ordersError } = useSelector((s) => s.admin);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchAllAdminOrders());
  }, [dispatch]);

  const orderStats = useMemo(() => {
    const list = Array.isArray(orders) ? orders : [];
    const total = list.length;
    const delivered = list.filter((o) => o.status === "Delivered").length;
    const processing = list.filter(
      (o) => o.status === "Processing" || o.status === "Pending Payment",
    ).length;
    const inTransit = list.filter(
      (o) => o.status === "Shipped" || o.status === "Out for Delivery",
    ).length;
    const totalVolume = list.reduce(
      (acc, o) => acc + (Number(o.totalAmount) || 0),
      0,
    );
    return { total, delivered, processing, inTransit, totalVolume };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];
    return orders.filter((order) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        order._id?.toLowerCase().includes(q) ||
        order.user?.name?.toLowerCase().includes(q) ||
        order.user?.email?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "Delivered" && order.status === "Delivered") ||
        (statusFilter === "Processing" &&
          (order.status === "Processing" || order.status === "Pending Payment")) ||
        (statusFilter === "In Transit" &&
          (order.status === "Shipped" || order.status === "Out for Delivery")) ||
        (statusFilter === "Cancelled" &&
          (order.status === "Cancelled" || order.status?.includes("Refund")));

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const getStatusBadge = (status) => {
    const conf = statusConfig[status] || {
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      dot: "bg-slate-400",
      icon: Clock,
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${conf.badge}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
        <span>{status || "Pending"}</span>
      </span>
    );
  };

  if (isOrdersLoading && orders.length === 0) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 rounded-md animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1.5">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Fulfillment Operations</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Customer Orders ({orders.length})
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID or customer..."
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-medium outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 shadow-xs"
          />
        </div>
      </div>

      {ordersError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium">
          {ordersError}
        </div>
      )}

      {/* Mini Stats Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Orders
          </p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {orderStats.total}
          </p>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Delivered
          </p>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
            {orderStats.delivered}
          </p>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
            Processing
          </p>
          <p className="text-xl sm:text-2xl font-black text-amber-700 mt-1">
            {orderStats.processing}
          </p>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
            In Transit
          </p>
          <p className="text-xl sm:text-2xl font-black text-sky-700 mt-1">
            {orderStats.inTransit}
          </p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: "ALL", label: "All Orders" },
          { id: "Processing", label: "Processing" },
          { id: "In Transit", label: "In Transit" },
          { id: "Delivered", label: "Delivered" },
          { id: "Cancelled", label: "Cancelled / Refunds" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === tab.id
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center text-slate-400 space-y-2">
            <ShoppingBag className="w-10 h-10 text-slate-300" />
            <p className="text-sm font-semibold">No orders found</p>
            <p className="text-xs text-slate-400 max-w-xs">
              Try adjusting your search query or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3.5">Order ID</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Items</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Payment</th>
                  <th className="px-5 py-3.5">Total</th>
                  <th className="px-5 py-3.5">Placed On</th>
                  <th className="px-5 py-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredOrders.map((order) => {
                  const firstItem = order.items?.[0];
                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Order ID */}
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md text-xs">
                          #{order._id?.slice(-8)}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-900">
                          {order.user?.name || "Guest User"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {order.user?.email || "—"}
                        </p>
                      </td>

                      {/* Items */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {firstItem?.productId?.images?.[0] && (
                            <img
                              src={getImageUrl(firstItem.productId.images[0])}
                              alt=""
                              className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                            />
                          )}
                          <span className="font-medium text-slate-700">
                            {order.items?.length ?? 0} item
                            {(order.items?.length || 0) !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        {getStatusBadge(order.status)}
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 text-slate-600 font-medium text-xs">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          <span>{order.paymentInfo?.method || "Card"}</span>
                        </span>
                        {order.paymentInfo?.paymentStatus && (
                          <span
                            className={`block text-[10px] font-bold uppercase tracking-wider ${
                              order.paymentInfo.paymentStatus === "Paid"
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            {order.paymentInfo.paymentStatus}
                          </span>
                        )}
                      </td>

                      {/* Total */}
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        ${order.totalAmount?.toFixed(2) || "0.00"}
                      </td>

                      {/* Placed On */}
                      <td className="px-5 py-3.5 text-slate-400 text-xs">
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

                      {/* Action */}
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-blue-50 text-blue-600">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Order Details
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    ID: {selectedOrder._id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
              {/* Top Summary Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Status
                  </span>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Total
                  </span>
                  <span className="font-black text-slate-900 text-base">
                    ${selectedOrder.totalAmount?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Payment
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedOrder.paymentInfo?.method || "Standard"}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Placed Date
                  </span>
                  <span className="font-semibold text-slate-800">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Customer & Shipping Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-100 bg-white">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Customer Information</span>
                  </p>
                  <p className="font-bold text-slate-900">
                    {selectedOrder.user?.name || "Guest Customer"}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {selectedOrder.user?.email || "No email available"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-100 bg-white">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Shipping Address</span>
                  </p>
                  {selectedOrder.shippingAddress ? (
                    <div className="text-slate-600 text-xs space-y-0.5">
                      <p className="font-medium text-slate-800">
                        {selectedOrder.shippingAddress.address1 ||
                          selectedOrder.shippingAddress.street ||
                          "—"}
                      </p>
                      <p>
                        {[
                          selectedOrder.shippingAddress.city,
                          selectedOrder.shippingAddress.state,
                          selectedOrder.shippingAddress.zipCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      <p>{selectedOrder.shippingAddress.country || ""}</p>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs">No address specified</p>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Purchased Items ({selectedOrder.items?.length || 0})
                </p>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-white">
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 sm:p-4 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(
                            item.productId?.images?.[0] || item.images?.[0],
                          )}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">
                            {item.productId?.name || item.name || "Product"}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                            <Store className="w-3 h-3" />
                            <span>
                              {item.productId?.shop?.name ||
                                item.shop?.name ||
                                "Marketplace Vendor"}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-bold text-slate-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-400">
                          ${item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersTab;
