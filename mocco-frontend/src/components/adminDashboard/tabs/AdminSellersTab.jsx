import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllSellers,
  deleteAdminSeller,
} from "../../../services/store/actions/admin";
import toast from "react-hot-toast";
import { getImageUrl } from "../../../utils/imageUrl";
import { Trash2 } from "lucide-react";

const AdminSellersTab = () => {
  const dispatch = useDispatch();
  const { sellers, isSellersLoading, sellersError } = useSelector(
    (s) => s.admin,
  );

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

  if (isSellersLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
          <p className="text-sm text-slate-500">Loading sellers…</p>
        </div>
      </div>
    );
  }

  if (sellersError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <p className="font-semibold text-red-600">Failed to load sellers</p>
        <p className="mt-1 text-sm text-red-400">{sellersError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">All Sellers</h2>
          <p className="text-sm text-slate-500">
            {sellers.length} registered sellers
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        {sellers.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-400">
            No sellers found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Shop
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Email
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sellers.map((seller, i) => (
                  <tr
                    key={seller._id}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(seller.avatar)}
                          alt={seller.name}
                          className="h-9 w-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {seller.name}
                          </p>
                          {seller.address && (
                            <p className="text-xs text-slate-400">
                              {seller.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {seller.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {seller.phoneNumber || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(seller.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(seller._id, seller.name)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition cursor-pointer"
                      >
                        <Trash2 size={13} />
                        Delete
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
