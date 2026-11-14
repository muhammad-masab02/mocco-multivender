import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllAdminProducts } from "../../../services/store/actions/admin";
import { getImageUrl } from "../../../utils/imageUrl";
import {
  Package,
  Search,
  ExternalLink,
  Store,
  Tag,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Boxes,
} from "lucide-react";

const AdminProductsTab = () => {
  const dispatch = useDispatch();
  const { products, isProductsLoading, productsError } = useSelector(
    (s) => s.admin,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");

  useEffect(() => {
    dispatch(fetchAllAdminProducts());
  }, [dispatch]);

  // Extract unique categories
  const categories = useMemo(() => {
    if (!Array.isArray(products)) return [];
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(set);
  }, [products]);

  // Inventory stats
  const stats = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    const total = list.length;
    const inStock = list.filter((p) => (p.stock || 0) > 5).length;
    const lowStock = list.filter(
      (p) => (p.stock || 0) > 0 && (p.stock || 0) <= 5,
    ).length;
    const outOfStock = list.filter((p) => !p.stock || p.stock <= 0).length;
    const totalSold = list.reduce((acc, p) => acc + (p.sold_out || 0), 0);

    return { total, inStock, lowStock, outOfStock, totalSold };
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.shop?.name?.toLowerCase().includes(q);

      const matchesCat =
        categoryFilter === "ALL" || p.category === categoryFilter;

      let matchesStock = true;
      if (stockFilter === "IN_STOCK") matchesStock = (p.stock || 0) > 5;
      else if (stockFilter === "LOW_STOCK")
        matchesStock = (p.stock || 0) > 0 && (p.stock || 0) <= 5;
      else if (stockFilter === "OUT_OF_STOCK")
        matchesStock = !p.stock || p.stock <= 0;

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [products, searchQuery, categoryFilter, stockFilter]);

  if (isProductsLoading && products.length === 0) {
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Package className="w-3.5 h-3.5" />
            <span>Platform Catalog</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            All Products ({products.length})
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search product or shop..."
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-medium outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 shadow-xs"
          />
        </div>
      </div>

      {productsError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium">
          {productsError}
        </div>
      )}

      {/* Mini Stats Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Listings
          </p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {stats.total}
          </p>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Healthy Stock
          </p>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
            {stats.inStock}
          </p>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
            Low / Out of Stock
          </p>
          <p className="text-xl sm:text-2xl font-black text-amber-700 mt-1">
            {stats.lowStock + stats.outOfStock}
          </p>
        </div>
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
            Total Sold Units
          </p>
          <p className="text-xl sm:text-2xl font-black text-purple-700 mt-1">
            {stats.totalSold}
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Stock Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: "ALL", label: "All Items" },
            { id: "IN_STOCK", label: "In Stock" },
            { id: "LOW_STOCK", label: "Low Stock (≤5)" },
            { id: "OUT_OF_STOCK", label: "Out of Stock" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStockFilter(item.id)}
              className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap ${
                stockFilter === item.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Category:
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold outline-none cursor-pointer text-xs"
            >
              <option value="ALL">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center text-slate-400 space-y-2">
            <Package className="w-10 h-10 text-slate-300" />
            <p className="text-sm font-semibold">No products found</p>
            <p className="text-xs text-slate-400 max-w-xs">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-5 py-3.5">Shop</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Stock</th>
                  <th className="px-5 py-3.5">Sold</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredProducts.map((product) => {
                  const stock = product.stock ?? 0;
                  const isLow = stock > 0 && stock <= 5;
                  const isOut = stock <= 0;

                  return (
                    <tr
                      key={product._id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Product Thumbnail & Name */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(
                              product.images?.[0],
                              "https://dummyimage.com/100",
                            )}
                            alt={product.name}
                            className="h-10 w-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="max-w-xs">
                            <p className="font-bold text-slate-900 truncate">
                              {product.name}
                            </p>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ID: #{product._id?.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Shop */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-semibold text-slate-800">
                            {product.shop?.name || "Independent"}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        ${product.discountedPrice ?? product.originalPrice ?? 0}
                        {product.discountedPrice &&
                          product.originalPrice &&
                          product.discountedPrice < product.originalPrice && (
                            <span className="block text-[10px] text-slate-400 line-through font-normal">
                              ${product.originalPrice}
                            </span>
                          )}
                      </td>

                      {/* Stock Level */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            isOut
                              ? "bg-red-50 text-red-700 border-red-200"
                              : isLow
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {isOut ? (
                            <span>Out of Stock</span>
                          ) : isLow ? (
                            <span>Low: {stock} left</span>
                          ) : (
                            <span>{stock} units</span>
                          )}
                        </span>
                      </td>

                      {/* Sold Count */}
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-slate-400" />
                          <span>{product.sold_out ?? 0}</span>
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold uppercase tracking-wider">
                          <Tag className="w-2.5 h-2.5" />
                          <span>{product.category || "General"}</span>
                        </span>
                      </td>

                      {/* View Link */}
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          to={`/product-detail/${product._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs"
                        >
                          <ExternalLink size={13} />
                          <span>Open</span>
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

export default AdminProductsTab;
