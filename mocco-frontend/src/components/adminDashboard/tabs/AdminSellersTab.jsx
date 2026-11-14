import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchAllSellers,
  deleteAdminSeller,
} from "../../../services/store/actions/admin";
import toast from "react-hot-toast";
import { getImageUrl } from "../../../utils/imageUrl";
import { Trash2, Store, Search, ExternalLink, MapPin, Phone } from "lucide-react";

const AdminSellersTab = () => {
  const dispatch = useDispatch();
  const { sellers, isSellersLoading, sellersError } = useSelector(
    (s) => s.admin,
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchAllSellers());
  }, [dispatch]);

  const handleDelete = async (sellerId, name) => {
    if (
      !window.confirm(
        `Delete seller shop "${name}"? All their products and events will also be deleted. This cannot be undone.`,
      )
    )
      return;
    const result = await dispatch(deleteAdminSeller(sellerId));
    if (result.success) {
      toast.success("Seller and associated products deleted!");
    } else {
      toast.error(result.message || "Failed to delete seller.");
    }
  };

  const filteredSellers = useMemo(() => {
    if (!Array.isArray(sellers)) return [];
    if (!searchQuery.trim()) return sellers;
    const q = searchQuery.toLowerCase();
    return sellers.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.addresses?.toLowerCase().includes(q),
    );
  }, [sellers, searchQuery]);

  if (isSellersLoading && sellers.length === 0) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 rounded-md animate-pulse" />
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Store className="w-3.5 h-3.5" />
            <span>Vendors Network</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Storefronts ({sellers.length})
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shops or emails..."
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-medium outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 shadow-xs"
          />
        </div>
      </div>

      {sellersError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium">
          {sellersError}
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {filteredSellers.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center text-slate-400 space-y-2">
            <Store className="w-10 h-10 text-slate-300" />
            <p className="text-sm font-semibold">No seller storefronts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3.5">Store Details</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Address</th>
                  <th className="px-5 py-3.5">Registered</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredSellers.map((seller) => (
                  <tr
                    key={seller._id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(seller.avatar?.url || seller.avatar, "https://dummyimage.com/100")}
                          alt={seller.name}
                          className="h-9 w-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{seller.name}</span>
                            <Link
                              to={`/shop/${seller._id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-red-600 transition-colors"
                              title="Open public storefront"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </p>
                          {seller.phoneNumber && (
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3" />
                              <span>{seller.phoneNumber}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">
                      {seller.email}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs max-w-xs truncate">
                      {seller.addresses || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">
                      {seller.createdAt
                        ? new Date(seller.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(seller._id, seller.name)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
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

export default AdminSellersTab;
