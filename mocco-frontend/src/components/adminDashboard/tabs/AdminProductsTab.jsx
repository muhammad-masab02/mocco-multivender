import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAdminProducts } from "../../../services/store/actions/admin";
import { getImageUrl } from "../../../utils/imageUrl";

const AdminProductsTab = () => {
  const dispatch = useDispatch();
  const { products, isProductsLoading, productsError } = useSelector(
    (s) => s.admin,
  );

  useEffect(() => {
    dispatch(fetchAllAdminProducts());
  }, [dispatch]);

  if (isProductsLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-purple-500" />
          <p className="text-sm text-slate-500">Loading products…</p>
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <p className="font-semibold text-red-600">Failed to load products</p>
        <p className="mt-1 text-sm text-red-400">{productsError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">All Products</h2>
        <p className="text-sm text-slate-500">
          {products.length} products listed on platform
        </p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-400">
            No products found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Product
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Shop
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Price
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Sold
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((product, i) => (
                  <tr
                    key={product._id}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(product.images?.[0])}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover border border-slate-100"
                        />
                        <p className="max-w-50 truncate text-sm font-medium text-slate-800">
                          {product.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {product.shop?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                      ${product.discountedPrice ?? product.originalPrice ?? 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {product.stock ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {product.sold_out ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                        {product.category || "—"}
                      </span>
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

export default AdminProductsTab;
